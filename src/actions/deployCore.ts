/**
 * WHY: To instantiate complex agentic workflows (Core Synapses) within the Bithub swarm.
 * WHAT: An ElizaOS Action that triggers a new topic in a specific Bithub category.
 * HOW: Follows Guard -> Do -> Verify; uses BithubService for synaptic transmission.
 */

import { Action, IAgentRuntime, Memory, State, HandlerCallback, ServiceType } from '@elizaos/core';
import { BithubService } from '../services/bithub';

export const deployCoreAction: Action = {
    name: 'DEPLOY_CORE',
    similes: ['START_WORKFLOW', 'GENESIS_EVENT', 'DEPLOY_SEED'],
    description: 'Deploy a new core workflow (Core Synapse) to a Bithub category.',
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        // Guard: Check for API Key
        return !!runtime.getSetting('BITHUB_USER_API_KEY');
    },
    handler: async (runtime: IAgentRuntime, message: Memory, _state: State, _options: any, callback: HandlerCallback) => {
        // Guard: Retrieve Service
        const service = runtime.getService<BithubService>('bithub' as ServiceType);
        if (!service) throw new Error('Bithub Service not initialized');

        try {
            const content = (message.content as any);
            const { title, raw, category_id } = content;

            // Guard: Validate inputs
            if (!category_id) throw new Error('category_id is mandatory for DEPLOY_CORE.');
            if (!title || !raw) throw new Error('Title and content (raw) are required.');

            // Do: Execute deployment
            const deployment = await service.deployCore(title, raw, category_id);

            // Verify: Check deployment result and notify
            if (deployment.topic_id) {
                if (callback) callback({ text: `Core deployed successfully. Topic ID: ${deployment.topic_id}`, content: deployment });
                return true;
            }
            throw new Error("Deployment failed: No topic_id returned.");
        } catch (error: any) {
            if (callback) callback({ text: `Deployment failed: ${error.message}` });
            return false;
        }
    },
    examples: []
};
