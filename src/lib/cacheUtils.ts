/**
 * Cache utilities for localStorage with timestamp management
 */

export interface CachedData<T> {
  data: T;
  timestamp: string;
  userId: string;
}

/**
 * Save data to localStorage with timestamp
 */
export function saveCacheToLocalStorage<T>(
  key: string,
  data: T,
  userId: string,
  timestamp: string
): void {
  try {
    const cachedData: CachedData<T> = {
      data,
      timestamp,
      userId,
    };
    localStorage.setItem(key, JSON.stringify(cachedData));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Get cached data from localStorage
 */
export function getCacheFromLocalStorage<T>(
  key: string,
  userId: string
): CachedData<T> | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cachedData: CachedData<T> = JSON.parse(cached);

    // Verify the cached data belongs to the current user
    if (cachedData.userId !== userId) {
      localStorage.removeItem(key);
      return null;
    }

    return cachedData;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

/**
 * Clear cache for a specific key
 */
export function clearCache(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

/**
 * Clear all cache data for a user
 */
export function clearAllCacheForUser(userId: string): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("cache_")) {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const data = JSON.parse(cached);
            if (data.userId === userId) {
              localStorage.removeItem(key);
            }
          } catch {
            // Invalid JSON, remove it anyway
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error("Error clearing all cache:", error);
  }
}

/**
 * Save auth state to localStorage
 */
export function saveAuthState(isLoggedIn: boolean, userId?: string): void {
  try {
    localStorage.setItem(
      "auth_state",
      JSON.stringify({
        isLoggedIn,
        userId,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error("Error saving auth state:", error);
  }
}

/**
 * Get auth state from localStorage
 */
export function getAuthState(): {
  isLoggedIn: boolean;
  userId?: string;
} | null {
  try {
    const state = localStorage.getItem("auth_state");
    if (!state) return null;
    return JSON.parse(state);
  } catch (error) {
    console.error("Error reading auth state:", error);
    return null;
  }
}

/**
 * Clear auth state
 */
export function clearAuthState(): void {
  try {
    localStorage.removeItem("auth_state");
  } catch (error) {
    console.error("Error clearing auth state:", error);
  }
}
