import React, { useState, useEffect  } from "react";
import { Alert, View, StyleSheet, Button, TouchableOpacity, Text, FlatList} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AlarmCard from "@/components/AlarmCard"
import AlarmModal from "@/components/AlarmModal"
import BallGameModal from '@/components/BallGame.tsx'
import MorningCueModal from '@/components/MorningCue.tsx'
import { getStoredAlarms, saveAlarms, deleteAlarm} from "@/utils/AlarmStorage";

import { scheduleAlarm, requestPermissions, unscheduleAlarm, playAlarmSound, stopAlarm} from "@/utils/AlarmHandler";

import {useAlarmGlobal} from "@/global/alarmGlobal";

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


export default function Alarm() {

  const [alarms, setAlarms] = React.useState<Alarm[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [alarmToEdit, setAlarmToEdit] = useState<Alarm | null>(null);

  const { 
    morningCueVisible, 
    setMorningCueVisible, 

    ballGameVisible, 
    setBallGameVisible, 

    difficulty, 
    setDifficulty,

    mazeMap,
    setMazeMap
  } = useAlarmGlobal();

  //load saved alarms
  useEffect(() => {
      const loadAlarms = async () => {
          const storedAlarms = await getStoredAlarms();
          setAlarms(storedAlarms);
      };

      //playAlarmSound(ringtone = "sound1", isLooping = false, playBackground = false);
      requestPermissions();
      loadAlarms();
  }, []);

  //save alarms to database on changes
  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);


  const handleDeleteAlarm = async (alarm: Alarm) => {
    //delete from database
    await deleteAlarm(alarm.id);

    //delete from the array;
    setAlarms(prev => prev.filter(alarmm => alarmm.id !== alarm.id));
    unscheduleAlarm(alarm);
  };


  const openAddModal = () => {
    setAlarmToEdit(null);
    setModalVisible(true);
  };

  const openAddModal2 = () => {
    setMorningCueVisible(true);
  }

  const openAddModal3 = () => {
    setBallGameVisible(true);
  }


  const openEditModal = (alarm: Alarm) => {
    setAlarmToEdit(alarm);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MyAlarm</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openAddModal()}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
            <View style={styles.alarmWrapper}>
              <AlarmCard alarm={item} onOptionsPress={() => openEditModal(item)}/>
            </View>
          )}
        contentContainerStyle={styles.alarmList}
      />

      <AlarmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}  
        onSave={(alarmData) => {
          setAlarms((prev) => {
            if (alarmToEdit) {
              let newAlarms = prev.map((a) => (a.id === alarmData.id ? alarmData : a));
              saveAlarms(newAlarms);
              unscheduleAlarm(alarmToEdit);
              scheduleAlarm(alarmData);
              return newAlarms;
            }
            setAlarmToEdit(alarmData);
            scheduleAlarm(alarmData);
            return [...prev, alarmData];
          });
        }}
        onDelete={(alarm) => handleDeleteAlarm(alarm)}
        alarmToEdit={alarmToEdit}
      />

      <MorningCueModal
        //visible={true}
        visible={morningCueVisible}
        requiredStreak={difficulty}
        onComplete={() => {
          stopAlarm();
          setMorningCueVisible(false);

        }}
      />

      <BallGameModal
        //visible={false}
        visible={ballGameVisible}
        dim={11+(difficulty*2)}
        mazeMap={mazeMap}
        onComplete={() => {
          stopAlarm();
          setBallGameVisible(false);
        }}
      />
    </View>  
  );

}





const styles = StyleSheet.create({
  container: {

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E2E2E",
    marginTop: 20,
    marginLeft: 30,
  },
  addButton: {
    backgroundColor: "#4A3F6D",
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginRight: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  alarmWrapper: {
    width: "50%",
    padding: 10,
  },
});

