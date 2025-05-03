// MorningCueModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { stopAlarm } from '@/utils/AlarmHandler';
import morningQuestions from '@/data/morningQuestions.json'

interface Question {
  question: string;
  choices: string[];
  answer: string;
}

interface MorningCueModalProps {
  visible: boolean;
  onComplete: () => void;
  requiredStreak?: number;
}

const MorningCueModal: React.FC<MorningCueModalProps> = ({ visible, requiredStreak, onComplete}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [streak, setStreak] = useState(0);
  const [questionPool, setQuestionPool] = useState<Question[]>([]);

  useEffect(() => {
    if (visible) {
      resetChallenge();
    }
  }, [visible]);

  const resetChallenge = () => {
    setStreak(0);
    const shuffled = shuffle([...morningQuestions]);
    setQuestionPool(shuffled);
    setCurrentQuestion(shuffled[0]);
  };

  const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

  const handleAnswer = (choice: string) => {
    if (!currentQuestion) return;

    if (choice === currentQuestion.answer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak >= requiredStreak) {
        stopAlarm();
        onComplete();
        Alert.alert('Alarm Dismissed', 'You can get up or go back to sleep');
        return;
      }
      moveToNextQuestion();
    } else {
      Alert.alert('Incorrect', 'Try again! Streak lost.');
      setStreak(0);
      moveToNextQuestion();
    }
  };

  const moveToNextQuestion = () => {
    const next = questionPool[Math.floor(Math.random() * questionPool.length)];
    setCurrentQuestion(next);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.streak}>Streak: {streak}/{requiredStreak}</Text>
          <Text style={styles.question}>{currentQuestion?.question}</Text>
          {currentQuestion?.choices.map((choice) => (
            <TouchableOpacity key={choice} style={styles.choiceButton} onPress={() => handleAnswer(choice)}>
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  choiceButton: {
    backgroundColor: '#4A3F6D',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  choiceText: {
    color: 'white',
    fontSize: 16,
  },
  streak: {
    fontSize: 16,
    color: '#666',
  },
});

export default MorningCueModal;
