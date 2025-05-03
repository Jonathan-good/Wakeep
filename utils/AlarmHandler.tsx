import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { getStoredAlarms, deleteAlarm } from '@/utils/AlarmStorage';
import { useAlarmUI } from '@/context/alarmGlobal';

import { alarmGlobal } from '@/global/alarmGlobal'; 
import { generateMaze } from '@/utils/generateMaze.tsx'


let soundInstance: Audio.Sound | null = null;

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

Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true, 
    shouldDuckAndroid: true, 
    playThroughEarpieceAndroid: false,
});

const soundMap = {
  "sound1": require("@/assets/sounds/sound1.mp3"),
  "sound2": require("@/assets/sounds/sound2.mp3"),
  "sound123": require("@/assets/sounds/sound123.mp3"),
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // We'll handle sound manually
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
  await setupNotificationChannel();
};


const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alarmChannel', {
      name: 'Alarms',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 500, 500],
    });
  }
};

export const scheduleAlarm = async (alarm: Alarm) => {
  try{

    await setupNotificationChannel();
    await Notifications.cancelAllScheduledNotificationsAsync(); 
    const triggerDate = getNextTriggerDate(alarm);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Alarm!",
        body: `${alarm.label}`,
        data: { alarmId: alarm.id, type: 'alarm', alarmLable: alarm.label, alarmMode: alarm.gameMode, alarmDifficulty: alarm.difficulty},
      },
      trigger: {
        date: triggerDate,
        type: Notifications.SchedulableTriggerInputTypes.DATE,
      },
    });

    console.log(`Alarm scheduled for ${triggerDate.toLocaleTimeString()}`);
  } catch (error) {
    console.error('Scheduling failed:', error);
  }
};

export const unscheduleAlarm = async (alarm: Alarm) => {
  console.log(`Alarm unscheduled!`);
  stopAlarm();
}


Notifications.addNotificationReceivedListener(notification => {
  if (notification.request.content.data.type === 'alarm') {
    handleAlarmTrigger(notification.request.content.data.alarmId);
  }
  
});


Notifications.addNotificationResponseReceivedListener(response => {
  const data = response.notification.request.content.data;
  if (data.type === 'alarm') {
    //alert(`Alarm triggered:\n${data.alarmLable}`);
    stopAlarm();

    alarmGlobal.getState().setDifficulty(data.alarmDifficulty);
    const newMap = generateMaze(11+(data.alarmDifficulty*2), 11+(data.alarmDifficulty*2));
    console.log(newMap);
    alarmGlobal.getState().setMazeMap(newMap);

    if(data.alarmMode === 0){
      alarmGlobal.getState().setMorningCueVisible(true);
      alarmGlobal.getState().setBallGameVisible(false);
    }
    
    if(data.alarmMode === 1){
      alarmGlobal.getState().setMorningCueVisible(false);
      alarmGlobal.getState().setBallGameVisible(true);
    }

    

  }

  console.log("response: ", response);

});


const handleAlarmTrigger = async (alarmId: string) => {
  console.log(`Alarm Triggered: ${alarmId}`);
  await playAlarmSound(ringtone = "sound2", isLooping = true, playBackground = true);
};


export const playAlarmSound = async (ringtone: string, isLooping: boolean, playBackground: boolean) => {
  if (soundInstance) return;

  const { sound } = await Audio.Sound.createAsync(
    soundMap[ringtone],
    { shouldPlay: true, isLooping: isLooping}
  );

  if(!isLooping){
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish && !status.isLooping) {
        await stopAlarm(); 
      }
    });
  }

  await Audio.setAudioModeAsync({
      staysActiveInBackground: playBackground, 
  })
  
  soundInstance = sound;
  await sound.playAsync();

};

export const stopAlarm = async () => {
  if (soundInstance) {
    await soundInstance.stopAsync();
    await soundInstance.unloadAsync();
    soundInstance = null;
  }
  await Notifications.dismissAllNotificationsAsync();
  console.log("stopped alarm hahha");
};

const getNextTriggerDate = (alarm: Alarm): Date => {
  const date = new Date();
  let hours = alarm.AM ? alarm.hour : alarm.hour + 12;
  if (alarm.hour === 12) hours = alarm.AM ? 0 : 12;

  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hours, alarm.minutes, 0, 0);
  
  if (trigger <= now) {
    trigger.setDate(trigger.getDate() + 1);
  }
  return trigger;

}