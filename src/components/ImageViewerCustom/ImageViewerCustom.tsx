import { Icon } from 'native-base';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
	PermissionsAndroid,
	Platform,
	SafeAreaView,
	StatusBar,
	TouchableOpacity,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

function ImageViewerCustom(props: any, ref: any) {
	const [visible, setVisible] = useState<boolean>(false);
	const [imageViewer, setImageViewer] = useState<any>();
	const [initIndex, setInitIndex] = useState(0);
	const [downloadProgress, setDownloadProgress] = useState<number>(0);
	//`data:image/jpeg;base64,${imageViewer}`

	useImperativeHandle(ref, () => ({
		onShowViewer: (listImageURL, index) => {
			setVisible(true);
			setInitIndex(index);
			setImageViewer(
				listImageURL.map(item => ({
					...item,
					props: {},
				})),
			);
		},
	}));


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
		// const urlImage = message!.attachments[0].image_url;
		//
		// return FileSystem.createDownloadResumable(
		//   imageViewer[0].url,
		//   FileSystem.documentDirectory + urlImage.substring(urlImage.lastIndexOf('/') + 1),
		//   {},
		//   callback,
		// );
	};

	const downloadImage = async () => {
		// try {
		//   // @ts-ignore
		//   const { uri } = await downloadResumable().downloadAsync();
		//   CameraRoll.save(uri, {
		//     type: 'auto',
		//     album: 'Yubao',
		//   }).then(() => {
		//     EventEmitter.emit(EventEmitterEnum.TOAST, { message: 'Save image success!' });
		//   });
		// } catch (e: any) {
		//   Alert.alert('Error', e.message);
		// }
	};

	return (
		<Modal
			isVisible={visible}
			style={{ margin: 0 }}
			animationOut={'zoomOutDown'}
			animationIn={'zoomInUp'}
		>
			<StatusBar barStyle={'light-content'} />
			<ImageViewer
				imageUrls={imageViewer}
				index={initIndex}
				backgroundColor="rgba(0,0,0,0.8)"
				enableSwipeDown
				onSwipeDown={() => setVisible(false)}
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
							<TouchableOpacity onPress={() => setVisible(false)}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Icon
										as={Ionicons}
										name={'chevron-back-outline'}
										size={7}
										color={'#fff'}
									/>
									{/*<Text style={{ marginLeft: 20, color: '#fff', fontWeight: 'bold' }}>{message?.u.name}</Text>*/}
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={{ padding: 8 }} onPress={handleDownload}>
								<Icon
									as={Ionicons}
									name={'cloud-download-outline'}
									size={7}
									color={'#fff'}
								/>
							</TouchableOpacity>
						</View>
					</View>
				)}
			/>
		</Modal>
	);
}

export default React.forwardRef(ImageViewerCustom);
