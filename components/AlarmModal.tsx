import React, { useEffect, useState } from "react"
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { SegmentedButtons } from 'react-native-paper';

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

interface AlarmModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (alarmData: Alarm) => void;
	onDelete: (id: number) => void;
	alarmToEdit?: Alarm | null; 
}

const weekdaysList : string[] = ["M", "T", "W", "Th", "F"];
const weekendsList : string[] = ["Sa", "Su"];
const modesList : string[] = ["Questions", "Ball Game"];

const AlarmModal : React.FC<AlarmModalProps> = ({visible, onClose, onSave, onDelete, alarmToEdit}) => {

	const [hour, setHour] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [AM, setAM] = useState(true);
	const [label, setLabel] = useState("");
	const [weekdays, setWeekdays] = useState<number[]>([]);
	const [weekends, setWeekends] = useState<number[]>([]);
	const [gameMode, setModes] = useState<number>(0);
	const [difficulty, setDifficulty] = useState<number>(3);

	const getCurrentTime = () => {
	    const now = new Date();
	    let currentHour : number = now.getHours();
	    let currentMinutes : number = now.getMinutes();
	    let isAM : boolean = currentHour < 12;

	    if (currentHour > 12) {
	      currentHour -= 12; // Convert to 12-hour format
	    }

	    return { currentHour, currentMinutes, isAM };
	};

	useEffect(() => {
	    if (alarmToEdit) {
	      // Editing an existing alarm
	      setHour(alarmToEdit.hour);
	      setMinutes(alarmToEdit.minutes);
	      setAM(alarmToEdit.AM);
	      setLabel(alarmToEdit.label);
	      setWeekdays(alarmToEdit.weekdays);
	      setWeekends(alarmToEdit.weekends);
	      setModes(alarmToEdit.gameMode);
	      setDifficulty(alarmToEdit.difficulty);
	    } else {
	      // Adding a new alarm → Use current time
	      const { currentHour, currentMinutes, isAM } = getCurrentTime();
	      setHour(currentHour);
	      setMinutes(currentMinutes);
	      setAM(isAM);
	      setLabel("");
	      setWeekdays([0,0,0,0,0]);
	      setWeekends([0,0]);
	      setModes(0);
	      setDifficulty(3);
	    }
	  }, [alarmToEdit]);

	const toggleWeekday = (index: number) => {
    	setWeekdays((prev) =>
	    	prev[index] === 1 ? prev.map((day, i) => (i === index ? 0 : day)) : prev.map((day, i) => (i === index ? 1 : day))
	    );
	};

	const toggleWeekend = (index: number) => {
    	setWeekends((prev) =>
	    	prev[index] === 1 ? prev.map((day, i) => (i === index ? 0 : day)) : prev.map((day, i) => (i === index ? 1 : day))
	    );
	};

	const toggleMode = (index: number) => {
			setModes((prev) =>
	    	prev[index] === 1 ? prev.map((mode, i) => (i === index ? 0 : mode)) : prev.map((mode, i) => (i === index ? 1 : mode))
	    );
	}

	const handleSave = () => {
	    

	    let newAlarm = {
	      "id": alarmToEdit ? alarmToEdit.id : Math.floor(Math.random()*100000000).toString(),
	      "hour": hour,
	      "minutes": minutes,
	      "AM": AM,
	      "label": (label ? label : "Alarm"),
	      "weekdays": weekdays,
	      "weekends": weekends,
	      "gameMode": gameMode,
	      "difficulty": difficulty,
	    };

	    onSave(newAlarm);
	    onClose();
	 };

	const handleDeleteAlarm = (alarm) => {
		onDelete(alarm);
		onClose();
	}

	return (

		<Modal visible={visible} animationType="slide" transparent={true}>
	      <View style={styles.modalContainer}>
	        <View style={styles.modalContent}>
	          <Text style={styles.title}>{alarmToEdit ? "Edit Alarm" : "Add Alarm"}</Text>

	          {/* Time Selection */}
	          <View style={styles.pickerContainer}>
	            <Picker selectedValue={String(hour)} onValueChange={(value) => setHour(parseInt(value))} style={styles.picker}>
	              {Array.from({ length: 12 }).map((h, index) => (
	                <Picker.Item key={String(index)} label={`${String(index).padStart(2, "0")}`} value={String(index)} />
	              ))}
	            </Picker>
	            <Text style={styles.colon}>:</Text>
	            <Picker selectedValue={String(minutes)} onValueChange={(value) => setMinutes(parseInt(value))} style={styles.picker}>
	              {Array.from({ length: 60 }).map((m, index) => (
	                <Picker.Item key={String(index)} label={`${String(index).padStart(2, "0")}`} value={String(index)} />
	              ))}
	            </Picker>
	            <Picker selectedValue={AM ? "AM" : "PM"} onValueChange={(value) => setAM(value === "AM")} style={styles.picker}>
	              <Picker.Item label="AM" value="AM" />
	              <Picker.Item label="PM" value="PM" />
	            </Picker>
	          </View>

	          {/* Alarm Label Input */}
	          <View style={styles.labelRow}>
		          <Text>Label:   </Text>
		          <TextInput style={styles.input} placeholder="Alarm" value={label} onChangeText={setLabel} />
	          </View>

	          {/* Select Repeat Days */}
	          <View style={styles.daysWeekdayRow}>
	            {weekdaysList.map((day, index) => (
	              <TouchableOpacity
	                key={`weekday-${index}`}
	                style={[styles.dayButton, weekdays[index] === 1 && styles.selectedDay]}
	                onPress={() => toggleWeekday(index)}
	              >
	                <Text style={styles.dayText}>{day}</Text>
	              </TouchableOpacity>
	            ))}
	          </View>

	          <View style={styles.daysWeekendRow}>
	            {weekendsList.map((day, index) => (
	              <TouchableOpacity
	                key={`weekend-${index}`}
	                style={[styles.dayButton, weekends[index] === 1 && styles.selectedDay]}
	                onPress={() => toggleWeekend(index)}
	              >
	                <Text style={styles.dayText}>{day}</Text>
	              </TouchableOpacity>
	            ))}
	          </View>

	          <View style={styles.segmentRow}>
						  {modesList.map((mode, index) => (
						    <TouchableOpacity
						      key={index}
						      style={[
						        styles.segmentButton,
						        gameMode === index && styles.segmentSelected,
						      ]}
						      onPress={() => setModes(index)}
						    >
						      <Text
						        style={[
						          styles.segmentText,
						          gameMode === index && styles.segmentTextSelected,
						        ]}
						      >
						        {mode}
						      </Text>
						    </TouchableOpacity>
						  ))}
						</View>

	          <View style={styles.labelRow}>
						  <Text style={styles.label}>Difficulty:   </Text>
						  <TouchableOpacity onPress={() => setDifficulty(Math.max(1, difficulty - 1))}>
						    <Text style={styles.stepButton}>➖</Text>
						  </TouchableOpacity>
						  <Text style={styles.difficultyValue}>{difficulty}</Text>
						  <TouchableOpacity onPress={() => setDifficulty(difficulty + 1)}>
						    <Text style={styles.stepButton}>➕</Text>
						  </TouchableOpacity>
						</View>

	          

	          {/* Save & Cancel Buttons */}
	          <View style={styles.buttonContainer}>
	            <Button title="Cancel" onPress={onClose} />
	            <Button title="Save" onPress={handleSave} />
	          </View>

	          {alarmToEdit && onDelete && (
	            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAlarm(alarmToEdit)}>
	              <Text style={styles.deleteText}>Delete Alarm</Text>
	            </TouchableOpacity>
	          )}


	        </View>
	      </View>
	    </Modal>
  	);
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  picker: {
    width: 95,
  },
  colon: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 3,
  },
  labelRow: {
  	flexDirection: 'row',
  	alignItems: 'center',
  	marginVertical: 10,
  }, 
  input: {
  	flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  daysWeekdayRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  daysWeekendRow: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-evenly",
  },
  dayButton: {
  	padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedDay: {
    backgroundColor: "#7A6F9D",
    borderColor: "#7A6F9D",
  },
  segmentRow: {
	  flexDirection: 'row',
	  justifyContent: 'center',
	  marginVertical: 10,
	},
	segmentButton: {
	  paddingVertical: 10,
	  paddingHorizontal: 20,
	  borderWidth: 1,
	  borderColor: '#ccc',
	  borderRadius: 10,
	  marginHorizontal: 5,
	  backgroundColor: '#f5f5f5',
	},
	segmentSelected: {
	  backgroundColor: 'coral',
	  borderColor: 'coral',
	},
	segmentText: {
	  fontSize: 16,
	  color: '#555',
	},

	segmentTextSelected: {
	  color: 'white',
	  fontWeight: 'bold',
	},
  dayText: {
    color: "#000",
  },
  stepButton: {
	  fontSize: 24,
	  marginHorizontal: 30,
	},
	difficultyValue: {
	  fontSize: 20,
	},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AlarmModal;