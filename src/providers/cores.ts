/**
 * WHY: To provide the agent with awareness of available Core workflows.
 * WHAT: An ElizaOS Provider that reads the local cores registry.
 * HOW: Resolves cores_registry.json relative to the plugin root; asynchronously reads and formats output.
 */

import { IAgentRuntime, Memory, Provider, State } from '@elizaos/core';
import * as fs from 'fs/promises';
import * as path from 'path';

export const coreStateProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        // Resolve path relative to the current file's directory (src/providers/ -> ../../resources/)
        const registryPath = path.resolve(__dirname, '../../resources/cores_registry.json');

        try {
            // Guard: Check file existence and read
            const data = await fs.readFile(registryPath, 'utf-8');

            // Do: Parse and format
            const registry = JSON.parse(data);
            let output = 'Available Cores (Workflows):\n';
            registry.forEach((core: any) => {
                output += `- ${core.name} (ID: ${core.id}) - ${core.description || 'No description'}\n`;
            });

            // Verify: Return formatted string
            return output;
        } catch (e) {
            return 'No cores available in registry.';
        }
    }
};
