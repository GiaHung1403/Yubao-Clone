import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Alert,

	View,
	Text,
	ImageBackground,
	InteractionManager,
} from 'react-native';
import ml from '@react-native-firebase/ml';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';
import 'react-native-reanimated';

import RNQRGenerator from 'rn-qr-generator';
import { promptIdBack, promptIdFront, responseGPT } from '@utils/textScanGpt';
import { ScanScreenComponent } from '@components/ScanScreenComponent/ScanScreenComponent';
import { Camera } from 'react-native-vision-camera';
const optionsCamera = {
	cropping: true,
	compressImageQuality: 1,
	// width: 500,
	// height: 500,
	freeStyleCropEnabled: true,
	cropperAvoidEmptySpaceAroundImage: false,
	cropperChooseText: 'Choose',
	cropperCancelText: 'Cancel',
	includeBase64: true,
};
export function IDCardScanScreen(props: any) {
	// const camera = useRef<Camera>(null);

	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const { isFront } = props.route.params;
	const [photoPath, setPhotoPath] = useState('');
	const isFocused = useIsFocused();

	useEffect(() => {


		InteractionManager.runAfterInteractions(async () => {

			await Camera.requestCameraPermission();

		});
	}, []);

	useEffect(() => {

		const _processImage = async () => {

			try {
				const processed = await ml().cloudDocumentTextRecognizerProcessImage(
					photoPath,
				);

				const gptText = await responseGPT(
					isFront ? promptIdFront(processed.text) : promptIdBack(processed.text),
				);

				RNQRGenerator.detect({
					uri: photoPath, // local path of the image. Can be skipped if base64 is passed.
				})
					.then(response => {
						const { values } = response; // Array of detected QR code values. Empty if nothing found.
						// console.log('====================================');
						// console.log(values);
						// console.log('====================================');
						if (processed.text.toLowerCase().includes('identity')) {
							values.length !== 0
								? navigation.navigate('IDCardFormScreen', {
									result: processed.text,
									QRData: values,
									image: photoPath,
									isFront: isFront,
									imageUpdateFront: isFront
										? photoPath
										: '',
									imageUpdateBack: !isFront
										? photoPath
										: '',
									gptText,
								})
								: navigation.navigate('IDCardFormScreen', {
									result: processed.text,
									QRData: values,
									image: photoPath,
									isFront: isFront,
									imageUpdateFront: isFront
										? photoPath
										: '',
									imageUpdateBack: !isFront
										? photoPath
										: '',
									gptText,
								});
							// setImage(image.sourceURL || image.path)
						} else {
							navigation.navigate('IDCardFormScreen', {
								result: processed.text,
								QRData: values,
								image: photoPath,
								isFront: isFront,
								imageUpdateFront: isFront ? photoPath : '',
								imageUpdateBack: !isFront ? photoPath : '',
								gptText,
							});
							// setImage(image.sourceURL || image.path)
						}
					})
					.catch(error => { console.log('Cannot detect QR code in image', error), setPhotoPath(''); });

			}
			catch (err: any) {
				console.log(err.message);
				Alert.alert('Load Image Failed', 'Please Load Your Image Again');
				setPhotoPath('');
			}


		}

		if (photoPath)
			_processImage()


	}, [photoPath])



	useEffect(() => {
		if (isFocused) {

			let temp = async () => {
				let ImageScan = await ScanScreenComponent()
				if (ImageScan) {
					setPhotoPath(ImageScan[0])

				}
				else {
					navigation.goBack()
				}
			}
			temp()
		}
	}, [isFocused])

	if (!photoPath) {
		return <View style={{ flex: 1, backgroundColor: "black" }}>

		</View>;
	}

	return (<View style={{ flex: 1, backgroundColor: "black" }}>


		<ImageBackground
			style={{ flex: 1, zIndex: 6 }}
			source={{ uri: photoPath }}
			resizeMode="cover"
		>
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'rgba(0,0,0,0.5)',
				}}
			>
				<Text
					style={{
						color: 'white',
						fontSize: 30,
						fontWeight: 'bold',
						marginBottom: 10,
					}}
				>
					Analyzing Image
				</Text>
				<ActivityIndicator color={colors.primary} size={'large'} />
			</View>
		</ImageBackground>


	</View>
	);
}


/**
 *
	const _open_Gallrey = () => {
		setLoading(true);
		setActive(false)
		ImagePicker.openPicker(optionsCamera)
			.then((image: any) => {
				// _onTakePhoto(image);
				// console.log(image.path, '$$$$$          ');
				_processImage(image);
				setPhotoPath(image.path);

				// setFileUpload({ base64: image.data, type: 'jpg', name: fileName });
				// file_Type = 'jpg';
				// modalFileRef.current.onShowModal(false);
			})
			.catch(e => {
				setActive(true)
				setLoading(false);
			});
	};

	const _processImage = async image => {
		try {
			const processed = await ml().cloudDocumentTextRecognizerProcessImage(
				image.path || '',
			);

			const gptText = await responseGPT(
				isFront ? promptIdFront(processed.text) : promptIdBack(processed.text),
			);

			setLoading(false);
			setActive(false);
			setPhotoPath(image.sourceURL || image.path);

			RNQRGenerator.detect({
				uri: image.path, // local path of the image. Can be skipped if base64 is passed.
			})
				.then(response => {
					const { values } = response; // Array of detected QR code values. Empty if nothing found.
					// console.log('====================================');
					// console.log(values);
					// console.log('====================================');
					if (processed.text.toLowerCase().includes('identity')) {
						values.length !== 0
							? navigation.navigate('IDCardFormScreen', {
								result: processed.text,
								QRData: values,
								image: image.sourceURL || image.path,
								isFront: isFront,
								imageUpdateFront: isFront
									? image.sourceURL || image.path
									: '',
								imageUpdateBack: !isFront
									? image.sourceURL || image.path
									: '',
								gptText,
							})
							: navigation.navigate('IDCardFormScreen', {
								result: processed.text,
								QRData: values,
								image: image.sourceURL || image.path,
								isFront: isFront,
								imageUpdateFront: isFront
									? image.sourceURL || image.path
									: '',
								imageUpdateBack: !isFront
									? image.sourceURL || image.path
									: '',
								gptText,
							});
						// setImage(image.sourceURL || image.path)
					} else {
						navigation.navigate('IDCardFormScreen', {
							result: processed.text,
							QRData: values,
							image: image.sourceURL || image.path,
							isFront: isFront,
							imageUpdateFront: isFront ? image.sourceURL || image.path : '',
							imageUpdateBack: !isFront ? image.sourceURL || image.path : '',
							gptText,
						});
						// setImage(image.sourceURL || image.path)
					}
				})
				.catch(error => console.log('Cannot detect QR code in image', error));
		} catch (e: any) {
			Alert.alert('Error', e.message);
			setLoading(false);
		}
	};

	const _onTakePhoto = async image => {
		if (image) {
			setPhotoPath(image.path || '');
			setActive(false)
			setLoading(true);
			// const photo = await camera.current?.takePhoto({
			//  flash: 'off',
			//  skipMetadata: true,
			// });
			// setImage(image.path)

			_processImage(image);
		} else {
			setLoading(true);
			// const photo = await camera.current?.takePhoto({
			//  flash: 'off',
			//  skipMetadata: true,
			// });
			const options = { quality: 0.5, base64: true, skipProcessing: true };
			const photo = await camera.current.takePictureAsync(options);
			const source = photo.uri;
			// console.log(source)

			try {
				const processed = await ml().cloudDocumentTextRecognizerProcessImage(
					source || '',
				);

				setPhotoPath(source);
				setActive(false)
				setLoading(false);
				// console.log(processed);
				const gptText = await responseGPT(
					isFront
						? promptIdFront(processed.text)
						: promptIdBack(processed.text),
				);

				navigation.navigate('IDCardFormScreen', {
					result: processed.text,
					QRData: [],
					image: source,
					isFront: isFront,
					imageUpdateFront: isFront ? source : '',
					imageUpdateBack: !isFront ? source : '',
					gptText,
				});
				// setImage(source)
			} catch (e: any) {
				Alert.alert('Error', e.message);
				setLoading(false);
			}
			setActive(false)
		}
	};
 */