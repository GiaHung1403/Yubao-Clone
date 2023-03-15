import Color from '@config/Color';
import { Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
import {
	KeyboardTypeOptions,
	Platform,
	Text,
	TextInput,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
	Animated,
} from 'react-native';
import { DefaultTheme, useTheme } from 'react-native-paper';

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

export default function TextInputCustomComponentForVote(props: IProps) {
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

	const [getHeight, setHeight] = useState<any>(1);
	const [anime, setAnime] = useState<any>({
		height: new Animated.Value(viewHeight),
	});

	// useEffect(() => {
	// 	if(getHeight < viewHeight)
	// 	{Animated.timing(anime.height, {
	// 		toValue: viewHeight,
	// 		duration: 300,
	// 		useNativeDriver: false,
	// 	}).start();
	// 		 return;}

	// 			Animated.timing(anime.height, {
	// 				toValue: getHeight + 20,
	// 				duration: 300,
	// 				useNativeDriver: false,
	// 			}).start();
	// 	}, [getHeight]);

	return (
		<TouchableOpacity style={style} disabled={enable}>
			<Animated.View
				style={[
					{
						paddingVertical: Platform.OS === 'ios' ? 12 : 6,
						paddingHorizontal: 8,
						borderBottomColor: '#BBBBBB',
						borderBottomWidth: 0.5,
						height: anime.height,

						position: 'relative',
					},
					styleContainerInput,
				]}
			>
				<TextInput
					pointerEvents={enable ? 'auto' : 'none'}
					placeholder={placeholder}
					value={value}
					placeholderTextColor={'#666'}
					style={[
						{
							color: '#666',
							padding: 0,
							flex: 1,
							position: 'absolute',
							left: 0,
							right: 20,
							top: 10,
						},
						inputStyle,
					]}
					// onLayout={() => {

					// }}
					onChangeText={onChangeText}
					keyboardType={keyboardType}
					editable={enable}
					multiline={multiline}
					autoCapitalize={autoCapitalize}
					clearTextOnFocus={clearTextOnFocus}
					onContentSizeChange={event => {
						const heightView = event.nativeEvent.contentSize.height;
						//setHeight(heightView);
						if (heightView < viewHeight) {
							Animated.timing(anime.height, {
								toValue: viewHeight,
								duration: 300,
								useNativeDriver: false,
							}).start();
						} else {
							Animated.timing(anime.height, {
								toValue: heightView + 35,
								duration: 300,
								useNativeDriver: false,
							}).start();
						}
					}}
				/>
			</Animated.View>

			{showX && (
				<View style={{ alignSelf: 'flex-end', position: 'absolute', top: 15 }}>
					<TouchableOpacity onPress={onPressX}>
						<Icon as={Feather} name="x" size={6} color={colors.primary} />
					</TouchableOpacity>
				</View>
			)}
		</TouchableOpacity>
	);
}
