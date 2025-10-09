/**
 * Main cache module - exports all cache-related utilities
 */

// Cache utilities
export {
  saveCacheToLocalStorage,
  getCacheFromLocalStorage,
  clearCache,
  clearAllCacheForUser,
  saveAuthState,
  getAuthState,
  clearAuthState,
  type CachedData,
} from "./cacheUtils";

// Registry utilities
export {
  getUserRegistry,
  updateRegistry,
  getLastUpdated,
  type DataRegistry,
} from "./registryUtils";
