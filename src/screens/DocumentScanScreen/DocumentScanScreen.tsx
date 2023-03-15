import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {

	Animated, InteractionManager,

} from 'react-native';


import { ScanScreenComponent } from '@components/ScanScreenComponent/ScanScreenComponent';

import { useIsFocused } from '@react-navigation/native';
import { Camera } from 'react-native-vision-camera';


export function DocumentScanScreen(props?: any) {

	const isFocused = useIsFocused();
	const navigation: any = useNavigation();

	useEffect(() => {


		InteractionManager.runAfterInteractions(async () => {

			await Camera.requestCameraPermission();

		});
	}, []);
	useEffect(() => {
		if (isFocused) {

			let temp = async () => {
				let ImageScan = await ScanScreenComponent()
				console.log(ImageScan)
				if (ImageScan) {

					navigation.navigate('DocumentReview', {
						listImage: ImageScan
					});
				}
				else {
					// Alert.alert("Document Scan Failed", "Please Try Again")
					navigation.navigate("BottomTabHome")
				}
			}
			temp()
		}
	}, [isFocused])


	return <>

	</>

}
// export function DocumentScanScreen(props: IProps) {
// 	const navigation: any = useNavigation();
// 	const { cameraIsOn } = props;
// 	const { listImageModified } = props.route.params;

// 	const camera: any = React.createRef();

// 	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
// 	const [isMultiTasking, setIsMultiTasking] = useState(false);
// 	const [loadingCamera, setLoadingCamera] = useState(true);
// 	const [flashEnabled, setFlashEnabled] = useState(false);
// 	const [showScannerView, setShowScannerView] = useState(false);
// 	const [detectedRectangle, setDetectedRectangle] = useState<any>(false);
// 	const [processingImage, setProcessingImage] = useState(false);
// 	const [takingPicture, setTakingPicture] = useState(false);
// 	const [hideSkip, setHideSkip] = useState(true);
// 	const [filterId, setFilterId] = useState(Filters.PLATFORM_DEFAULT_FILTER_ID);
// 	const [device, setDevice] = useState({
// 		initialized: true,
// 		hasCamera: 1,
// 		permissionToUseCamera: 1,
// 		flashIsAvailable: 1,
// 		previewHeightPercent: 1,
// 		previewWidthPercent: 1,
// 	});
// 	const [listImage, setListImage] = useState<string[]>([]);

// 	useEffect(() => {
// 		InteractionManager.runAfterInteractions(() => {
// 			setDoneLoadAnimated(true);
// 		});
// 	}, []);

// 	useEffect(() => {
// 		if (listImageModified) {
// 			setListImage(listImageModified);
// 		}
// 	}, [listImageModified]);

// 	useEffect(() => {
// 		if (doneLoadAnimated) {
// 			if (isMultiTasking) {
// 				return turnOffCamera(true);
// 			} else {
// 				turnOnCamera();
// 			}
// 			if (device.initialized) {
// 				if (!device.hasCamera) {
// 					return turnOffCamera();
// 				}
// 				if (!device.permissionToUseCamera) {
// 					return turnOffCamera();
// 				}
// 			}

// 			if (cameraIsOn && !showScannerView) {
// 				return turnOnCamera();
// 			}

// 			if (!cameraIsOn && showScannerView) {
// 				return turnOffCamera(true);
// 			}

// 			if (cameraIsOn === undefined) {
// 				return turnOnCamera();
// 			}
// 		}
// 		return () => clearTimeout(imageProcessorTimeout);
// 	}, [doneLoadAnimated, isMultiTasking, device]);

// 	// On some android devices, the aspect ratio of the preview is different than
// 	// the screen size. This leads to distorted camera previews. This allows for correcting that.
// 	const getPreviewSize = () => {
// 		const dimensions = Dimensions.get('window');
// 		// We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
// 		const heightMargin =
// 			((1 - device.previewHeightPercent) * dimensions.height) / 2;
// 		const widthMargin =
// 			((1 - device.previewWidthPercent) * dimensions.width) / 2;
// 		if (dimensions.height > dimensions.width) {
// 			// Portrait
// 			return {
// 				height: device.previewHeightPercent,
// 				width: device.previewWidthPercent,
// 				marginTop: heightMargin,
// 				marginLeft: widthMargin,
// 			};
// 		}

// 		// Landscape
// 		return {
// 			width: device.previewHeightPercent,
// 			height: device.previewWidthPercent,
// 			marginTop: widthMargin,
// 			marginLeft: heightMargin,
// 		};
// 	};

// 	// Determine why the camera is disabled.
// 	const getCameraDisabledMessage = () => {
// 		if (isMultiTasking) {
// 			return 'Camera is not allowed in multi tasking mode.';
// 		}

// 		if (device.initialized) {
// 			if (!device.hasCamera) {
// 				return 'Could not find a camera on the device.';
// 			}
// 			if (!device.permissionToUseCamera) {
// 				return 'Permission to use camera has not been granted.';
// 			}
// 		}

// 		return 'Failed to set up the camera.';
// 	};

// 	// Hides the camera view. If the camera view was shown and onDeviceSetup was called,
// 	// but no camera was found, it will not uninitialize the camera state.
// 	const turnOffCamera = (shouldUninitializeCamera = false) => {
// 		if (shouldUninitializeCamera && device.initialized) {
// 			setShowScannerView(false);
// 			setDevice(deviceOld => {
// 				return { ...deviceOld, initialized: false };
// 			});
// 		} else if (showScannerView) {
// 			setShowScannerView(false);
// 		}
// 	};

// 	// Will show the camera view which will setup the camera and start it.
// 	// Expect the onDeviceSetup callback to be called
// 	const turnOnCamera = () => {
// 		if (!showScannerView) {
// 			setShowScannerView(true);
// 			setLoadingCamera(true);
// 		}
// 	};

// 	// The picture was captured but still needs to be processed.
// 	const onPictureTaken = event => {
// 		setTakingPicture(false);
// 	};

// 	// The picture was taken and cached. You can now go on to using it.
// 	const onPictureProcessed = event => {
// 		setTakingPicture(false);
// 		setProcessingImage(false);
// 		setListImage(list => [...list, event.croppedImage]);
// 	};

// 	// Called after the device gets setup. This lets you know some platform specifics
// 	// like if the device has a camera or flash, or even if you have permission to use the
// 	// camera. It also includes the aspect ratio correction of the preview
// 	const onDeviceSetup = deviceDetails => {
// 		const {
// 			hasCamera,
// 			permissionToUseCamera,
// 			flashIsAvailable,
// 			previewHeightPercent,
// 			previewWidthPercent,
// 		} = deviceDetails;
// 		setLoadingCamera(false);
// 		// setDevice({
// 		//   initialized: true,
// 		//   hasCamera,
// 		//   permissionToUseCamera,
// 		//   flashIsAvailable,
// 		//   previewHeightPercent: previewHeightPercent || 1,
// 		//   previewWidthPercent: previewWidthPercent || 1,
// 		// });
// 	};

// 	// Flashes the screen on capture
// 	const triggerSnapAnimation = () => {
// 		Animated.sequence([
// 			Animated.timing(overlayFlashOpacity, {
// 				toValue: 0.2,
// 				duration: 100,
// 				useNativeDriver: false,
// 			}),
// 			Animated.timing(overlayFlashOpacity, {
// 				toValue: 0,
// 				duration: 50,
// 				useNativeDriver: false,
// 			}),
// 			Animated.timing(overlayFlashOpacity, {
// 				toValue: 0.6,
// 				delay: 100,
// 				duration: 120,
// 				useNativeDriver: false,
// 			}),
// 			Animated.timing(overlayFlashOpacity, {
// 				toValue: 0,
// 				duration: 90,
// 				useNativeDriver: false,
// 			}),
// 		]).start();
// 	};

// 	// Capture the current frame/rectangle. Triggers the flash animation and shows a
// 	// loading/processing state. Will not take another picture if already taking a picture.
// 	const capture = () => {
// 		if (takingPicture) {
// 			return;
// 		}
// 		if (processingImage) {
// 			return;
// 		}
// 		setTakingPicture(true);
// 		setProcessingImage(true);
// 		camera.current.capture();
// 		triggerSnapAnimation();

// 		// If capture failed, allow for additional captures
// 		imageProcessorTimeout = setTimeout(() => {
// 			if (takingPicture) {
// 				setTakingPicture(false);
// 			}
// 		}, 100);
// 	};

// 	// Renders the flashlight button. Only shown if the device has a flashlight.
// 	const renderFlashControl = () => {
// 		if (!device.flashIsAvailable) {
// 			return null;
// 		}
// 		return (
// 			<TouchableOpacity
// 				style={[
// 					styles.flashControl,
// 					{ backgroundColor: flashEnabled ? '#FFFFFF80' : '#00000080' },
// 				]}
// 				activeOpacity={0.8}
// 				onPress={() => setFlashEnabled(statusOld => !statusOld)}
// 			>
// 				<Icon
// 					name="ios-flashlight"
// 					style={[
// 						styles.buttonIcon,
// 						{ fontSize: 28, color: flashEnabled ? '#333' : '#FFF' },
// 					]}
// 				/>
// 			</TouchableOpacity>
// 		);
// 	};

// 	const renderCameraControls = () => {
// 		const dimensions = Dimensions.get('window');
// 		const aspectRatio = dimensions.height / dimensions.width;
// 		const isPhone = aspectRatio > 1.6;
// 		const cameraIsDisabled = takingPicture || processingImage;
// 		const disabledStyle = { opacity: cameraIsDisabled ? 0.8 : 1 };
// 		if (!isPhone) {
// 			if (dimensions.height < 500) {
// 				return (
// 					<View style={styles.buttonContainer}>
// 						<View
// 							style={[
// 								styles.buttonActionGroup,
// 								{
// 									flexDirection: 'row',
// 									alignItems: 'flex-end',
// 									marginBottom: 28,
// 								},
// 							]}
// 						>
// 							{renderFlashControl()}
// 							<ScannerFilters
// 								filterId={filterId}
// 								onFilterIdChange={id => setFilterId(id)}
// 							/>
// 							{hideSkip ? null : (
// 								<View style={[styles.buttonGroup, { marginLeft: 8 }]}>
// 									<TouchableOpacity
// 										style={[styles.button, disabledStyle]}
// 										onPress={() => {
// 											if (cameraIsDisabled) {
// 												return null;
// 											}
// 											Alert.alert('Notice', 'Camera Is Disabled!');
// 										}}
// 										activeOpacity={0.8}
// 									>
// 										<Icon
// 											name="md-play-skip-forward-circle"
// 											size={40}
// 											color="white"
// 											style={styles.buttonIcon}
// 										/>
// 										<Text style={styles.buttonText}>Skip</Text>
// 									</TouchableOpacity>
// 								</View>
// 							)}
// 						</View>
// 						<View style={[styles.cameraOutline, disabledStyle]}>
// 							<TouchableOpacity
// 								activeOpacity={0.8}
// 								style={styles.cameraButton}
// 								onPress={capture}
// 							/>
// 						</View>
// 					</View>
// 				);
// 			}
// 			return (
// 				<View style={styles.buttonContainer}>
// 					<View
// 						style={[
// 							styles.buttonActionGroup,
// 							{ justifyContent: 'flex-end', marginBottom: 20 },
// 						]}
// 					>
// 						{renderFlashControl()}
// 						<ScannerFilters
// 							filterId={filterId}
// 							onFilterIdChange={id => setFilterId(id)}
// 						/>
// 					</View>
// 					<View style={[styles.cameraOutline, disabledStyle]}>
// 						<TouchableOpacity
// 							activeOpacity={0.8}
// 							style={styles.cameraButton}
// 							onPress={capture}
// 						/>
// 					</View>
// 					<View style={[styles.buttonActionGroup, { marginTop: 28 }]}>
// 						<View style={styles.buttonGroup}>
// 							{hideSkip ? null : (
// 								<TouchableOpacity
// 									style={[styles.button, disabledStyle]}
// 									onPress={() => {
// 										if (cameraIsDisabled) {
// 											return null;
// 										}
// 										Alert.alert('Notice', 'Skip!');
// 									}}
// 									activeOpacity={0.8}
// 								>
// 									<Icon
// 										name="md-play-forward-circle"
// 										size={40}
// 										color="white"
// 										style={styles.buttonIcon}
// 									/>
// 									<Text style={styles.buttonText}>Skip</Text>
// 								</TouchableOpacity>
// 							)}
// 						</View>
// 					</View>
// 				</View>
// 			);
// 		}

// 		return (
// 			<>
// 				<View style={styles.buttonBottomContainer}>
// 					<View style={[styles.buttonGroup, { overflow: 'hidden' }]}>
// 						<TouchableOpacity
// 							style={[styles.button]}
// 							onPress={() => {
// 								navigation.navigate('DocumentReview', {
// 									listImage,
// 								});
// 							}}
// 							activeOpacity={0.8}
// 						>
// 							<Image
// 								source={{ uri: listImage[listImage.length-1] }}
// 								resizeMode="cover"
// 								style={{ width: '100%', height: '100%' }}
// 							/>
// 						</TouchableOpacity>
// 					</View>
// 					<View style={[styles.cameraOutline, disabledStyle]}>
// 						<TouchableOpacity
// 							activeOpacity={0.8}
// 							style={styles.cameraButton}
// 							onPress={capture}
// 						/>
// 					</View>
// 					<View>
// 						<View
// 							style={[
// 								styles.buttonActionGroup,
// 								{
// 									justifyContent: 'flex-end',
// 									marginBottom: hideSkip ? 0 : 16,
// 								},
// 							]}
// 						>
// 							<ScannerFilters
// 								filterId={filterId}
// 								onFilterIdChange={id => setFilterId(id)}
// 							/>
// 							{renderFlashControl()}
// 						</View>
// 						<View style={styles.buttonGroup}>
// 							{hideSkip ? null : (
// 								<TouchableOpacity
// 									style={[styles.button, disabledStyle]}
// 									onPress={() => {
// 										if (cameraIsDisabled) {
// 											return null;
// 										}
// 										Alert.alert('Notice', 'Skip!');
// 									}}
// 									activeOpacity={0.8}
// 								>
// 									<Icon
// 										name="md-play-forward-circle"
// 										size={40}
// 										color="white"
// 										style={styles.buttonIcon}
// 									/>
// 									<Text style={styles.buttonText}>Skip</Text>
// 								</TouchableOpacity>
// 							)}
// 						</View>
// 					</View>
// 				</View>
// 			</>
// 		);
// 	};

// 	// Renders the camera controls or a loading/processing state
// 	const renderCameraOverlay = () => {
// 		let loadingState: any = null;
// 		if (loadingCamera) {
// 			loadingState = (
// 				<View style={styles.overlay}>
// 					<View style={styles.loadingContainer}>
// 						<ActivityIndicator color="white" />
// 						<Text style={styles.loadingCameraMessage}>Loading Camera</Text>
// 					</View>
// 				</View>
// 			);
// 		} else if (processingImage) {
// 			loadingState = (
// 				<View style={styles.overlay}>
// 					<View style={styles.loadingContainer}>
// 						<View style={styles.processingContainer}>
// 							<ActivityIndicator color="#333333" size="large" />
// 							<Text style={{ color: '#333333', fontSize: 30, marginTop: 10 }}>
// 								Processing
// 							</Text>
// 						</View>
// 					</View>
// 				</View>
// 			);
// 		}

// 		return (
// 			<>
// 				{loadingState}
// 				<SafeAreaView style={[styles.overlay]}>
// 					{renderCameraControls()}
// 				</SafeAreaView>
// 			</>
// 		);
// 	};

// 	const renderCameraView = () => {
// 		if (showScannerView) {
// 			const previewSize: IPreviewSize = getPreviewSize();

// 			let rectangleOverlay: any = null;
// 			if (!loadingCamera && !processingImage) {
// 				rectangleOverlay = (
// 					<RectangleOverlay
// 						detectedRectangle={detectedRectangle}
// 						previewRatio={previewSize}
// 						backgroundColor="rgba(255,181,6, 0.2)"
// 						borderColor="rgb(255,181,6)"
// 						borderWidth={4}
// 						// == These let you auto capture and change the overlay style on detection ==
// 						// detectedBackgroundColor="rgba(255,181,6, 0.3)"
// 						// detectedBorderWidth={6}
// 						// detectedBorderColor="rgb(255,218,124)"
// 						onDetectedCapture={capture}
// 						// allowDetection
// 					/>
// 				);
// 			}

// 			// NOTE: I set the background color on here because for some reason the view doesn't line up correctly otherwise. It's a weird quirk I noticed.
// 			return (
// 				<View
// 					style={{
// 						backgroundColor: 'rgba(0, 0, 0, 0)',
// 						position: 'relative',
// 						marginTop: previewSize.marginTop,
// 						marginLeft: previewSize.marginLeft,
// 						height: `${previewSize.height * 100}%`,
// 						width: `${previewSize.width * 100}%`,
// 					}}
// 				>
// 					<Scanner
// 						onPictureTaken={onPictureTaken}
// 						onPictureProcessed={onPictureProcessed}
// 						enableTorch={true}
// 						filterId={filterId}
// 						ref={camera}
// 						capturedQuality={1}
// 						onRectangleDetected={data => {
// 							if (data.detectedRectangle) {
// 								setDetectedRectangle(data.detectedRectangle);
// 							}
// 						}}
// 						onDeviceSetup={onDeviceSetup}
// 						onTorchChanged={({ enabled }) => setFlashEnabled(enabled)}
// 						style={styles.scanner}
// 					/>
// 					{rectangleOverlay}
// 					<Animated.View
// 						style={{
// 							...styles.overlay,
// 							backgroundColor: 'white',
// 							opacity: overlayFlashOpacity,
// 						}}
// 					/>
// 					{renderCameraOverlay()}
// 				</View>
// 			);
// 		}

// 		let message: any = null;
// 		if (loadingCamera) {
// 			message = (
// 				<View style={styles.overlay}>
// 					<View style={styles.loadingContainer}>
// 						<ActivityIndicator color="white" />
// 						<Text style={styles.loadingCameraMessage}>Loading Camera</Text>
// 					</View>
// 				</View>
// 			);
// 		} else {
// 			message = (
// 				<Text style={styles.cameraNotAvailableText}>
// 					{getCameraDisabledMessage()}
// 				</Text>
// 			);
// 		}

// 		return (
// 			<View style={styles.cameraNotAvailableContainer}>
// 				{message}
// 				<View style={styles.buttonBottomContainer}>
// 					<View style={styles.buttonGroup}>
// 						<TouchableOpacity
// 							style={styles.button}
// 							onPress={() => Alert.alert('Notice', 'Cancel!')}
// 							activeOpacity={0.8}
// 						>
// 							<Icon
// 								name="ios-close-circle"
// 								size={40}
// 								style={styles.buttonIcon}
// 							/>
// 							<Text style={styles.buttonText}>Cancel</Text>
// 						</TouchableOpacity>
// 					</View>
// 					<View style={styles.buttonGroup}>
// 						{hideSkip ? null : (
// 							<TouchableOpacity
// 								style={[styles.button, { marginTop: 8 }]}
// 								onPress={() => Alert.alert('Notice', 'Skip press!')}
// 								activeOpacity={0.8}
// 							>
// 								<Icon
// 									name="md-play-forward-circle"
// 									size={40}
// 									color="white"
// 									style={styles.buttonIcon}
// 								/>
// 								<Text style={styles.buttonText}>Skip</Text>
// 							</TouchableOpacity>
// 						)}
// 					</View>
// 				</View>
// 			</View>
// 		);
// 	};

// 	return (
// 		<View
// 			style={styles.container}
// 			onLayout={event => {
// 				// This is used to detect multi tasking mode on iOS/iPad
// 				// Camera use is not allowed
// 				if (Platform.OS === 'ios') {
// 					const screenWidth = Dimensions.get('screen').width;
// 					const isMultiTaskingNew =
// 						Math.round(event.nativeEvent.layout.width) <
// 						Math.round(screenWidth);

// 					if (isMultiTaskingNew) {
// 						setIsMultiTasking(true);
// 						setLoadingCamera(false);
// 					} else {
// 						setIsMultiTasking(false);
// 					}
// 				}
// 			}}
// 		>
// 			<StatusBar backgroundColor="black" barStyle="light-content" />

// 			<SafeAreaView style={{ zIndex: 99, position: 'absolute' }}>
// 				<TouchableOpacity
// 					onPress={() => navigation.goBack()}
// 					style={{
// 						top:
// 							Platform.OS === 'android'
// 								? (StatusBar.currentHeight || 0) + 10
// 								: 10,
// 						left: 16,
// 						flexDirection: 'row',
// 						alignItems: 'center',
// 						justifyContent: 'center',
// 						height: 40,
// 						width: 40,
// 						borderRadius: 30,
// 						backgroundColor: 'rgba(0,0,0,0.3)',
// 					}}
// 				>
// 					<Image
// 						source={IC_BACK}
// 						resizeMode="contain"
// 						style={{
// 							tintColor: '#fff',
// 							width: 16,
// 							height: 16,
// 						}}
// 					/>
// 				</TouchableOpacity>
// 			</SafeAreaView>
// 			{doneLoadAnimated ? (
// 				renderCameraView()
// 			) : (
// 				<View
// 					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
// 				>
// 					<ActivityIndicator />
// 				</View>
// 			)}
// 		</View>
// 	);
// }
