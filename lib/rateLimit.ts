import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // default 1 minute
  });

  return {
    check: (token: string, limit: number) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
          return resolve();
        }
        if (tokenCount[0] >= limit) {
          return reject(new Error("Rate limit exceeded"));
        }
        tokenCount[0] += 1;
        tokenCache.set(token, tokenCount);
        resolve();
      }),
  };
}
