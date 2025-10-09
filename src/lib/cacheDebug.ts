/**
 * Debug utilities for cache management
 */

import { getCacheFromLocalStorage, getAuthState } from "./cacheUtils";
import { getUserRegistry } from "./registryUtils";

/**
 * Get all cache information for debugging
 */
export function getCacheDebugInfo(): {
  authState: ReturnType<typeof getAuthState>;
  cacheKeys: string[];
  cacheData: Record<string, unknown>;
} {
  const authState = getAuthState();
  const cacheKeys: string[] = [];
  const cacheData: Record<string, unknown> = {};

  try {
    // Get all cache keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("cache_")) {
        cacheKeys.push(key);
        try {
          const value = localStorage.getItem(key);
          if (value) {
            cacheData[key] = JSON.parse(value);
          }
        } catch (e) {
          cacheData[key] = "Invalid JSON";
        }
      }
    }
  } catch (error) {
    console.error("Error getting cache debug info:", error);
  }

  return {
    authState,
    cacheKeys,
    cacheData,
  };
}

/**
 * Compare cache timestamps with Firestore registry
 */
export async function compareCacheWithRegistry(userId: string): Promise<{
  registry: Awaited<ReturnType<typeof getUserRegistry>>;
  cache: Record<string, string | undefined>;
  matches: Record<string, boolean>;
}> {
  const registry = await getUserRegistry(userId);
  const cache: Record<string, string | undefined> = {};
  const matches: Record<string, boolean> = {};

  const dataTypes = [
    { key: "savingsData", cacheKey: "cache_savingsData_savings" },
    { key: "calorieGoal", cacheKey: "cache_calorieData_goal" },
    { key: "dailyCalorieData", cacheKey: "cache_calorieData_dailyData" },
    { key: "rateHistory", cacheKey: "cache_savingsData_rateHistory" },
  ];

  dataTypes.forEach(({ key, cacheKey }) => {
    const cached = getCacheFromLocalStorage(cacheKey, userId);
    cache[key] = cached?.timestamp;

    const registryTimestamp = registry?.[key as keyof typeof registry];
    matches[key] = cached?.timestamp === registryTimestamp;
  });

  return { registry, cache, matches };
}

/**
 * Log cache status to console
 */
export async function logCacheStatus(userId?: string): Promise<void> {
  console.group("🗄️ Cache Status");

  const debugInfo = getCacheDebugInfo();
  console.log("Auth State:", debugInfo.authState);
  console.log("Cache Keys:", debugInfo.cacheKeys);
  console.log("Cache Data:", debugInfo.cacheData);

  if (userId) {
    const comparison = await compareCacheWithRegistry(userId);
    console.log("Registry:", comparison.registry);
    console.log("Cache Timestamps:", comparison.cache);
    console.log("Matches:", comparison.matches);
  }

  console.groupEnd();
}

// Export for browser console access in development
if (typeof window !== "undefined") {
  (window as any).__cacheDebug = {
    getCacheDebugInfo,
    compareCacheWithRegistry,
    logCacheStatus,
  };
}
