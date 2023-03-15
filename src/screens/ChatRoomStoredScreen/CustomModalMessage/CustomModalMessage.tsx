import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './styles'


const CustomModal = ({ title, isVisible }) => {
	return (
		<View style={styles.modalContainer}>
			<Modal animationType="fade" transparent={true} visible={isVisible}>
				<View style={styles.modalContainer}>
					<View style={styles.modalView}>
						<View style={styles.animationContainer}>
							<LottieView
								source={require('@assets/check.json')}
								loop={false}
								autoPlay={true}
							/>
						</View>
						<Text style={styles.textStyle}>{title}</Text>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default CustomModal;
