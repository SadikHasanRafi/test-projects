export interface Tab { _id: string; title: string; content: string }
export interface DocFull { _id: string; title: string; tabs: Tab[]; createdAt: string; updatedAt: string }
export interface DocSummary { _id: string; title: string; tabCount: number; preview: string; updatedAt: string; createdAt: string }
