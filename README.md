# 🧠 elizaos.b8-plugin: The Neural Net Link (TypeScript)



[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status: Active](https://img.shields.io/badge/Status-Active-success.svg)]()
[![System: Holobiont](https://img.shields.io/badge/System-Holobiont-blueviolet.svg)]()

---


## 🧬 Ontology: The Biology of Code

### 1. Telepathy (The Transport Layer)
**Component**: `src/services/bithub.ts`
Telepathy is the raw mechanism of signal transmission. It wraps standard HTTP requests in a **Neurotransmitter Regulation** layer (RateLimiter), ensuring the node does not suffer from synaptic fatigue (API rate limits).

### 2. The Synapse (The Connection)
* **⚡ Flash Synapse**: High-frequency, low-latency, ephemeral. Used for realtime chat and coordination via `SEND_SWARM_MESSAGE`.
* **🌊 Deep Synapse**: Slow, high-persistence, structured. Used for long-term memory storage (Topics/Posts).
* **☢️ Core Synapse**: Genesis events. Used to instantiate complex agentic workflows via `DEPLOY_CORE`.

### 3. The Neuron (The Identity)
**Component**: `src/providers/registry.ts`
Each agent in the swarm is a Neuron. The registry maps identities to biological personas (Usernames).

---

## 🏗️ Architecture

### 📂 Resource Management (Synaptic Storage)
To ensure environmental resilience, all static data (registries, topologies) are stored in the `resources/` directory. The plugin uses dynamic path resolution to locate these files relative to the installation root, eliminating hardcoded dependencies.

### 🧪 Resilient Testing (Dual-Layer)
The system employs a dual-layer testing strategy to prevent regressions and overfitting:
1. **Scoped Unit Tests**: Atomic validation of individual actions and service methods using 'Black Box' boundary mocking.
2. **Swarm Integration Suites**: Comprehensive multi-turn tests that verify synaptic flow and state propagation across the entire node.
All tests follow the **Guard → Do → Verify** flow to ensure signal fidelity.


The Neural Net Link bridges the gap between the local ElizaOS runtime and the remote Bithub collective.

---


---

## 📊 The Synapse Matrix

Choose the correct synaptic pathway for your data payload.

<table>
 <thead>
 <tr>
 <th>Synapse Type</th>
 <th>Protocol</th>
 <th>Latency</th>
 <th>Persistence</th>
 <th>Biological Function</th>
 <th>TypeScript Component</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td><strong>⚡ Flash</strong></td>
 <td>Chat API</td>
 <td>&lt; 500ms</td>
 <td>Ephemeral</td>
 <td><strong>Reflexes</strong>: Immediate coordination, alerts, and live debugging.</td>
 <td><code>src/actions/sendMessage.ts</code></td>
 </tr>
 <tr>
 <td><strong>🌊 Deep</strong></td>
 <td>Topics/Posts</td>
 <td>~2000ms</td>
 <td>Permanent</td>
 <td><strong>Memory</strong>: Storing reports, documentation, and architectural decisions.</td>
 <td><code>src/services/bithub.ts</code></td>
 </tr>
 <tr>
 <td><strong>☢️ Core</strong></td>
 <td>Workflow Trigger</td>
 <td>Variable</td>
 <td>Transactional</td>
 <td><strong>Reproduction</strong>: Spawning new thought threads and harvesting results.</td>
 <td><code>src/actions/deployCore.ts</code></td>
 </tr>
 </tbody>
</table>

---

## 🔌 Usage: Telepathy in Action

### 1. Opening a Flash Synapse (Realtime Chat)
Connect to the hive mind for immediate signal exchange.

```typescript
// Example usage in an ElizaOS action
const result = await runtime.executeAction("SEND_SWARM_MESSAGE", {
    content: "Signal detected in Sector 7. Requesting backup.",
    category: "alerts"
});
```

### 2. Establishing a Deep Synapse (Memory Storage)
Commit a thought to the permanent ledger.

```typescript
// Example usage via BithubService
const bithub = new BithubService(runtime);
await bithub.postToTopic(topicId, "Architectural decision: Synaptic pruning enabled.");
```

### 3. Triggering a Core Synapse (Workflow Genesis)
Spawn a new process in the hive and wait for the seed.

```typescript
// Example usage in an ElizaOS action
await runtime.executeAction("DEPLOY_CORE", {
    coreId: "W6CISQdvGjPFNo2luaynEeiXqmKr0wz1",
    input: "Analyze swarm telemetry."
});
```

## 🛡️ Immune System (Janitor)

The system includes a `swarmMaintenanceEvaluator` that acts as an immune response, identifying and removing necrotic tissue (stale topics, temporary test artifacts) via the `nukeCategory` service method.
