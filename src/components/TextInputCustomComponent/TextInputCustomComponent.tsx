import Color from '@config/Color';
import { Icon } from 'native-base';
import React from 'react';
import {
	KeyboardTypeOptions,
	Platform,
	Text,
	TextInput,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface IProps {
	label?: string;
	placeholder?: string;
	value?: any;
	style?: ViewStyle;
	styleContainerInput?: ViewStyle;
	enable?: boolean;
	enableButton?: boolean;
	onChangeText?: (text: string) => void;
	keyboardType?: KeyboardTypeOptions;
	onPress?: () => void;
	multiline?: boolean;
	inputStyle?: TextStyle;
	autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
	clearTextOnFocus?: boolean;
	iconRight?: string;
	textColor?: string;
}

export default function TextInputCustomComponent(props: IProps) {
	const {
		placeholder,
		label,
		style,
		styleContainerInput,
		enable = true,
		enableButton = false,
		value,
		onChangeText,
		keyboardType,
		onPress,
		multiline,
		inputStyle,
		autoCapitalize,
		clearTextOnFocus,
		iconRight,
		textColor,
	} = props;

	return (
		<TouchableOpacity style={style} onPress={onPress} disabled={!enable}>
			<Text style={{ color: textColor || '#555', fontWeight: '500' }}>{label}</Text>
			<View
				style={[
					{
						borderColor: '#666',
						borderWidth: 0.5,
						borderRadius: 4,
						paddingVertical: Platform.OS === 'ios' ? 12 : 6,
						paddingHorizontal: 8,
						marginTop: 4,
						backgroundColor: enable ? '#fff' : DefaultTheme.colors.background,
						justifyContent: 'center',
					},
					styleContainerInput,
				]}
			>
				<TextInput
					pointerEvents={enable ? 'auto' : 'none'}
					placeholder={placeholder}
					value={value}
					style={[
						{ color: '#666', padding: 0, marginRight: iconRight ? 28 : 0 },
						inputStyle,
					]}
					onChangeText={onChangeText}
					keyboardType={keyboardType}
					editable={enable}
					multiline={multiline}
					autoCapitalize={autoCapitalize}
					clearTextOnFocus={clearTextOnFocus}
				/>
				<View style={{ position: 'absolute', right: 8 }}>
					<Icon
						as={Ionicons}
						name={iconRight}
						color={Color.approved}
						size={6}
						onPress={onPress}
						disabled={enableButton}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}
