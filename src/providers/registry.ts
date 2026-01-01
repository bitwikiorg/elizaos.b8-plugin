/**
 * WHY: To provide the agent with awareness of other agents (Neurons) in the swarm.
 * WHAT: An ElizaOS Provider that fetches the agent registry from Bithub.
 * HOW: Uses BithubService to fetch and parse the registry topic; follows Guard -> Do -> Verify.
 */

import { IAgentRuntime, Memory, Provider, State, ServiceType } from '@elizaos/core';
import { BithubService } from '../services/bithub';

export const swarmRegistryProvider: Provider = {
    get: async (runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        // Guard: Retrieve Service
        const service = runtime.getService<BithubService>('bithub' as ServiceType);
        if (!service) return 'Bithub Service unavailable.';

        try {
            // Do: Fetch registry topic
            const topic = await service.getTopic(30145);
            const firstPostId = topic.post_stream?.posts?.[0]?.id;
            if (!firstPostId) return 'Bithub Registry: Empty.';

            const post = await service.getPost(firstPostId);
            const bots = service.parseMarkdownTable(post.raw || '');

            // Verify: Format and return
            let output = 'Available Swarm Agents:\n';
            bots.forEach((bot: any) => {
                output += `- @${bot.username} (${bot.name}) [${bot.type.toUpperCase()}]\n`;
            });
            return output;
        } catch (e) {
            return 'Bithub Registry: Fetch failed.';
        }
    }
};
