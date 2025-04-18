import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Gyroscope } from 'expo-sensors';

interface BallGameModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BALL_SIZE = 50;
const UPDATE_INTERVAL = 1;
const ALPHA = 0.1;



const BallGameModal: React.FC<BallGameModalProps> = ({ visible, onClose }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const ballPosition = useRef(new Animated.ValueXY({
    x: SCREEN_WIDTH / 2 - BALL_SIZE / 2,
    y: SCREEN_HEIGHT / 2 - BALL_SIZE / 2,
  })).current;

  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (visible) {
      const sub = Gyroscope.addListener(({ x, y }) => {

        if(Math.abs(x) < EPISLON && Math.abs(y) < EPISLON){
          velocity.current.x -= 
          velocity.current.y -= velocity
        }else{
          velocity.current.x += y * ALPHA;
          velocity.current.y += x * ALPHA;

        }

        let nextX = ballPosition.x._value + velocity.current.x;
        let nextY = ballPosition.y._value + velocity.current.y;

        if (nextX < 0) {
          nextX = 0;
          velocity.current.x = 0;
        } else if (nextX > SCREEN_WIDTH - BALL_SIZE) {
          nextX = SCREEN_WIDTH - BALL_SIZE;
          velocity.current.x = 0;
        }

        if (nextY < 0) {
          nextY = 0;
          velocity.current.y = 0;
        } else if (nextY > SCREEN_HEIGHT - BALL_SIZE) {
          nextY = SCREEN_HEIGHT - BALL_SIZE;
          velocity.current.y = 0;
        }

        Animated.timing(ballPosition, {
          toValue: { x: nextX, y: nextY },
          duration: UPDATE_INTERVAL,
          useNativeDriver: false,
        }).start();
      });

      setSubscription(sub);
      Gyroscope.setUpdateInterval(UPDATE_INTERVAL);
    } else {
      subscription?.remove();
      setSubscription(null);
    }

    return () => subscription?.remove();
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <Animated.View style={[styles.ball, ballPosition.getLayout()]} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: '#4A3F6D',
    position: 'absolute',
  },
});

export default BallGameModal;
