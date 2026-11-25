import { useEffect, useState } from 'react'

type Result<T> = { key: string; data: T | null; error: string }

// Reusable GET: gives data, loading, error. Re-fetches when the url changes.
export function useFetch<T>(url: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result<T> | null>(null)

  // identifies the request we are waiting for
  const key = `${url}#${attempt}`

  useEffect(() => {
    // cancel the old request if the url changes or the component disappears
    const controller = new AbortController()

    async function load() {
      try {
        const res = await fetch(url, { signal: controller.signal })
        // fetch does not throw on 404/500, so check it yourself
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: T = await res.json()
        if (!controller.signal.aborted) setResult({ key, data, error: '' })
      } catch (e) {
        if (controller.signal.aborted) return
        setResult({ key, data: null, error: (e as Error).message })
      }
    }
    load() // the effect function itself can't be async

    return () => controller.abort()
  }, [url, key])

  // derived: we are loading until the result matches the current request
  const loading = result?.key !== key
  const refetch = () => setAttempt((n) => n + 1)

  return {
    data: result?.data ?? null,
    error: loading ? '' : (result?.error ?? ''),
    loading,
    refetch,
  }
}
