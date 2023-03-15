import { Icon } from 'native-base';
import React, { useImperativeHandle, useState } from 'react';
import { Keyboard, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { Avatar, useTheme } from 'react-native-paper';
import { IMessage, IMemberRoom } from '@models/types';

interface IProps {
	message: IMessage;
	closeModal: () => void;
	chooseEmoji: ({ emoji, itemMessageSelected }) => void;
	onPressU: (messing: IMessage) => void;
	onPressD: (messing: IMessage) => void;
	onPressQ: (messing: IMessage) => void;
	onPressC: (messing: IMessage) => void;
	onPressP: ({ itemMessageSelected }) => void;
}

const ChooseEmojiComponent = (props: IProps) => {
	const { colors } = useTheme();
	const {
		closeModal,
		chooseEmoji,
		message,
		onPressU,
		onPressD,
		onPressQ,
		onPressC,
		onPressP,
	} = props;
	return (
		<View style={{}}>
			<View
				style={{
					flexDirection: 'row',
					backgroundColor: '#fff',
					marginTop: 10,
					borderRadius: 8,
					alignItems: 'center',
				}}
			>
				<TouchableOpacity
					style={{ padding: 8 }}
					onPress={() => {
						chooseEmoji({ emoji: ':heart:', itemMessageSelected: message });
						closeModal();
					}}
				>
					<Text style={{ fontSize: 30 }}>❤️</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ padding: 8 }}
					onPress={() => {
						chooseEmoji({ emoji: ':thumbsup:', itemMessageSelected: message });
						closeModal();
					}}
				>
					<Text style={{ fontSize: 30 }}>👍</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ padding: 8 }}
					onPress={() => {
						chooseEmoji({ emoji: ':rofl:', itemMessageSelected: message });
						closeModal();
					}}
				>
					<Text style={{ fontSize: 30 }}>🤣</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ padding: 8 }}
					onPress={() => {
						chooseEmoji({ emoji: ':hushed:', itemMessageSelected: message });
						closeModal();
					}}
				>
					<Text style={{ fontSize: 30 }}>😲</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ padding: 8 }}
					onPress={() => {
						chooseEmoji({ emoji: ':sob:', itemMessageSelected: message });
						closeModal();
					}}
				>
					<Text style={{ fontSize: 30 }}>😭</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ padding: 8 }}
					onPress={() => {
						chooseEmoji({ emoji: ':rage:', itemMessageSelected: message });
						closeModal();
					}}
				>
					<Text style={{ fontSize: 30 }}>😡</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{ padding: 8 }}>
					<Icon
						as={Ionicons}
						name={'add-outline'}
						size={7}
						color={colors.primary}
					/>
				</TouchableOpacity>
			</View>

			<View
				style={{
					backgroundColor: '#fff',
					marginTop: 8,
					padding: 8,
					borderRadius: 8,
					width: '95%',
					alignSelf: 'center',
				}}
			>
				<View style={{ flexDirection: 'row', paddingTop: 12 }}>
					<TouchableOpacity
						style={{ flex: 1 }}
						onPress={() => {
							onPressQ(message), closeModal();
						}}
					>
						<View style={{ alignItems: 'center' }}>
							<Icon
								as={Ionicons}
								name={'arrow-undo-outline'}
								size={7}
								color={colors.primary}
							/>
							<Text
								style={{
									marginTop: 4,
									color: '#333',
									fontWeight: '500',
								}}
							>
								Reply
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={{ flex: 1 }}
						onPress={() => {
							onPressC(message), closeModal();
						}}
					>
						<View style={{ alignItems: 'center' }}>
							<Icon
								as={Ionicons}
								name={'copy-outline'}
								size={7}
								color={colors.primary}
							/>
							<Text
								style={{
									marginTop: 4,
									color: '#333',
									fontWeight: '500',
								}}
							>
								Copy
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={{ flex: 1 }}
						onPress={() => {
							onPressU(message), closeModal();
						}}
					>
						<View style={{ alignItems: 'center' }}>
							<Icon
								as={Ionicons}
								name={'create-outline'}
								size={7}
								color={colors.primary}
							/>
							<Text
								style={{
									marginTop: 4,
									color: '#333',
									fontWeight: '500',
								}}
							>
								Edit
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={{ flex: 1 }}
						onPress={() => {
							onPressD(message), closeModal();
						}}
					>
						<View style={{ alignItems: 'center' }}>
							<Icon
								as={Ionicons}
								name={'trash-outline'}
								size={7}
								color={colors.primary}
							/>
							<Text
								style={{
									marginTop: 4,
									color: '#333',
									fontWeight: '500',
								}}
							>
								Delete
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={{ flex: 1 }}
						// onPress={() => Alert.alert('Notice', 'Coming soon!')}
						onPress={() => {
							onPressP({ itemMessageSelected: message });
							closeModal();
						}}
					>
						<View style={{ alignItems: 'center' }}>
							<Icon
								as={SimpleLineIcons}
								name={'pin'}
								size={7}
								color={colors.primary}
							/>
							<Text
								style={{
									marginTop: 4,
									color: '#333',
									fontWeight: '500',
								}}
							>
								Pin
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default ChooseEmojiComponent;
