import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
	Alert,
	Image,
	InteractionManager,
	Linking,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, useTheme } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { getDistance } from 'geolib';

import { IUserSystem } from '@models/types';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { Icon } from 'native-base';
import Color from '@config/Color';
import { insertCheckin } from '@data/api';
import { useSelector } from 'react-redux';
import { checkBiometryAuth, isBiometrySupported } from '@utils/BiometryAuth';
import {
	CameraDevice,
	useCameraDevices,
	Camera,
} from 'react-native-vision-camera';
import { StyleSheet } from 'react-native';
import ml from '@react-native-firebase/ml';
import PickerCustomComponent from '@components/PickerCustomComponent';

import Header from '@components/Header';
import { flex, justifyContent } from 'styled-system';
import CheckBoxCustomComponent from '@components/CheckBoxCustomComponent/CheckBoxCustomComponent';
import axios from 'axios';
import ImageViewerCustom from '@components/ImageViewerCustom';
import { GOOGLE_API_KEY } from '@data/Constants';
import moment from 'moment';
const IC_BACK = require('@assets/icons/ic_back.png');
const IC_LOCAITON = require('@assets/icons/ic_marker.png');
import { uploadFile } from '@data/api/api_consultation';
import { useEvent } from 'react-native-reanimated';

const listType = [
	{ label: 'Check In', value: '0' },
	{ label: 'Check Out', value: '1' },
];

export function CheckinMap_PC(props: any) {
	const mapRef: any = useRef<any>(null);
	const makerRefs: any = [];
	const navigation: any = useNavigation();
	const { image, base64 } = props.route.params;

	const devices = useCameraDevices('wide-angle-camera');
	const device = devices.back;
	const camera = useRef<Camera>(null);
	const [isActive, setActive] = useState(true);
	const [loading, setLoading] = useState(false);

	const imageViewerRef = useRef<any>();
	const [imageUpload, setImageUpload] = useState(image);
	// const [chooseType, setChooseType] = useState<any>('1');

	const { colors } = useTheme();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [currentLocation, setCurrentLocation] = useState({
		latitude: 1,
		longitude: 1,
	});
	const [locationAddress, setLocationAddress] = useState<string>('');
	const [colorFillCircle, setColorFillCircle] = useState<string | undefined>(
		undefined,
	);
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const status = await Camera.requestCameraPermission();
			setHasPermission(status === 'authorized');
			get_Locaiton();
		});
	}, []);

	useEffect(() => {
		image !== undefined ? setImageUpload(image) : null;
	}, [image]);

	const getAddress = async () => {
		if (currentLocation.latitude !== 1 && currentLocation.longitude !== 1) {
			try {
				const responseJson: any = await axios.get(
					'https://api.geoapify.com/v1/geocode/reverse',
					{
						params: {
							lat: currentLocation.latitude,
							lon: currentLocation.longitude,
							format: 'json',
							apiKey: 'e40ca074c20b48eea5774e1b816964e3',
						},
					},
				);

				// console.log(responseJson.data.results[0].formatted);
				const address = responseJson.data.results[0].formatted;
				setDoneLoadAnimated(true);
				setLocationAddress(address);
				// return address;
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		getAddress();
		// setLoading(true)
	}, [currentLocation]);

	const get_Locaiton = () => {
		try {
			Geolocation.getCurrentPosition(
				position => {
					setCurrentLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
					moveCameraToLocation(position.coords);
				},
				error => Alert.alert('Error', error.message),
				Platform.OS === 'ios'
					? { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
					: {},
			);
			setColorFillCircle('rgba(223, 202, 232,0.6)');
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	const moveCameraToLocation = itemLocation => {
		mapRef?.current?.animateCamera(
			{
				center: itemLocation,

				// pitch: 1000,
				// heading: number,

				// Only on iOS MapKit, in meters. The property is ignored by Google Maps.
				altitude: 2000,

				// Only when using Google Maps.
			},
			{
				duration: 1000,
			},
		);
	};

	const _onPressCheckin = async () => {
		try {
			const type = (await isBiometrySupported()) as string;
			if (type) {
				await checkBiometryAuth({
					reason: `Checkin/out`,
				});
			}
			const fileName = `${dataUserSystem.EMP_NO}_${moment(new Date()).format(
				'DDMMYY',
			)}`;

			const data: any = await insertCheckin({
				User_ID: dataUserSystem.EMP_NO,
				location_X: currentLocation.latitude,
				location_Y: currentLocation.longitude,
				img_src: `/PM_DOC/APP_ATT/${fileName}.png`,
			});
			console.log(data);

			if (data?.auto_Id !== null) {
				await axios.post('http://yubao.chailease.com.vn/upload/upload_file', {
					imageBase64: base64,
					fileName,
					type: 'png',
				});

				await uploadFile({
					file_name: fileName,
					From_Folder: `export/APP/CF/${fileName}.png`,
					To_Folder: `PM_DOC/APP_ATT/`,
					type_file: 'png',
				});

				Alert.alert('Success!', 'Checkin success!');
			} else {
				Alert.alert('Fail!', 'You has data in system already!');
			}

			setTimeout(() => navigation.goBack(), 300);
		} catch (error: any) {
			Alert.alert('Error!', error.message);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle="dark-content" />

			<SafeAreaView
				style={{
					zIndex: 99,
					position: 'absolute',
					left: 0,
					right: 0,
					top: Platform.OS === 'ios' ? 0 : 50,
				}}
			>
				<View></View>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						bottom: 0,
						left: 20,
						right: 0,
						top: 0,
						borderRadius: 20,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						height: 40,
						width: 40,
						backgroundColor: 'rgba(0,0,0,0.3)',
					}}
				>
					<Image
						source={IC_BACK}
						resizeMode="contain"
						style={{
							tintColor: '#fff',
							width: 16,
							height: 16,
						}}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => get_Locaiton()}
					style={{
						alignSelf: 'flex-end',
						// top : -37,
						bottom: 37,
						right: 20,
						borderRadius: 20,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						height: 40,
						width: 40,
						backgroundColor: 'rgba(0,0,0,0.3)',
					}}
				>
					<Image
						source={IC_LOCAITON}
						resizeMode="contain"
						style={{
							tintColor: '#fff',
							width: 16,
							height: 16,
						}}
					/>
				</TouchableOpacity>
			</SafeAreaView>

			<SafeAreaView
				style={{
					zIndex: 99,
					position: 'absolute',
					left: 8,
					right: 8,
					bottom: 50,
				}}
			>
				<Card
					style={{
						height: 250,
						borderRadius: 15,
						maxHeight: 400,
					}}
					elevation={5}
					mode={'elevated'}
				>
					{doneLoadAnimated ? (
						<View style={{ flex: 1 }}>
							<View style={{ flex: 3, flexDirection: 'row' }}>
								<View
									style={{ flex: 2, justifyContent: 'center', paddingTop: 25 }}
								>
									{/* <View style={{ flex: 1, marginTop: 20, marginLeft: 10 }}>
								<CheckBoxCustomComponent
									title={'Type of Checking'}
									listData={listType}
									value={chooseType}
									setValue={value => setChooseType(value)}
								/>
							</View> */}
									<View
										style={{
											// flex : 1,
											justifyContent: 'flex-start',
											marginTop: 20,
										}}
									>
										<View
											style={{
												paddingTop: 10,
												flexDirection: 'row',
												marginTop: -10,
											}}
										>
											<Icon
												as={Ionicons}
												name={'locate-outline'}
												size={6}
												color={colors.primary}
												style={{ alignSelf: 'center', marginHorizontal: 5 }}
											/>
											<Text
												style={{
													alignContent: 'center',
													fontWeight: '500',
													flex: 1,
												}}
											>
												{locationAddress}
											</Text>
										</View>
									</View>
									<View
										style={{
											flex: 1,
											justifyContent: 'flex-start',
											marginTop: 10,
										}}
									>
										<View
											style={{
												flexDirection: 'row',
												// marginTop: -35,
												justifyContent: 'center',
											}}
										>
											<Icon
												as={Ionicons}
												name={'person-circle-outline'}
												size={6}
												color={colors.primary}
												style={{ alignSelf: 'center', marginHorizontal: 5 }}
											/>
											<Text
												style={{
													alignSelf: 'center',
													fontWeight: '500',
													flex: 1,
												}}
											>
												{dataUserSystem.EMP_NM}
											</Text>
										</View>
									</View>
								</View>

								<Card
									style={{
										height: 120,
										width: 120,
										borderRadius: 10,
										alignSelf: 'center',
										marginRight: 15,
										flex: 1,
									}}
									elevation={2}
									// mode={'outlined'}
								>
									<TouchableOpacity
										style={{
											alignItems: 'center',
											width: '100%',
											position: 'relative',
											justifyContent: 'center',
											flex: 1,
										}}
										onPress={() => {
											imageUpload
												? imageViewerRef.current.onShowViewer(
														[{ url: imageUpload }],
														0,
												  )
												: navigation.navigate('TakePhotoScreen');
											// ImagePicker.openCamera(optionsCamera).then((image: any) => {
											// 		setImageFrontUpdate(image.path);
											//   });
										}}
									>
										<Image
											source={
												imageUpload
													? {
															uri: imageUpload,
													  }
													: require('@assets/camera_Icon_200.png')
											}
											resizeMode={imageUpload ? 'cover' : 'contain'}
											style={{
												width: '100%',
												height: 70,
												flex: imageUpload ? 1 : 0,
												borderRadius: 10,
											}}
										/>

										{imageUpload && (
											<TouchableOpacity
												style={{ position: 'absolute', top: -10, right: -10 }}
												onPress={() => setImageUpload(undefined)}
											>
												<View>
													<Icon
														as={Ionicons}
														name={'close-circle-outline'}
														size={7}
														color={'red.500'}
													/>
												</View>
											</TouchableOpacity>
										)}
									</TouchableOpacity>
								</Card>
							</View>
							<View style={{ flex: 1 }}>
								<Button
									disabled={!imageUpload ? true : false}
									mode={'contained'}
									uppercase={false}
									loading={loading}
									style={{
										alignSelf: 'center',
										marginRight: 8,
										backgroundColor: !imageUpload ? '#d3d3d3' : colors.primary,
										// backgroundColor : colors.primary
									}}
									onPress={() => _onPressCheckin()}
								>
									{loading ? 'Loading...' : 'Upload'}
								</Button>
							</View>
						</View>
					) : (
						<LoadingFullScreen />
					)}
				</Card>
			</SafeAreaView>
			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<MapView
						ref={mapRef}
						style={{ flex: 1 }}
						provider={PROVIDER_GOOGLE}
						showsUserLocation
						// showsMyLocationButton
						followsUserLocation
						initialRegion={{
							latitude: currentLocation.latitude,
							longitude: currentLocation.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01,
						}}
					></MapView>
				</View>
			) : (
				<LoadingFullScreen />
			)}
			<ImageViewerCustom
				ref={ref => {
					imageViewerRef.current = ref;
				}}
			/>
		</View>
	);
}
