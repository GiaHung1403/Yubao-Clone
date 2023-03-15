import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, InteractionManager, SafeAreaView, View } from 'react-native';
import ml from '@react-native-firebase/ml';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';
import 'react-native-reanimated';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RNCamera } from 'react-native-camera';
import RNQRGenerator from 'rn-qr-generator';

import styles from './styles';

export function TakePhotoScreen(props: any) {
	// const camera = useRef<Camera>(null);
	let enableScan: boolean = true;
	const camera = useRef<any>();
	const navigation: any = useNavigation();
	const { colors } = useTheme();

	// const { isFront } = props.route.params;

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [hasPermission, setHasPermission] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isActive, setActive] = useState(true);
	const [isFront, setIsFront] = useState(false);
	const devices = useCameraDevices('wide-angle-camera');
	const device = devices.back;

	//  const [frameProcessor, barcodes] = useScanBarcodes(
	// 		[BarcodeFormat.QR_CODE],
	// 		{
	// 			checkInverted: true,
	// 		},
	// 	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
			const status = await Camera.requestCameraPermission();
			setHasPermission(status === 'authorized');
		});
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setActive(true);
		});

		return () => {
			unsubscribe;
		};
	}, [navigation]);

	const _onTakePhoto = async () => {
		setLoading(true);
		// const photo = await camera.current?.takePhoto({
		// 	flash: 'off',
		// 	skipMetadata: true,
		// });
		const options = { quality: 0.5, base64: true, skipProcessing: true };
		const photo = await camera.current.takePictureAsync(options);
		const source = photo.uri;
		try {
			// const processed = await ml().cloudDocumentTextRecognizerProcessImage(
			// 	source || '',
			// );
			setLoading(false);
			setActive(false);
			navigation.navigate('CheckinMap_PC', {
				image: source,
				base64 : photo.base64
			});
		} catch (e: any) {
			Alert.alert('Error', e.message);
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 99 }}>
				<SafeAreaView />
				<View
					style={{
						marginTop: 20,
						marginLeft: 30,
						flexWrap: 'wrap',
						flexDirection: 'row',
					}}
				>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							padding: 10,
							borderRadius: 30,
							backgroundColor: 'rgba(0,0,0,0.3)',
						}}
					>
						<Icon
							as={Ionicons}
							name={'chevron-back-outline'}
							size={6}
							color={'#fff'}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{hasPermission && doneLoadAnimated ? (
				<View
					style={{
						flex: 1,
						zIndex: 2,
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					}}
				>
					{/* <Camera
						ref={camera}
						style={StyleSheet.absoluteFill}
						device={device as CameraDevice}
						isActive={isActive}
						photo={true}
						// frameProcessor={frameProcessor}
						frameProcessorFps={5}
					/> */}
					<RNCamera
						ref={ref => {
							camera.current = ref;
						}}
						style={{ flex: 1 }}
						type={
							isFront
								? RNCamera.Constants.Type.front
								: RNCamera.Constants.Type.back
						}
						flashMode={RNCamera.Constants.FlashMode.off}
						androidCameraPermissionOptions={{
							title: 'Permission to use camera',
							message: 'We need your permission to use your camera',
							buttonPositive: 'Ok',
							buttonNegative: 'Cancel',
						}}
						// onBarCodeRead={text => _onQRDetect(text.data)}
					/>

					<SafeAreaView
						style={{
							flexDirection: 'row',
							position: 'absolute',
							bottom: 80,
							left: 8,
							right: 8,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<TouchableOpacity
							disabled={loading}
							style={{}}
							onPress={_onTakePhoto}
						>
							<View
								style={{
									width: 70,
									height: 70,
									borderRadius: 35,
									borderWidth: 4,
									borderColor: '#fff',
									backgroundColor: loading ? 'transparent' : colors.primary,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								{loading && (
									<ActivityIndicator color={colors.primary} size={'small'} />
								)}
							</View>
						</TouchableOpacity>
					</SafeAreaView>

					<SafeAreaView
						style={{
							flexDirection: 'row',
							position: 'absolute',
							bottom: 92,
							left: 280,
							right: 8,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<TouchableOpacity
							onPress={() => setIsFront(!isFront)}
							style={{
								alignItems: 'center',
								padding: 10,
								justifyContent: 'center',
								borderRadius: 30,
								backgroundColor: 'rgba(0,0,0,0.3)',
							}}
						>
							<Icon
								as={Ionicons}
								name={'camera-reverse-outline'}
								size={6}
								color={'#fff'}
							/>
						</TouchableOpacity>
					</SafeAreaView>
				</View>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
