import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface IProps {
	icon?: string;
	iconColor?: string;
	isIconRight?: boolean;
	value: string | Element;
	label?: string;
	styleValue?: TextStyle;
	styleLabel?: TextStyle;
	containerStyle?: ViewStyle;
}

export default function TextInfoRow(props: IProps) {
	const { colors } = useTheme();
	const {
		icon,
		isIconRight,
		value,
		styleValue,
		styleLabel,
		containerStyle,
		iconColor,
		label,
	} = props;
	return (
		<View
			style={[
				{
					justifyContent: isIconRight ? 'flex-end' : 'flex-start',
					flexDirection: 'row',
					alignItems: 'center',
					flex: 1,
				},
				containerStyle,
			]}
		>
			{isIconRight ? null : (
				<Icon
					as={Ionicons}
					name={icon}
					size={6}
					color={iconColor || colors.primary}
					marginRight={2}
				/>
			)}
			{label && <Text style={[{ flex: 1 }, styleLabel]}>{label}</Text>}
			<Text style={styleValue}>{value}</Text>
			{isIconRight ? (
				<Icon
					as={Ionicons}
					name={icon}
					size={6}
					color={iconColor || colors.primary}
					marginLeft={2}
				/>
			) : null}
		</View>
	);
}
