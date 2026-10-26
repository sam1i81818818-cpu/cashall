interface AgentOrdersCacheEntry {
  data: any;
  timestamp: number;
}

// In-memory server-side cache for high-frequency agent polling
export const agentOrdersCache = new Map<string, AgentOrdersCacheEntry>();
export const AGENT_CACHE_TTL_MS = 15000; // 15 seconds max cache

export function invalidateAgentOrdersCache() {
  agentOrdersCache.clear();
}
