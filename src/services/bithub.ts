import axios from "axios";
import { Service, IAgentRuntime, ServiceTypeName } from "@elizaos/core";
import { SendPrivateMessage } from "../types/bithub";

export class BithubService extends Service {
    static get serviceType(): ServiceTypeName {
        return "bithub" as ServiceTypeName;
    }

    private apiKey: string | null = null;
    private baseUrl: string = "https://hub.bitwiki.org";

    constructor() {
        super();
    }

    get serviceType(): ServiceTypeName {
        return BithubService.serviceType;
    }

    get capabilityDescription(): string {
        return "Bithub service for interacting with Discourse-based Bithub instances.";
    }

    async initialize(runtime: IAgentRuntime): Promise<void> {
        this.apiKey = runtime.getSetting("BITHUB_USER_API_KEY") as string;
        const baseUrl = runtime.getSetting("BITHUB_BASE_URL");
        if (baseUrl) this.baseUrl = (baseUrl as string).replace(/\/$/, "");

        if (!this.apiKey) {
            console.warn("[BithubService] BITHUB_USER_API_KEY not found in settings.");
        }
        console.log("[BithubService] Initialized successfully.");
    }

    async stop(): Promise<void> {}

    async sendPrivateMessage(payload: SendPrivateMessage): Promise<boolean> {
        if (!this.apiKey) return false;
        try {
            const cleanRecipients = payload.recipients.map(r => r.replace("@", "")).join(",");
            const response = await axios.post(`${this.baseUrl}/posts.json`, {
                title: payload.title,
                raw: payload.raw,
                archetype: "private_message",
                target_recipients: cleanRecipients
            }, {
                headers: { "User-Api-Key": this.apiKey, "Content-Type": "application/json" }
            });
            return response.status === 200;
        } catch (error: any) {
            return false;
        }
    }

    async sendMessage(target: string, content: string, categoryId: number = 2): Promise<boolean> {
        if (!this.apiKey) return false;
        try {
            const response = await axios.post(`${this.baseUrl}/posts.json`, {
                raw: content,
                title: "Swarm Handshake to @" + target.replace("@", ""),
                category: categoryId,
                archetype: "regular"
            }, {
                headers: { "User-Api-Key": this.apiKey, "Content-Type": "application/json" }
            });
            return response.status === 200;
        } catch (error: any) {
            return false;
        }
    }

    async sendChatMessage(channelId: number, message: string): Promise<boolean> {
        if (!this.apiKey) return false;
        try {
            const response = await axios.post(`${this.baseUrl}/chat/${channelId}.json`, { message }, {
                headers: { "User-Api-Key": this.apiKey, "Content-Type": "application/json" }
            });
            return response.status === 200;
        } catch (error: any) {
            return false;
        }
    }

    async deployCore(title: string, raw: string, category_id: number): Promise<any> {
        if (!this.apiKey) throw new Error("API Key missing");
        const response = await axios.post(`${this.baseUrl}/posts.json`, {
            title, raw, category: category_id, archetype: "regular"
        }, {
            headers: { "User-Api-Key": this.apiKey, "Content-Type": "application/json" }
        });
        return response.data;
    }

    async getTopic(id: number): Promise<any> {
        const response = await axios.get(`${this.baseUrl}/t/${id}.json`);
        return response.data;
    }

    async nukeCategory(categoryId: number): Promise<boolean> {
        return true;
    }
}
