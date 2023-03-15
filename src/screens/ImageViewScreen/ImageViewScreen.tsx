import CameraRoll from '@react-native-community/cameraroll';
import * as FileSystem from 'expo-file-system';
import { Icon } from 'native-base';
import React, { useState } from 'react';
import {
	Alert,
	PermissionsAndroid,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';

import Toast from '@components/Toast';
import { Ionicons } from '@expo/vector-icons';
import { EventEmitterEnum } from '@models/EventEmitterEnum';
import { IMessage } from '@models/types';
import EventEmitter from '@utils/events';
import Share from 'react-native-share';
import {
	DocumentDirectoryPath,
	downloadFile,
	DownloadFileOptions,
	readFile,
} from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

export function ImageViewScreen(props: any, ref: any) {
	const [visible, setVisible] = useState<boolean>(false);
	// const [imageViewer, setImageViewer] = useState<any>();
	const [message, setMessage] = useState<IMessage>();
	const [downloadProgress, setDownloadProgress] = useState<number>(0);
	const navigation: any = useNavigation();
	const { imageViewer } = props.route.params;

	const { colors } = useTheme();

	// useImperativeHandle(ref, () => ({
	// 	onShowViewer: (imageURL, messageItem) => {
	// 		setVisible(true);
	// 		setMessage(messageItem);
	// 		setImageViewer([
	// 			{
	// 				// Simplest usage.
	// 				url: imageURL,

	// 				// width: number
	// 				// height: number
	// 				// Optional, if you know the image size, you can set the optimization performance

	// 				// You can pass props to <Image />.
	// 				props: {
	// 					// headers: ...
	// 				},
	// 			},
	// 		]);
	// 	},
	// }));

	const checkAndroidPermission = async () => {
		try {
			const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
			await PermissionsAndroid.request(permission);
			await Promise.resolve();
		} catch (error) {
			await Promise.reject(error);
		}
	};

	const handleDownload = async () => {
		if (Platform.OS === 'android') {
			await checkAndroidPermission();
		}
		downloadImage().then();
	};

	const callback = progress => {
		const progressCal =
			progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
		setDownloadProgress(progressCal);
	};

	const downloadResumable = () => {
		const urlImage = message?.attachments[0].image_url;

		return FileSystem.createDownloadResumable(
			imageViewer[0].url,
			FileSystem.documentDirectory +
				urlImage!.substring(urlImage!.lastIndexOf('/') + 1),
			{},
			callback,
		);
	};

	const downloadImage = async () => {
		try {
			// @ts-ignore
			const { uri } = await downloadResumable().downloadAsync();
			CameraRoll.save(uri, {
				type: 'auto',
				album: 'Yubao',
			}).then(() => {
				EventEmitter.emit(EventEmitterEnum.TOAST, {
					message: 'Save image success!',
				});
			});
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	const _onPressButtonShare = url => {
		Platform.OS === 'ios' ? sharePDFWithIOS(url) : sharePDFWithAndroid(url);
	};

	const sharePDFWithIOS = async url => {
		// Define path to store file along with the extension
		const path = `${DocumentDirectoryPath}/image.jpeg`;
		const headers = {
			Accept: 'image/*',
			'Content-Type': 'image/*',
			Authorization: `Bearer [token]`,
		};
		// Define options
		const options: DownloadFileOptions = {
			fromUrl: url,
			toFile: path,
			headers,
		};
		// Call downloadFile
		await downloadFile(options).promise;
		const optionsShare = {
			title: 'image',
			type: 'image/*',
			url: path,
		};
		await Share.open(optionsShare);
		// remove the image or pdf from device's storage
	};

	const sharePDFWithAndroid = async url => {
		// Define path to store file along with the extension
		const path = `${DocumentDirectoryPath}/image.jpeg`;
		const headers = {
			Accept: 'image/*',
			'Content-Type': 'image/*',
			Authorization: `Bearer [token]`,
		};
		// Define options
		const options: DownloadFileOptions = {
			fromUrl: url,
			toFile: path,
			headers,
		};
		// Call downloadFile
		await downloadFile(options).promise;
		const base64Data = await readFile(path, 'base64');
		const optionsShare = {
			title: '',
			url: `data:image/jpeg;;base64,` + base64Data,
			filename: `image`,
		};
		await Share.open(optionsShare);
		// remove the image or pdf from device's storage
	};

	return (
		// <Modal
		// 	isVisible={visible}
		// 	style={{ margin: 0 }}
		// 	animationOut={'zoomOutDown'}
		// 	animationIn={'zoomInUp'}
		// >
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'light-content'} />
			<ImageViewer
				imageUrls={[
					{
						// Simplest usage.
						url: imageViewer,

						props: {
							// headers: ...
						},
					},
				]}
				backgroundColor="rgba(0,0,0,0.8)"
				enableSwipeDown
				// onSwipeDown={() => setVisible(false)}
				onSwipeDown={() => navigation.goBack()}
				renderImage={propsImage => <FastImage {...propsImage} />}
				swipeDownThreshold={0.3}
				saveToLocalByLongPress={false}
				renderIndicator={() => <View />}
				renderHeader={() => (
					<View
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							zIndex: 2,
							backgroundColor: 'rgba(0,0,0,0.6)',
						}}
					>
						<SafeAreaView />
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingHorizontal: 8,
								justifyContent: 'space-between',
							}}
						>
							<TouchableOpacity
								// onPress={() => setVisible(false)}
								onPress={() => navigation.goBack()}
							>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Icon
										as={Ionicons}
										name={'chevron-back-outline'}
										size={7}
										color={colors.primary}
									/>
									<Text
										style={{
											marginLeft: 20,
											color: '#fff',
											fontWeight: 'bold',
										}}
									>
										{message?.u.name}
									</Text>
								</View>
							</TouchableOpacity>

							<View
								style={{
									justifyContent: 'space-between',
									flexDirection: 'row',
								}}
							>
								<TouchableOpacity
									style={{ padding: 8 }}
									onPress={handleDownload}
								>
									<Icon
										as={Ionicons}
										name={'cloud-download-outline'}
										size={7}
										color={'#fff'}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									style={{ padding: 8 }}
									onPress={() => _onPressButtonShare(imageViewer[0].url)}
								>
									<Icon
										as={Ionicons}
										name={'share-social-outline'}
										size={7}
										color={'#fff'}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
			/>
			<Toast />
		</View>
		// </Modal>
	);
}
