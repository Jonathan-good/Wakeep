import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

interface AlarmCardProps {
  alarm: Alarm;
  onOptionsPress: () => void;
}

const weekdaysList : string[] = ["M", "T", "W", "Th", "F"];
const weekendsList : string[] = ["Sa", "Su"];

const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onOptionsPress }) => {

  return (
    <View style={styles.card}>

     {/* Days Row */}
      <View style={styles.daysWeekdayRow}>
        {alarm.weekdays.map((day, index) => (
          <Text key={`weekday-${index}`} style={(day === 1) ? styles.dayEnabled : styles.dayDisabled}>
            {weekdaysList[index]}
          </Text>
        ))}

      </View>

      <View style={styles.daysWeekendRow}>
        {alarm.weekends.map((day, index) => (
          <Text key={`weekend-${index}`} style={(day === 1) ? styles.dayEnabled : styles.dayDisabled}>
            {weekendsList[index]}
          </Text>
        ))}
      </View>

      {/* Alarm Time */}
      <Text style={styles.time}> {`${ String(alarm.hour).padStart(2, "0") }:${ String(alarm.minutes).padStart(2, "0") } ${alarm.AM ? "AM" : "PM"}`} </Text>
      <Text style={styles.label}>{alarm.label}</Text>


      <View style={styles.gameModeRow}>

          <Ionicons
            name={alarm.gameMode === 0 ? "document-text" : "document-text-outline"}
            size={32}
            color={alarm.gameMode === 0 ? "coral" : "#B0B0B0"}
            style={styles.gameModeStyle}
          />
          <Ionicons
            name={alarm.gameMode === 1 ? "tennisball" : "tennisball-outline"}
            size={32}
            color={alarm.gameMode === 1 ? "coral" : "#B0B0B0"}
            style={styles.gameModeStyle}
          />

      </View>

      <Text style={styles.difficultyStyle}>
        {alarm.difficulty}
      </Text>

      {/* Options Button */}
      <TouchableOpacity style={styles.optionsButton} onPress={() => onOptionsPress()}>
        <Ionicons name="ellipsis-horizontal-outline" size={24} color="black" />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 15,
    margin: 8,
    minHeight: 140,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  daysWeekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  daysWeekendRow: {
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: "center",
  },
  gameModeRow: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
    justifyContent: "center",
  },
  gameModeStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  dayEnabled: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4A3F6D",
    paddingHorizontal: 5,
  },
  modeEnabled: {
    fontSize: 30,
    fontWeight: "bold",
    color: "coral",
    paddingHorizontal: 5,
  },
  dayDisabled: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#CDCDCD",
    paddingHorizontal: 5,
  },
  modeDisabled: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#CDCDCD",
    paddingHorizontal: 5,
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 4,
  },
  optionsButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  difficultyStyle: {
    position: "absolute",
    bottom: 13,
    left: 10,
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
  }
});

export default AlarmCard;