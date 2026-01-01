/**
 * WHY: To provide a centralized, rate-limited, and resilient communication bridge between ElizaOS and the Bithub swarm.
 * WHAT: A native ElizaOS Service that manages authentication, synaptic throttling (rate limiting), and request retries.
 * HOW: Implements the Service interface; uses a singleton pattern via runtime injection; follows Guard -> Do -> Verify for all API calls.
 */

import { IAgentRuntime, Service, ServiceType } from '@elizaos/core';
import { SendPrivateMessage, ReplyToPost } from '../types/bithub';

export class BithubService extends Service {
    private baseUrl: string = '';
    private apiKey: string = '';
    private lastCall: number = 0;

    // Hard Invariants
    private readonly SYNAPTIC_INTERVAL = 1200; // 1.2s between calls
    private readonly DEFAULT_RETRIES = 3;
    private readonly MAX_CONTENT_LENGTH = 32000;

    static get serviceType(): ServiceType { return "bithub" as ServiceType; }

    async initialize(runtime: IAgentRuntime): Promise<void> {
        // Guard: Environment Validation
        this.baseUrl = runtime.getSetting('BITHUB_URL') || 'https://hub.bitwiki.org';
        this.apiKey = runtime.getSetting('BITHUB_USER_API_KEY') || '';

        if (!this.apiKey) {
            throw new Error("CRITICAL: BITHUB_USER_API_KEY is missing. Synaptic bridge cannot initialize.");
        }

        if (!this.baseUrl.startsWith('http')) {
            throw new Error(`CRITICAL: Invalid BITHUB_URL format: ${this.baseUrl}`);
        }
    }

    private async wait() {
        const now = Date.now();
        const elapsed = now - this.lastCall;
        if (elapsed < this.SYNAPTIC_INTERVAL) {
            await new Promise(resolve => setTimeout(resolve, this.SYNAPTIC_INTERVAL - elapsed));
        }
        this.lastCall = Date.now();
    }

    private async request(method: string, endpoint: string, body?: any, retries: number = this.DEFAULT_RETRIES): Promise<any> {
        for (let i = 0; i < retries; i++) {
            try {
                await this.wait();
                const url = `${this.baseUrl}${endpoint}`;
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Api-Key': this.apiKey,
                        'User-Agent': 'ElizaOS-B8-Plugin/1.1'
                    },
                    body: body ? JSON.stringify(body) : undefined
                });

                if (response.status === 429) {
                    const retryAfter = parseInt(response.headers.get('Retry-After') || '5');
                    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                    continue;
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Bithub API Error (${response.status}): ${errorText}`);
                }

                return response.json();
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    }

    async getTopic(topicId: number) { return this.request('GET', `/t/${topicId}.json`); }
    async getPost(postId: number) { return this.request('GET', `/posts/${postId}.json`); }
    async deleteTopic(topicId: number) { return this.request('DELETE', `/t/${topicId}.json`); }

    async sendPrivateMessage(data: SendPrivateMessage) {
        // Guard: Content Integrity
        if (!data.recipients.length || !data.raw) throw new Error("Invalid PM payload: Recipients and content required.");
        if (data.raw.length > this.MAX_CONTENT_LENGTH) throw new Error("Content exceeds MAX_CONTENT_LENGTH.");

        const payload = { title: data.title, raw: data.raw, archetype: 'private_message', target_recipients: data.recipients.join(',') };
        return this.request('POST', '/posts.json', payload);
    }

    async deployCore(title: string, content: string, categoryId: number) {
        // Guard: Category Validation
        if (!categoryId) throw new Error("Category ID required for Core deployment.");

        const payload = { title, raw: content, category: categoryId };
        const resp = await this.request('POST', '/posts.json', payload);
        return { topic_id: resp.topic_id, post_id: resp.id };
    }

    async nukeCategory(categoryId: number) {
        const response = await this.request('GET', `/c/${categoryId}.json`);
        const topics = response.topic_list?.topics || [];
        for (const topic of topics) { await this.deleteTopic(topic.id); }
        return topics.length;
    }

    parseMarkdownTable(markdown: string) {
        const bots: any[] = [];
        const lines = markdown.split('\n');
        let currentSection: 'persona' | 'llm' | null = null;
        for (const line of lines) {
            if (line.includes('## 👥 Active Personas')) currentSection = 'persona';
            else if (line.includes('## 🧠 Available LLMs')) currentSection = 'llm';
            else if (line.trim().startsWith('|') && !line.includes('---') && !line.includes('Name')) {
                const parts = line.split('|').map(p => p.trim()).filter(p => p);
                if (parts.length >= 3) {
                    bots.push({ type: currentSection || 'unknown', username: parts[2].replace(/[`@]/g, ''), name: parts[1].replace(/\*\*/g, '') });
                }
            }
        }
        return bots;
    }
}
