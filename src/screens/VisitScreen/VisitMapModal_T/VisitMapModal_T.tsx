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
import MapView, {
	Marker,
	PROVIDER_GOOGLE,
	Circle,
	LatLng,
} from 'react-native-maps';
import { getDistance } from 'geolib';

import { IVisit_Trading } from '@models/types';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { Icon } from 'native-base';
import Color from '@config/Color';
import { getAddressVisit_T, insertCheckinVisit_T } from '@data/api';
import axios from 'axios';
import { openSettings, PERMISSIONS, request } from 'react-native-permissions';
const IC_BACK = require('@assets/icons/ic_back.png');

interface IProps {
	visitInfo: IVisit_Trading;
}

export function VisitMapModal_T(props: any) {
	const mapRef: any = useRef<any>(null);
	const makerRefs: any = [];
	const navigation: any = useNavigation();

	const { colors } = useTheme();
	const { visitInfo }: IProps = props.route.params;

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [currentLocation, setCurrentLocation] = useState<any>();
	const [placeAddress, setPlaceAddress] = useState<string>('');
	const [placeLocation, setPlaceLocation] = useState<any>({
		latitude: 10.784281108329015,
		longitude: 106.70366807305761,
	});
	const [colorFillCircle, setColorFillCircle] = useState<string | undefined>(
		undefined,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			try {
				await getCurrentLocation();
				setColorFillCircle('rgba(223, 202, 232,0.6)');

				const responseAddress: any[] = (await getAddressVisit_T({
					leseID: visitInfo?.lese_ID,
				})) as any[];
				if (responseAddress.length <= 1) {
					Alert.alert(
						'Warning',
						'Address customer is not available, please keying address in Customer Information!',
					);
					setDoneLoadAnimated(true);
					return;
				}

				const listAddressVisitConvert: any[] = responseAddress
					.filter(item => item.addrName !== 'Choose')
					.map(item => item.addrName);

				if (listAddressVisitConvert.length === 1) {
					setPlaceAddress(listAddressVisitConvert[0]);
					const latLngPlace = await getPlaceLatLng(listAddressVisitConvert[0]);
					setPlaceLocation(latLngPlace);
					setDoneLoadAnimated(true);
				} else {
					let placeAddressLocation = listAddressVisitConvert[0];
					let latLngLocation = await getPlaceLatLng(listAddressVisitConvert[0]);
					listAddressVisitConvert.shift();

					listAddressVisitConvert.forEach(async (item, index) => {
						const latLngLocationNew = await getPlaceLatLng(item);
						if (
							getDistanceFromLocation(latLngLocation) >
							getDistanceFromLocation(latLngLocationNew)
						) {
							placeAddressLocation = item;
							latLngLocation = latLngLocationNew;
						}
					});

					setPlaceAddress(placeAddressLocation);
					setPlaceLocation(latLngLocation);
					setDoneLoadAnimated(true);
				}
			} catch (e: any) {
				Alert.alert('Error', e.message);
				setDoneLoadAnimated(true);
			}
		});
	}, []);

	const getCurrentLocation = () => {
		try {
			request(
				Platform.OS === 'android'
					? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
					: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
			).then(res => {
				if (res == 'granted') {
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
					} catch (e: any) {
						Alert.alert('Error', e.message);
					}
				} else {
					Alert.alert(
						'Alert',
						'Location to camera not available! Please enable access to location in order to use this feature!',
						[
							{
								text: 'Go to setting',
								onPress: () => {
									openSettings();
									navigation.goBack();
								},
							},
						],
					);
				}
			});
		} catch (error) {
			console.log('location set error:', error);
		}
	};

	const getPlaceLatLng = async (address: string) => {
		const data: any = await axios.get(
			'https://api.geoapify.com/v1/geocode/search',
			{
				params: {
					text: address,
					apiKey: 'e40ca074c20b48eea5774e1b816964e3',
				},
			},
		);
		const location = data.data.features[0].geometry.coordinates;

		return {
			latitude: location[1] || 10.784281108329015,
			longitude: location[0] || 106.70366807305761,
		};
	};

	const getPlaceDetail = async (latLng: LatLng) => {
		const data: any = await axios.get(
			'https://api.geoapify.com/v1/geocode/reverse',
			{
				params: {
					lat: latLng.latitude,
					lon: latLng.longitude,
					format: 'json',
					apiKey: 'e40ca074c20b48eea5774e1b816964e3',
				},
			},
		);

		const address = data.data.results[0].formatted;
		return address;
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

	const getDistanceFromLocation = latLngLocation => {
		return getDistance(latLngLocation, {
			latitude: currentLocation?.latitude,
			longitude: currentLocation?.longitude,
		});
	};

	const _onPressCheckIn = async () => {
		try {
			// const addressCheckIn = await getPlaceDetail(currentLocation);
			if (!currentLocation) {
				Alert.alert('Error', 'Cannot get current location! Please try again!');
				return;
			}
			await insertCheckinVisit_T({
				leseID: visitInfo?.lese_ID,
				location: `${currentLocation?.latitude},${currentLocation?.longitude}`,
				visitID: visitInfo?.seq,
				VisitChecked_YN:
					getDistanceFromLocation(placeLocation) <
					parseInt(visitInfo?.distance),
				VisitAddress: placeAddress,
				VisitAddressID: `https://www.google.com/maps/dir/${currentLocation?.latitude},${currentLocation?.longitude}/${placeLocation?.latitude},${placeLocation?.longitude}`,
			});

			Alert.alert('Success', 'Checkin success!', [
				{
					text: 'Ok',
					onPress: () => navigation.goBack(),
				},
			]);
		} catch (error: any) {
			console.log(error);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle="dark-content" />

			<SafeAreaView style={{ zIndex: 99, position: 'absolute' }}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						top:
							Platform.OS === 'android'
								? (StatusBar.currentHeight || 0) + 10
								: 10,
						left: 16,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						height: 40,
						width: 40,
						borderRadius: 30,
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
			</SafeAreaView>
			{doneLoadAnimated ? (
				<MapView
					ref={mapRef}
					style={{ flex: 1 }}
					provider={PROVIDER_GOOGLE}
					showsUserLocation
					// showsMyLocationButton
					followsUserLocation
					initialRegion={{
						latitude: currentLocation?.latitude || 10.784281108329015,
						longitude: currentLocation?.longitude || 106.70366807305761,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					}}
				>
					{placeLocation && (
						<Circle
							center={{
								latitude: placeLocation?.latitude,
								longitude: placeLocation?.longitude,
							}}
							radius={parseInt(visitInfo?.distance) || 0}
							fillColor={colorFillCircle}
							strokeColor={Color.main}
						/>
					)}

					{placeLocation && (
						<Marker
							ref={ref => makerRefs.push(ref)}
							coordinate={{
								latitude: placeLocation?.latitude,
								longitude: placeLocation?.longitude,
							}}
							title={''}
							// description={item.ADDR}
							pinColor={Color.main}
						/>
					)}
				</MapView>
			) : (
				<LoadingFullScreen />
			)}

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
				<Card
					style={{ backgroundColor: Color.main, padding: 20, borderRadius: 30 }}
					elevation={16}
					onPress={doneLoadAnimated ? _onPressCheckIn : () => null}
				>
					<Icon
						as={Ionicons}
						name={'finger-print-outline'}
						size={35}
						color={'#fff'}
					/>
				</Card>
			</SafeAreaView>
		</View>
	);
}
