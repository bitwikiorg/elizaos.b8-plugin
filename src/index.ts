/**
 * WHY: Entry point for the elizaos.b8-plugin, aggregating all synaptic components.
 * WHAT: Plugin definition including actions, providers, evaluators, and services.
 * HOW: Exports a standard ElizaOS Plugin object; registers the BithubService singleton.
 */

import { Plugin } from '@elizaos/core';
import { sendMessageAction } from './actions/sendMessage';
import { deployCoreAction } from './actions/deployCore';
import { swarmRegistryProvider } from './providers/registry';
import { coreStateProvider } from './providers/cores';
import { bithubJanitorEvaluator } from './evaluators/janitor';
import { BithubService } from './services/bithub';

export const bithubPlugin: Plugin = {
    name: 'elizaos.b8-plugin',
    description: 'BITCORE Neural Net Link for ElizaOS',
    actions: [sendMessageAction, deployCoreAction],
    providers: [swarmRegistryProvider, coreStateProvider],
    evaluators: [bithubJanitorEvaluator],
    services: [new BithubService()]
};

export default bithubPlugin;
