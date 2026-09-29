import { Announcement, CashTransaction, RTConfig } from '../types';
import {
  initialAnnouncements,
  initialConfig,
  initialBaseBalance,
  initialTransactions,
} from '../data/initialData';

const STORAGE_KEYS = {
  CONFIG: 'portal_rt_config_v2',
  TRANSACTIONS: 'portal_rt_transactions_v2',
  ANNOUNCEMENTS: 'portal_rt_announcements_v2',
  BASE_BALANCE: 'portal_rt_base_balance_v2',
  SENIOR_MODE: 'portal_rt_senior_mode_v2',
};

export interface RTDatabase {
  config: RTConfig;
  transactions: CashTransaction[];
  announcements: Announcement[];
  baseBalance: number;
  exportDate: string;
  version: string;
}

export function loadStoredData() {
  const getItem = <T>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return fallback;
  };

  return {
    config: getItem<RTConfig>(STORAGE_KEYS.CONFIG, initialConfig),
    transactions: getItem<CashTransaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTransactions),
    announcements: getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements),
    baseBalance: getItem<number>(STORAGE_KEYS.BASE_BALANCE, initialBaseBalance),
    isSeniorMode: getItem<boolean>(STORAGE_KEYS.SENIOR_MODE, false),
  };
}

export function saveStoredData(data: Partial<{
  config: RTConfig;
  transactions: CashTransaction[];
  announcements: Announcement[];
  baseBalance: number;
  isSeniorMode: boolean;
}>) {
  try {
    if (data.config) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data.config));
    if (data.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
    if (data.announcements) localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(data.announcements));
    if (data.baseBalance !== undefined) localStorage.setItem(STORAGE_KEYS.BASE_BALANCE, JSON.stringify(data.baseBalance));
    if (data.isSeniorMode !== undefined) localStorage.setItem(STORAGE_KEYS.SENIOR_MODE, JSON.stringify(data.isSeniorMode));
  } catch {
    // LocalStorage quota or disabled
  }
}

export function exportDatabaseAsJson(database: {
  config: RTConfig;
  transactions: CashTransaction[];
  announcements: Announcement[];
  baseBalance: number;
}) {
  const exportPayload: RTDatabase = {
    ...database,
    exportDate: new Date().toISOString(),
    version: '2.0.0',
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute(
    'download',
    `backup_kas_rt${database.config.rtNumber}_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function resetDatabase() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
