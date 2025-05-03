import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAlarmGlobal} from "@/global/alarmGlobal";

interface Alarm {
  id: string;

  hour: number;
  minutes: number;

  AM: boolean;

  label: string;
  weekdays: number[];
  weekends: number[];

  gameMode: number;
  difficulty: number;
}

const STORAGE_KEY_ALARMS = "alarms";
const ALARM_KEY_ALARMS = "sounds";

export const saveAlarms = async (alarms: Alarm[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_ALARMS, JSON.stringify(alarms));
    console.log(JSON.stringify(alarms))
  } catch (error) {
    console.error("Error saving alarms:", error);
  }
};

export const getStoredAlarms = async (): Promise<Alarm[]> => {
  try {
    const storedAlarms = await AsyncStorage.getItem(STORAGE_KEY_ALARMS);
    return storedAlarms ? JSON.parse(storedAlarms) : [];
  } catch (error) {
    console.error("Error retrieving alarms:", error);
    return [];
  }
};

export const deleteAlarm = async (id: string) => {
  try {
    const alarms = await getStoredAlarms();
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
    await saveAlarms(updatedAlarms);
  } catch (error) {
    console.error("Error deleting alarm:", error);
  }
};

export const saveSounds = async (sounds: string[]) => {
  try {
    await AsyncStorage.setItem(ALARM_KEY_ALARMS, JSON.stringify(sounds));
    console.log(JSON.stringify(sounds));
  } catch (error) {
    console.error("Error saving sounds:", error);
  }
};

