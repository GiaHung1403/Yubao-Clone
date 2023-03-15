import { Icon } from 'native-base';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
	Text,
	TouchableOpacity,
	View,
	TextInput,
	Platform,
	Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker, {
	Image,
	ImageOrVideo,
	Options,
} from 'react-native-image-crop-picker';
import sizes from 'native-base/lib/typescript/theme/base/sizes';
// let listRoomMember: IMemberRoom[];
// let itemMessageSelected: IMessage;
interface IProps {
	inputMessageRef: any;
	onFocusInputMessage: () => void;
	onChangeTextMessage: (text: string) => void;
}
let currentPointer: number = 0;
let isTyping: boolean = false;
let message: string = '';

const libraryPickerConfig: Options = {
	multiple: true,
	compressVideoPreset: 'Passthrough',
	mediaType: 'any',
	forceJpg: true,
	// includeBase64 : true,
};

function ViewButtonFunction(props: any, ref: any) {
	const { onPressSentMessage, onPressPickerImage, onPressPickerFile } = props;
	const { colors } = useTheme();
	const [isTyping, setTyping] = useState(false);
	useImperativeHandle(ref, () => ({
		onSetTyping: (isTypingValue: boolean) => {
			setTyping(isTypingValue);
		},
	}));

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			{/* Button send message */}
			{isTyping ? (
				<TouchableOpacity
					style={{ paddingHorizontal: 16 }}
					onPress={onPressSentMessage}
				>
					<Icon
						as={Ionicons}
						name={'paper-plane-outline'}
						size={7}
						color={colors.primary}
					/>
				</TouchableOpacity>
			) : null}

			{/* Button send image */}
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

			{/* Button send */}
			{!isTyping ? (
				<TouchableOpacity
					onPress={onPressPickerFile}
					style={{ paddingHorizontal: 16 }}
				>
					<Icon
						as={Ionicons}
						name={'document-attach-outline'}
						size={7}
						color={colors.primary}
					/>
				</TouchableOpacity>
			) : null}
		</View>
	);
}

const ViewButtonFunctionRef = React.forwardRef(ViewButtonFunction);

export default function ChatInputComponent(props: any) {
	const { colors } = useTheme();
	const { inputMessageRef, listMessage, key_id, onPressButtonEmoji } = props;
	const [formattedContent, setFormattedContent] = useState('');
	const [mentionName, setMentionName] = useState('');
	const buttonViewerRef = useRef<any>();

	const _onSentMessage = async () => {
		const temp = [...listMessage?.listMessage.reverse()];
		temp.push({
			From: '2',
			Text: message,
			createAt: firestore.Timestamp.now(),
			seen: false,
		});
		setMessageValue('');
		try {
			await firestore().collection('Chat_Support').doc(key_id).update({
				listMessage: temp,
			});
		} catch (error: any) {
			Alert.alert('Error', error.message);
		}
	};

	const _onPressPickerFile = async () => {
		try {
			const results = await DocumentPicker.pickMultiple({
				type: [DocumentPicker.types.allFiles],
			});
			// await axios.post("http://124.158.8.254:3030/upload/upload_file_chat", {
			//   uri: results[0]?.uri,
			//   name: results[0]?.name,
			//   type: results[0]?.type,
			// });

			//send to firebase
			const temp = [...listMessage?.listMessage.reverse()];
			temp.push({
				From: '2',
				Text: '',
				createAt: firestore.Timestamp.now(),
				seen: false,
				attachments: { fileName: results[0]?.name, type: results[0]?.type },
			});

			try {
				await firestore()
					.collection('Chat_Support')
					.doc(key_id)
					.update({
						listMessage: temp,
					});
			} catch (error: any) {
				Alert.alert('Error', error.message);
			}
		} catch (err: any) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	};

	//   const uploadImage = async () => {
	//     const { uri } = image;
	//     const filename = uri.substring(uri.lastIndexOf("/") + 1);
	//     const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
	//     setUploading(true);
	//     setTransferred(0);
	//     const task = storage().ref(filename).putFile(uploadUri);
	//     // set progress state
	//     task.on("state_changed", snapshot => {
	//       setTransferred(
	//         Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
	//       );
	//     });
	//     try {
	//       await task;
	//     } catch (e) {
	//       console.error(e);
	//     }
	//     setUploading(false);
	//     Alert.alert(
	//       "Photo uploaded!",
	//       "Your photo has been uploaded to Firebase Cloud Storage!",
	//     );
	//     setImage(null);
	//   };

	const _onPressPickerImage = async () => {
		try {
			// The type can be video or photo, however the lib understands that it is just one of them.
			let attachments = (await ImagePicker.openPicker(
				libraryPickerConfig,
			)) as unknown as ImageOrVideo[];
			attachments.forEach(async item => {
				// await axios.post("http://124.158.8.254:3030/upload/upload_file_chat", {
				//   uri: item?.sourceURL,
				//   name: item?.filename,
				//   type: item?.mime,
				// });

				//send to firebase
				const temp = [...listMessage?.listMessage.reverse()];
				temp.push({
					From: '2',
					Text: '',
					createAt: firestore.Timestamp.now(),
					seen: false,
					attachments: { fileName: item?.filename, type: item?.mime },
				});
				   try {
				     await firestore()
				       .collection("Chat_Support")
				       .doc(key_id)
				       .update({
				         listMessage: temp,
				       });
				   } catch (error: any) {
				     Alert.alert("Error", error.message);
				   }
			});
		} catch (err) {
			//logEvent(events.ROOM_BOX_ACTION_LIBRARY_F);
			throw err;
		}
	};

	const setMessageValue = (value: string, text: string = '') => {
		inputMessageRef.current.setNativeProps({ text: text || value });
		message = value;
		buttonViewerRef.current.onSetTyping(value);
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				// paddingBottom: isIphoneX() ? 30 : 0,
			}}
		>
			{/* Button emoji */}
			<TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => {onPressButtonEmoji()}}>
				<Icon
					as={Ionicons}
					name={'happy-outline'}
					size={7}
					color={colors.primary}
				/>
			</TouchableOpacity>
			{/* Input message */}
			<TextInput
				ref={inputMessageRef}
				placeholder="New Message"
				style={{
					flex: 1,
					color: '#000',
					maxHeight: 100,
					marginVertical: Platform.OS === 'ios' ? 20 : 8,
				}}
				multiline
				onSelectionChange={({ nativeEvent: { selection } }) => {
					currentPointer = selection.end;
				}}
				// onFocus={_onFocusInputMessage}
				onChangeText={item => setMessageValue(item)}
			/>
			<ViewButtonFunctionRef
				ref={ref => {
					buttonViewerRef.current = ref;
				}}
				onPressSentMessage={() => _onSentMessage()}
				onPressPickerImage={() => {
					_onPressPickerImage();
				}}
				onPressPickerFile={() => {
					_onPressPickerFile();
				}}
			/>
		</View>
	);
}
