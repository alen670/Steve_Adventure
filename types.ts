export interface AdventureStat {
  name: string;
  value: number;
  max: number;
  color: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

export enum GameMode {
  SURVIVAL = 'Survival',
  CREATIVE = 'Creative',
  HARDCORE = 'Hardcore'
}