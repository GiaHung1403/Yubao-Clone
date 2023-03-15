import { Icon } from 'native-base';
import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import Color from '@config/Color';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useTheme } from 'react-native-paper';
import DateTimePickerModalCustom from '../DateTimePickerModalCustom/DateTimePickerModalCustom';
import styles from './styles';

interface IProps {
	fromDateDisplay: string;
	toDateDisplay: string;
	fromDate: Date;
	toDate: Date;
	onHandleConfirmFromDate: (date: Date) => void;
	onHandleConfirmToDate: (date: Date) => void;
	containerStyle?: ViewStyle;
	modalMode?: 'date' | 'time' | 'datetime';
	disabled?: boolean;
	minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30 | undefined;
	maximumDate?: Date;
	minimumDate?: Date;
}

export default function ButtonChooseRangeTime(props: IProps) {
	const fromDatePickerRef = useRef<any>(null);
	const toDatePickerRef = useRef<any>(null);
	const { colors } = useTheme();
	const {
		fromDate,
		toDate,
		fromDateDisplay,
		toDateDisplay,
		onHandleConfirmFromDate,
		onHandleConfirmToDate,
		containerStyle,
		modalMode = 'datetime',
		disabled = false,
		minuteInterval,
		maximumDate,
		minimumDate,
	} = props;

	return (
		<>
			<View style={{ marginTop: 8 }}>
				<Text style={{ color: '#666666', fontSize: 12, marginBottom: 4 }}>
					Choose a date:
				</Text>
				<View
					style={{
						flexDirection: 'row',
						borderRadius: 4,
						backgroundColor: '#fff',
					}}
				>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							flex: 1,
							padding: 8,
							borderWidth: 0.5,
							borderTopLeftRadius: 4,
							borderBottomLeftRadius: 4,
							borderColor: '#66666660',
						}}
						onPress={() => fromDatePickerRef.current.onShowModal()}
					>
						<Text style={{}}>{fromDateDisplay}</Text>
						<Icon
							as={Ionicons}
							name={'calendar-outline'}
							size={6}
							color={Color.draft}
							marginRight={1}
						/>
					</TouchableOpacity>
					<View
						style={{
							backgroundColor: '#99999920',
							padding: 8,
							borderTopWidth: 0.5,
							borderBottomWidth: 0.5,
							borderColor: '#66666660',
						}}
					>
						<Icon as={Ionicons} name="arrow-forward-outline" size={6} />
					</View>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							flex: 1,
							padding: 8,
							borderWidth: 0.5,
							borderTopRightRadius: 4,
							borderBottomRightRadius: 4,
							borderColor: '#66666660',
						}}
						onPress={() => toDatePickerRef.current.onShowModal()}
					>
						<Text style={{}}>{toDateDisplay}</Text>
						<Icon
							as={Ionicons}
							name={'calendar-outline'}
							size={6}
							color={Color.draft}
							marginRight={1}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<DateTimePickerModalCustom
				ref={fromDatePickerRef}
				mode={modalMode}
				date={fromDate}
				onConfirm={onHandleConfirmFromDate}
				minuteInterval={minuteInterval}
				maximumDate={maximumDate}
				minimumDate={minimumDate}
			/>

			<DateTimePickerModalCustom
				ref={toDatePickerRef}
				mode={modalMode}
				date={toDate}
				onConfirm={onHandleConfirmToDate}
				minuteInterval={minuteInterval}
				maximumDate={maximumDate}
				minimumDate={minimumDate}
			/>
		</>
	);
}
