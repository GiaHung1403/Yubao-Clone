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

import { IUserSystem, IVisit } from '@models/types';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { Icon } from 'native-base';
import Color from '@config/Color';
import { insertCheckin } from '@data/api';
import { useSelector } from 'react-redux';
import { checkBiometryAuth, isBiometrySupported } from '@utils/BiometryAuth';
const IC_BACK = require('@assets/icons/ic_back.png');
interface IProps {
	visitInfo: IVisit;
	index: number;
	onPress: () => void;
}

export function CheckinMapModal(props: any) {
	const mapRef: any = useRef<any>(null);
	const makerRefs: any = [];
	const navigation: any = useNavigation();

	const { colors } = useTheme();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [currentLocation, setCurrentLocation] = useState({
		latitude: 16.59885,
		longitude: 105.746316,
	});
	const [colorFillCircle, setColorFillCircle] = useState<string | undefined>(
		undefined,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
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
				setDoneLoadAnimated(true);
				setColorFillCircle('rgba(223, 202, 232,0.6)');
			} catch (e: any) {
				Alert.alert('Error', e.message);
			}
		});
	}, []);

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
			await insertCheckin({
				User_ID: dataUserSystem.EMP_NO,
				location_X: currentLocation.latitude,
				location_Y: currentLocation.longitude,
			});
			Alert.alert('Success!', 'Checkin success!');
		} catch (error: any) {
			Alert.alert('Error!', error.message);
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
						latitude: currentLocation.latitude,
						longitude: currentLocation.longitude,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					}}
				></MapView>
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
					onPress={_onPressCheckin}
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
