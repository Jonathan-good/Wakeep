import React, { createContext, useContext, useState } from 'react';

interface AlarmUIContextProps {
  morningCueVisible: boolean;
  setMorningCueVisible: (visible: boolean) => void;
  ballGameVisible: boolean;
  setBallGameVisible: (visible: boolean) => void;
}

const alarmGlobal = createContext<AlarmUIContextProps | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [morningCueVisible, setMorningCueVisible] = useState(false);
  const [ballGameVisible, setBallGameVisible] = useState(false);

  return (
    <alarmGlobal.Provider
      value={{
        morningCueVisible,
        setMorningCueVisible,
        ballGameVisible,
        setBallGameVisible,
      }}>
      {children}
    </alarmGlobal.Provider>
  );
};

export const useAlarmUI = () => {
  const context = useContext(alarmGlobal);
  if (!context) {
    throw new Error('useAlarmUI must be used within an AlarmProvider');
  }
  return context;
};
