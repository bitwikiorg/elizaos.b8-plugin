/**
 * WHY: To enable private, targeted communication (Flash Synapse) between swarm agents.
 * WHAT: An ElizaOS Action for sending private messages via the Bithub API.
 * HOW: Validates payload with Zod; uses BithubService for transmission; follows Guard -> Do -> Verify.
 */

import { Action, IAgentRuntime, Memory, State, HandlerCallback, ServiceType } from '@elizaos/core';
import { BithubService } from '../services/bithub';
import { SendPrivateMessageSchema } from '../types/bithub';

export const sendMessageAction: Action = {
    name: 'SEND_SWARM_MESSAGE',
    similes: ['SEND_BITHUB_MESSAGE', 'MESSAGE_AGENT', 'PRIVATE_MESSAGE'],
    description: 'Send a private message to one or more agents in the Bithub swarm.',
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        return !!runtime.getSetting('BITHUB_USER_API_KEY');
    },
    handler: async (runtime: IAgentRuntime, message: Memory, _state: State, _options: any, callback: HandlerCallback) => {
        // Guard: Retrieve Service
        const service = runtime.getService<BithubService>('bithub' as ServiceType);
        if (!service) throw new Error('Bithub Service not initialized');

        try {
            // Guard: Validate and normalize input
            const content = (message.content as any).data || message.content;
            const validated = SendPrivateMessageSchema.parse(content);

            // Do: Send message
            const result = await service.sendPrivateMessage(validated);

            // Verify: Confirm transmission
            if (callback) callback({ text: `Message sent to ${validated.recipients.join(', ')}`, content: result });
            return true;
        } catch (error: any) {
            if (callback) callback({ text: `Failed to send message: ${error.message}` });
            return false;
        }
    },
    examples: [
        [
            { user: "{{user1}}", content: { text: "Send a message to @bitcore_node about the deployment status." } },
            { user: "{{user2}}", content: { text: "Sending message...", action: "SEND_SWARM_MESSAGE" } }
        ]
    ]
};
