import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, StyleSheet, Animated, Dimensions, Text, Alert} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { generateMaze } from '@/utils/generateMaze.tsx';
import {useAlarmGlobal} from "@/global/alarmGlobal";

interface BallGameModalProps {
	visible: boolean;
	dim: number;
	mazeMap: number[][];
	onComplete: () => void;
}


const BallGameModal: React.FC<BallGameModalProps> = ({ visible, dim, mazeMap, onComplete}) => {

	const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

	const MAZE_ROWS = dim;
	const MAZE_COLS = dim;
	const CELL_SIZE = SCREEN_WIDTH / MAZE_COLS;

	const BALL_SIZE = CELL_SIZE * 0.8;
	const BALL_RADIUS = BALL_SIZE / 2;

	const ALPHA = 0.05;
	const FRICTION = 0.99;
	const EPS = 0.05;
	const MAX_VELOCITY = 1.5;

	const INIT_X_POS = CELL_SIZE * 1.5 - BALL_RADIUS;
	const INIT_Y_POS = CELL_SIZE * 1.5 - BALL_RADIUS + (SCREEN_HEIGHT / 2 - SCREEN_WIDTH / 2);

	const [subscription, setSubscription] = useState(null);
	const [won, setWon] = useState(false);
	
	const ballPosition = useRef(new Animated.ValueXY({
		x: INIT_X_POS, 
		y: INIT_Y_POS,
	})).current;

	const velocity = useRef({ x: 0, y: 0 });

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			position: 'relative',
			backgroundColor: '#ddd',
		},
		cell: {
			position: 'absolute',
			width: CELL_SIZE,
			height: CELL_SIZE,
		},
		ball: {
			width: BALL_SIZE,
			height: BALL_SIZE,
			borderRadius: BALL_RADIUS,
			backgroundColor: '#4A3F6D',
			position: 'absolute',
		},
	});

	const getCell = (x: number, y: number) => {
		const col = Math.floor((x + BALL_RADIUS) / CELL_SIZE);
		const row = Math.floor((y - (SCREEN_HEIGHT / 2 - SCREEN_WIDTH / 2) + BALL_RADIUS) / CELL_SIZE);
		return { row, col };
	};

	const isWall = (x: number, y: number) => {
		const corners = [
			{ x: x - BALL_RADIUS, y },
			{ x: x + BALL_RADIUS, y },
			{ x, y: y - BALL_RADIUS },
			{ x, y: y + BALL_RADIUS },
		];

		return corners.some(({ x, y }) => {
			const { row, col } = getCell(x, y);
			return mazeMap[row]?.[col] === 1;
		});
	};

	const isGoal = (x: number, y: number) => {
		const { row, col } = getCell(x, y);
		return mazeMap[row]?.[col] === 2;
	};

	const _subscribe = () => {
		setSubscription(
			Accelerometer.addListener(({ x, y }) => {
				// Apply friction or acceleration
				// Calculate velocity
				if (Math.abs(x) < EPS && Math.abs(y) < EPS) {
					velocity.current.x *= FRICTION;
					velocity.current.y *= FRICTION;
				} else {
					velocity.current.x += x * ALPHA;
					velocity.current.y += -y * ALPHA;
				}

				velocity.current.x = Math.max(Math.min(velocity.current.x, MAX_VELOCITY), -MAX_VELOCITY);
				velocity.current.y = Math.max(Math.min(velocity.current.y, MAX_VELOCITY), -MAX_VELOCITY);

				let nextX = ballPosition.x._value + velocity.current.x;
				let nextY = ballPosition.y._value + velocity.current.y;

				if (isWall(nextX, ballPosition.y._value)) {
					nextX = ballPosition.x._value;
					velocity.current.x = 0;
				}

				if (isWall(ballPosition.x._value, nextY)) {
					nextY = ballPosition.y._value;
					velocity.current.y = 0;
				}

				if (isWall(nextX, nextY)) {
					nextX = ballPosition.x._value;
					nextY = ballPosition.y._value;
					velocity.current.x = 0;
					velocity.current.y = 0;
				}


				if (isGoal(ballPosition.x._value, ballPosition.y._value)) {
					setWon(true);
				}

				// Update ball instantly
				ballPosition.setValue({ x: nextX, y: nextY });
			}) 
		);

		Accelerometer.setUpdateInterval(1);
	}

	const _unsubscribe = () => {
		subscription && subscription.remove();
		setSubscription(null);
	}

	useEffect(() => {
		if (visible) {
			ballPosition.setValue({x: INIT_X_POS, y: INIT_Y_POS});
			_subscribe();
		} else {
			setWon(false);
		}

		return () => {
		  _unsubscribe();
		};
	}, [visible]);

	useEffect(() => {
		if(won == true){
			_unsubscribe();
			onComplete();
			Alert.alert('Alarm Dismissed', 'You can get up or go back to sleep');
		}
	}, [won]);

	return (
		<Modal visible={visible} animationType="slide" transparent={false}>
			<View style={styles.container}>
				{mazeMap.map((row, rowIndex) => (
					row.map((cell, colIndex) => (
						<View
							key={`${rowIndex}-${colIndex}`}
							style={[
								styles.cell,
								{
									left: colIndex * CELL_SIZE,
									top: rowIndex * CELL_SIZE + SCREEN_HEIGHT / 2 - SCREEN_WIDTH / 2,
									backgroundColor:
										cell === 1 ? '#444' : cell === 2 ? '#4CAF50' : '#f0f0f0',
								},
							]}
						/>
					))
				))}

				<Animated.View style={[styles.ball, ballPosition.getLayout()]} />
			</View>
		</Modal>
	);
};

export default BallGameModal;