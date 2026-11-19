import type { DocFull, DocSummary, Tab } from './types';

async function req<T>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const r = await fetch('/api' + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || r.statusText);
  return (r.status === 204 ? null : await r.json()) as T;
}

export const api = {
  list: () => req<DocSummary[]>('/docs'),
  create: (title?: string) => req<DocFull>('/docs', 'POST', { title }),
  get: (id: string) => req<DocFull>(`/docs/${id}`),
  rename: (id: string, title: string) => req<unknown>(`/docs/${id}`, 'PATCH', { title }),
  remove: (id: string) => req<null>(`/docs/${id}`, 'DELETE'),
  copy: (id: string) => req<DocFull>(`/docs/${id}/copy`, 'POST'),
  addTab: (id: string, body: { title?: string; content?: string } = {}) => req<Tab>(`/docs/${id}/tabs`, 'POST', body),
  saveTab: (id: string, tabId: string, body: { title?: string; content?: string }) =>
    req<unknown>(`/docs/${id}/tabs/${tabId}`, 'PATCH', body),
  removeTab: (id: string, tabId: string) => req<null>(`/docs/${id}/tabs/${tabId}`, 'DELETE'),
  // fire-and-forget save that survives page unload
  saveTabBeacon: (id: string, tabId: string, body: { content: string }) =>
    fetch(`/api/docs/${id}/tabs/${tabId}`, {
      method: 'PATCH',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};
