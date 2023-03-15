import { Icon, ScrollView } from 'native-base';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
	Text,
	TouchableOpacity,
	View,
	Image,
	TextInput,
	Platform,
	Pressable,
	SafeAreaView,
	KeyboardAvoidingView,
	Animated,
} from 'react-native';
import { IMemberRoom } from '../../../models/types';
import { Ionicons } from '@expo/vector-icons';
import { getDomainAPIChat } from '@data/Constants';
import { useSelector } from 'react-redux';
import EventEmitter from '@utils/events';
import { Avatar, useTheme } from 'react-native-paper';
import {
	MentionInput,
	Suggestion,
	replaceMentionValues,
} from 'react-native-controlled-mentions';

interface IProps {
	onChangeTextMessage: (text: string) => void;
	onPressSentMessage: (item: any) => void;
	onPressPickerImage: () => void;
	onPressPickerFile: () => void;
	onPressButtonEmoji: () => void;
}

function ViewButtonFunction(props: any, ref: any) {
	const {
		onPressSentMessage,
		onPressPickerImage,
		onPressPickerFile,
		message,
		onChangeText,
	} = props;
	const { colors } = useTheme();
	const [isTyping, setTyping] = useState(false);
	useImperativeHandle(ref, () => ({
		onSetTyping: (isTypingValue: boolean) => {
			setTyping(isTypingValue);
		},
	}));

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				// paddingVertical: 16,
				// alignSelf: 'flex-end',
			}}
		>
			{/* Button send message */}
			{isTyping ? (
				<TouchableOpacity
					style={{ paddingHorizontal: 16 }}
					onPress={() => {
						onPressSentMessage(message), onChangeText(''), setTyping(false);
					}}
				>
					<Icon
						as={Ionicons}
						name={'paper-plane-outline'}
						size={7}
						color={colors.primary}
					/>
				</TouchableOpacity>
			) : null}

			{/* Button record voice */}
			{!isTyping ? (
				<TouchableOpacity
					style={{ paddingHorizontal: 16 }}
					onPress={onPressPickerImage}
				>
					<Icon
						as={Ionicons}
						name={'images-outline'}
						size={7}
						color={colors.primary}
					/>
				</TouchableOpacity>
			) : null}

			{/* Button show menu bottom */}
			{!isTyping ? (
				<TouchableOpacity
					onPress={onPressPickerFile}
					style={{ paddingHorizontal: 16 }}
				>
					<Icon
						as={Ionicons}
						name={'document-attach-outline'}
						fontSize={7}
						color={colors.primary}
					/>
				</TouchableOpacity>
			) : null}
		</View>
	);
}

const ViewButtonFunctionRef = React.forwardRef(ViewButtonFunction);

export default function ChatInputView(props: IProps) {
	let message = '';
	const { colors } = useTheme();
	const {
		onChangeTextMessage,
		onPressSentMessage,
		onPressPickerImage,
		onPressPickerFile,
		onPressButtonEmoji,
	} = props;
	const [value, setValue] = useState('');
	const buttonViewerRef = useRef<any>();
	const listRoomMemberRC: IMemberRoom[] = useSelector(
		(state: any) => state.room_rc_reducer.listRoomMemberRC,
	);

	EventEmitter.addEventListener('showEdit', item => {
		buttonViewerRef.current.onSetTyping(
			item?.itemMessageSelected?.msg ? item?.itemMessageSelected?.msg : '',
		);
		setValue(
			item?.itemMessageSelected?.msg ? item?.itemMessageSelected?.msg : '',
		);
	});

	const inputMessageRef = useRef<any>();

	EventEmitter.addEventListener('showEmoji', item => {
		const temp = value + item?.view;
		buttonViewerRef.current.onSetTyping(temp);
		setValue(temp);
	});

	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const [heightValue, setHeightValue] = useState(new Animated.Value(70));

	// useEffect(() => {
	// 	if (showEmojiPicker) {
	// 		height.value = withTiming(350);
	// 	} else height.value = withTiming(0);
	// }, [showEmojiPicker]);

	// const heightAnimatedStyle = useAnimatedStyle(() => {
	// 	return {
	// 		height: height.value,
	// 	};
	// });

	useEffect(() => {
		showEmoji();
	}, [showEmojiPicker]);

	const showEmoji = () => {
		Animated.timing(heightValue, {
			toValue: showEmojiPicker ? 400 : 70,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	const renderSuggestions: (
		suggestions: Suggestion[],
	) => FC<MentionSuggestionsProps> =
		suggestions =>
		({ keyword, onSuggestionPress }) => {
			if (keyword == null) {
				return null;
			}

			return (
				<ScrollView
					style={{
						backgroundColor: 'white',
						maxHeight: 150,
						position: 'absolute',
						bottom: 50,
						flex: 1,
						left: 0,
						right: 0,
					}}
				>
					{suggestions
						.filter(
							one =>
								one.name
									.toLocaleLowerCase()
									.includes(keyword.toLocaleLowerCase()) ||
								one.id
									.toLocaleLowerCase()
									.includes(keyword.toLocaleLowerCase()),
						)
						.map(one => (
							<Pressable
								key={one.id}
								onPress={() => onSuggestionPress(one)}
								style={{ padding: 10, flexDirection: 'row' }}
							>
								<Avatar.Image
									source={{
										uri: `${getDomainAPIChat()}/avatar/${
											one.id
										}?size=60&format=png`,
									}}
									size={20}
									style={{ backgroundColor: '#fff', marginRight: 8 }}
								/>
								<Text>{one.name}</Text>
							</Pressable>
						))}
				</ScrollView>
			);
		};

	const renderMentionSuggestions = renderSuggestions(
		listRoomMemberRC.map(item => ({ id: item?.username, name: item?.name })),
	);

	const setMessageValue = (value: string, text: string = '') => {
		inputMessageRef?.current.setNativeProps({ text: text || value });
		message = value;
		buttonViewerRef.current.onSetTyping(value);
	};

	return (
		<Animated.View style={{ height: heightValue }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					// paddingBottom: isIphoneX() ? 30 : 0,
				}}
			>
				{/* Button emoji */}
				<TouchableOpacity
					style={{
						paddingHorizontal: 16,
						// paddingVertical: 16,
						// alignSelf: 'flex-end',
					}}
					onPress={() => onPressButtonEmoji()}
					// onPress={() => setShowEmojiPicker(value => !value)}
				>
					<Icon
						as={Ionicons}
						name={'happy-outline'}
						size={7}
						color={colors.primary}
					/>
				</TouchableOpacity>

				<KeyboardAvoidingView
					enabled={Platform.OS === 'ios'}
					behavior="padding"
					style={{
						flex: 1,
						maxHeight: 150,
						marginVertical: Platform.OS === 'ios' ? 20 : 8,
					}}
				>
					<View>
						<MentionInput
							inputRef={inputMessageRef}
							value={value}
							onChange={text => {
								setValue(text);
								buttonViewerRef.current.onSetTyping(text);
							}}
							partTypes={[
								{
									trigger: '@',
									renderSuggestions: renderMentionSuggestions,
								},
								{
									pattern:
										/(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
									textStyle: { color: 'blue' },
								},
							]}
							style={{
								fontSize: 15,
								zIndex: 1,
							}}
							placeholder="New Message"
						/>
					</View>
				</KeyboardAvoidingView>
				<ViewButtonFunctionRef
					ref={ref => {
						buttonViewerRef.current = ref;
					}}
					message={replaceMentionValues(value, ({ id }) => `@${id}`)}
					onPressSentMessage={onPressSentMessage}
					onPressPickerImage={onPressPickerImage}
					onPressPickerFile={onPressPickerFile}
					onChangeText={setValue}
				/>
			</View>
		</Animated.View>
	);
}
