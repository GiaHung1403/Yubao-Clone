import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Select } from 'native-base';
import React from 'react';
import {
	KeyboardTypeOptions,
	Platform,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import { DefaultTheme, Searchbar } from 'react-native-paper';

interface IProps {
	showLabel: boolean;
	label: string;
	value?: string;
	style?: ViewStyle;
	enable?: boolean;
	onChangeText?: (text: string) => void;
	keyboardType?: KeyboardTypeOptions;
	listData: any[];
	onValueChange?: (text) => void;
	textStyle?: TextStyle;
}

export default function PickerCustomComponent(props: IProps) {
	const {
		showLabel,
		label,
		style,
		enable = true,
		value,
		listData,
		onValueChange,
		textStyle,
	} = props;

	return (
		<View style={style}>
			{showLabel ? (
				<Text style={{ color: '#555', fontWeight: '500' }}>{label}</Text>
			) : null}
			<View
				style={{
					borderRadius: 4,
					marginTop: 4,
					backgroundColor: enable ? '#fff' : DefaultTheme.colors.background,
					borderWidth: 0.5,
					borderColor: '#666',
					height: Platform.OS === 'ios' ? 42 : 41,
					justifyContent: 'center',
				}}
			>
				<Select
					variant={'unstyled'}
					placeholder={label}
					placeholderTextColor="#999"
					isDisabled={!enable}
					dropdownIcon={
						<Icon
							name="keyboard-arrow-down"
							as={MaterialIcons}
							color={'#666'}
						/>
					}
					selectedValue={value}
					onValueChange={text => (onValueChange ? onValueChange(text) : null)}
				>
					{listData
						? listData.map((item, index) => (
								<Select.Item
									key={index.toString()}
									label={item.label}
									value={item.value}
								/>
						  ))
						: null}
				</Select>
			</View>
		</View>
	);
}
