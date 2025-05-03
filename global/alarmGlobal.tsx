import { create } from 'zustand';

interface AlarmStore {
  morningCueVisible: boolean;
  setMorningCueVisible: (value: boolean) => void;

  ballGameVisible: boolean;
  setBallGameVisible: (value: boolean) => void;
  
  difficulty: number;
  setDifficulty: (value: number) => void;

  mazeMap: number[][];
  setMazeMap: (value: number[][]) => void;
}

export const alarmGlobal = create<AlarmStore>((set) => ({
  morningCueVisible: false,
  setMorningCueVisible: (value) => set({ morningCueVisible: value }),

  ballGameVisible: false,
  setBallGameVisible: (value) => set({ ballGameVisible: value }),

  difficulty: 3,
  setDifficulty: (value) => set({ difficulty: value }),

  mazeMap: [],
  setMazeMap: (value) => set({mazeMap: value}),
}));

export const useAlarmGlobal = alarmGlobal;