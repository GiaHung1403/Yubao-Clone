import Color from '@config/Color';
import { Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
import {
	KeyboardTypeOptions,
	Platform,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
	Animated,
} from 'react-native';
import { DefaultTheme, useTheme, TextInput } from 'react-native-paper';

import { Ionicons, Feather } from '@expo/vector-icons';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

interface IProps {
	label?: string;
	placeholder?: string;
	value?: string;
	style?: ViewStyle;
	styleContainerInput?: ViewStyle;
	enable?: boolean;
	onChangeText?: (text: string) => void;
	keyboardType?: KeyboardTypeOptions;
	onPress?: () => void;
	multiline?: boolean;
	inputStyle?: TextStyle;
	autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
	clearTextOnFocus?: boolean;
	iconRight?: string;
	viewHeight?: number;
	inputTextHeight?: number;
	showX?: boolean;
	onPressX?: () => void;
}

//  const anime = {
// 		height: new Animated.Value(100),
// 		contentHeight: 220,
//  };

export default function TextInputCustomComponentForTenor(props: IProps) {
	const {
		placeholder,
		label,
		style,
		styleContainerInput,
		enable = true,
		value,
		onChangeText,
		keyboardType,
		onPress,
		multiline,
		inputStyle,
		autoCapitalize,
		clearTextOnFocus,
		iconRight,
		viewHeight,
		inputTextHeight,
		showX,
		onPressX,
	} = props;

	const { colors } = useTheme();

	const [isFocus, setHasFocus] = useState(false);
	return (
		<TouchableOpacity style={style} disabled={enable}>
			<TextInput
				// mode="outlined"
				textAlign={'left'}
				label={placeholder}
				placeholder={placeholder}
				// secureTextEntry={secureTextEntry}
				autoCapitalize={autoCapitalize}
				keyboardType={keyboardType}
				placeholderTextColor="#666"
				value={value}
				onChangeText={onChangeText}
				style={{
					flex: 1,
					backgroundColor: 'transparent',
					// height: 40,
				}}
				onFocus={() => setHasFocus(true)}
				onBlur={() => setHasFocus(false)}
			/>

			{showX && (
				<View
					style={{
						top: 8,
						right: 0,
						bottom: 0,
						justifyContent: 'center',
						alignItems: 'center',
						position: 'absolute',
						paddingHorizontal: 8,
					}}
				>
					<TouchableOpacity onPress={onPressX}>
						<Icon as={Feather} name="x" size={6} color={colors.primary} />
					</TouchableOpacity>
				</View>
			)}
		</TouchableOpacity>
	);
}
