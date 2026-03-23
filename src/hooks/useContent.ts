import { useCallback, useEffect, useState } from 'react'

const cache = new Map<string, unknown>()

export function useContent<T>(path: string): { data: T | null; error: boolean; loading: boolean; retry: () => void } {
  const [data, setData] = useState<T | null>(() => (cache.get(path) as T) ?? null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(!cache.has(path))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (cache.has(path)) {
      setData(cache.get(path) as T)
      setLoading(false)
      setError(false)
      return
    }

    setLoading(true)
    setError(false)

    fetch(path)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then((d: T) => {
        cache.set(path, d)
        setData(d)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [path, attempt])

  const retry = useCallback(() => {
    cache.delete(path)
    setAttempt(a => a + 1)
  }, [path])

  return { data, error, loading, retry }
}
