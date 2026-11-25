import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

// Reusable GET: gives data, loading, error. Re-fetches when the url changes.
export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const loading = ref(true)
  const error = ref('')
  const attempt = ref(0)

  watchEffect(async (onCleanup) => {
    // read dependencies BEFORE the first await, so Vue can track them
    const target = toValue(url)
    void attempt.value

    // cancel the old request if the url changes or the component disappears
    const controller = new AbortController()
    onCleanup(() => controller.abort())

    loading.value = true
    error.value = ''
    try {
      const res = await fetch(target, { signal: controller.signal })
      // fetch does not throw on 404/500, so check it yourself
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = await res.json()
    } catch (e) {
      if (controller.signal.aborted) return
      data.value = null
      error.value = (e as Error).message
    }
    if (!controller.signal.aborted) loading.value = false
  })

  const refetch = () => attempt.value++

  return { data, loading, error, refetch }
}
