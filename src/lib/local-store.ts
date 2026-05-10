const SUBS_KEY = "pt_subs";
const HIST_KEY = "pt_history";

export type Subscription = { id: string; name: string; avatar?: string };
export type HistoryItem = { id: string; title: string; thumbnail: string; uploader: string; watchedAt: number };

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
}

export const subs = {
  list: () => read<Subscription[]>(SUBS_KEY, []),
  has: (id: string) => read<Subscription[]>(SUBS_KEY, []).some((s) => s.id === id),
  toggle: (sub: Subscription) => {
    const cur = read<Subscription[]>(SUBS_KEY, []);
    const i = cur.findIndex((s) => s.id === sub.id);
    const next = i >= 0 ? cur.filter((s) => s.id !== sub.id) : [...cur, sub];
    write(SUBS_KEY, next);
    return next;
  },
};

export const history = {
  list: () => read<HistoryItem[]>(HIST_KEY, []),
  add: (item: Omit<HistoryItem, "watchedAt">) => {
    const cur = read<HistoryItem[]>(HIST_KEY, []).filter((h) => h.id !== item.id);
    const next = [{ ...item, watchedAt: Date.now() }, ...cur].slice(0, 100);
    write(HIST_KEY, next);
  },
  clear: () => write(HIST_KEY, []),
};