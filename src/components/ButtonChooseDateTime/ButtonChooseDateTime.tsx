import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	Platform,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';

import Color from '@config/Color';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModalCustom from '../DateTimePickerModalCustom';
import styles from './styles';

import { useTheme } from 'react-native-paper';
import moment from 'moment';

interface IProps {
	label: string;
	valueDisplay: string;
	value: Date;
	onHandleConfirmDate: (date: Date) => void;
	containerStyle?: ViewStyle;
	modalMode?: 'date' | 'time' | 'datetime';
	disabled?: boolean;
	disableBorder?: boolean;
	minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30 | undefined;
	maximumDate?: Date;
	minimumDate?: Date;
	textColor?: string;
}

export default function ButtonChooseDateTime(props: IProps) {
	const dateTimePickerRef = useRef<any>(null);
	const { colors } = useTheme();
	const {
		value,
		valueDisplay,
		onHandleConfirmDate,
		containerStyle,
		label,
		modalMode = 'datetime',
		disabled = false,
		disableBorder,
		minuteInterval = undefined,
		maximumDate,
		minimumDate,
		textColor,
	} = props;

	return (
		<>
			<TouchableOpacity
				disabled={disabled}
				style={containerStyle}
				onPress={() => dateTimePickerRef.current.onShowModal()}
			>
				<Text
					style={{
						...styles.labelButtonChooseDate,
						color: textColor || 'black',
					}}
				>
					{label}
				</Text>
				<View
					style={[
						styles.contentButtonChooseDate,
						{
							borderWidth: disableBorder ? 0 : 0.5,
							padding: disableBorder ? 0 : Platform.OS === 'android' ? 2 : 8,
						},
					]}
				>
					<Text style={styles.valueButtonChooseDate}>{valueDisplay}</Text>
					<Icon
						as={AntDesign}
						name={'calendar'}
						size={7}
						color={colors.primary}
						marginRight={1}
					/>
				</View>
			</TouchableOpacity>

			<DateTimePickerModalCustom
				ref={dateTimePickerRef}
				mode={modalMode}
				date={moment(value).isValid() ? value : new Date(Date.now())}
				onConfirm={onHandleConfirmDate}
				minuteInterval={minuteInterval}
				maximumDate={maximumDate}
				minimumDate={minimumDate}
			/>
		</>
	);
}
