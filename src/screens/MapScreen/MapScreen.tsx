import polyline from '@mapbox/polyline';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	Linking,
	Platform,
	SafeAreaView,
	Text,
	View,
	Image,
	Animated,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import MapView, {
	Marker,
	Polyline,
	PROVIDER_GOOGLE,
	Circle,
} from 'react-native-maps';
import { Button, Card, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListCustomerLocation } from '@actions/customer_location_action';
import Header from '@components/Header';
import Colors from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { GOOGLE_API_KEY } from '@data/Constants';
import { ICustomerLocation, IUserSystem } from '@models/types';
import styles from './styles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Dimensions } from 'react-native';
import * as geolib from 'geolib';
//import { Image } from "react-native-svg";
// import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { PERMISSIONS, request, openSettings } from 'react-native-permissions';

interface ICustomerLocationReducer {
	listLocation: ICustomerLocation[];
}

let { width, height } = Dimensions.get('window');
let CARD_HEIGHT = 200;
let CARD_WIDTH = width * 0.97;
const ASPECT_RATIO = width / height;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const LATITUDE_DELTA = 0.0322; //Increase or decrease the zoom level dynamically
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
interface ICurrentCustomerSelected extends ICustomerLocation {
	index: number;
}

const listColor = [
	Colors.main,
	'#e67e22',
	'#e74c3c',
	'#00a6c0',
	'#2c82c9',
	'#95a5a6',
];

// replace(/(<([^>]+)>)/ig, "")

const heightHeaderBottomSheet = 110;
const maxHeightBottomSheet = 500;
const heightContentBottomSheet = maxHeightBottomSheet - heightHeaderBottomSheet;

let mapAnimation = new Animated.Value(0);

export function MapScreen(props: any) {
	const mapRef: any = useRef<any>(null);
	const makerRefs: any = [];
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const I18n = useContext(LocalizationContext);

	const [haveDistance, setHaveDistance] = useState(false);
	const [selectIndex, setSelectIndex] = useState<number>();
	const [dir, setDir] = useState({
		Distance: '',
		Time: '',
	});

	const [isStop, setIsStop] = useState(true);
	const [centerLocation, setCenterLocation] = useState({
		latitude: 16.59885,
		longitude: 105.746316,
	});

	const { listLocation }: ICustomerLocationReducer = useSelector(
		(state: any) => state.customer_location_reducer,
	);

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [currentLocation, setCurrentLocation] = useState({
		latitude: 16.59885,
		longitude: 105.746316,
	});
	const [listCoords, setListCoords] = useState<any>([]);
	const [listItemSelected, setListItemSelected] = useState<any>({
		lat: '',
		lng: '',
	});
	const [showMarker, setShowMarker] = useState<any>([]);
	const [currentCustomerSelected, setCurrentCustomerSelected] =
		useState<ICurrentCustomerSelected>();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [textSearch, setTextSearch] = useState<string>('');

	const textAgency = 'Customer Nearby';

	let mapIndex = 0;

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const { username, password }: any = await Keychain.getGenericPassword();
			dispatch(
				getListCustomerLocation({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
					query: '',
					isFilterLatLng: '1',
				}),
			);
			setDoneLoadAnimated(true);
			//   getCenterLocation()
		});
	}, []);

	useEffect(() => {
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
								setCenterLocation({
									latitude: position.coords.latitude,
									longitude: position.coords.longitude,
								});
								setDoneLoadAnimated(true);
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
						'Error',
						' Location is not enabled, please go to the setting and enabled location to use this function',
						[{ text: 'OK', onPress: () => openSettings() }],
					);
				}
			});
		} catch (error) {
			console.log('location set error:', error);
		}
	}, []);

	// useEffect(() => {
	//   if (listItemSelected.length > 0) {
	//     mapRef?.current?.fitToCoordinates(
	//       [...listItemSelected.map(item => item.location), currentLocation],
	//       {
	//         edgePadding: {
	//           top: 150,
	//           right: 20,
	//           bottom: 500,
	//           left: 20,
	//         },
	//       },
	//     );
	//   } else {
	//     moveCameraToLocation(currentLocation);
	//   }
	// }, [listItemSelected]);

	useEffect(() => {
		if (listLocation.length != 0) {
			getCenterLocation();
		}
	}, [listLocation]);

	//move location when scroll

	useEffect(() => {
		mapAnimation.addListener(({ value }) => {
			let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
			if (index >= showMarker.length) {
				index = showMarker.length - 1;
			}
			if (index <= 0) {
				index = 0;
			}

			let regionTimeout;
			if (regionTimeout) clearTimeout(regionTimeout);

			regionTimeout = setTimeout(() => {
				if (mapIndex !== index) {
					mapIndex = index;
					const { location } = showMarker[index];
					mapRef?.current?.animateToRegion(
						{
							...location,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA,
						},
						350,
					);
				}
			}, 10);
		});
	});

	const interpolations = listLocation.map((marker, index) => {
		const inputRange = [
			(index - 1) * (CARD_WIDTH + 20),
			index * (CARD_WIDTH + 20),
			(index + 1) * (CARD_WIDTH + 20),
		];

		const scale = mapAnimation.interpolate({
			inputRange,
			outputRange: [1, 1.5, 1],
			extrapolate: 'clamp',
		});

		return { scale };
	});

	const _onSubmitSearch = () => {
		if (textSearch) {
			const indexSearch = listLocation.findIndex(
				address =>
					address?.ls_nm?.toUpperCase().includes(textSearch.toUpperCase()) ||
					address?.lese_ID
						?.toString()
						.toUpperCase()
						?.includes(textSearch.toUpperCase()) ||
					address?.tax_code?.toUpperCase().includes(textSearch.toUpperCase()),
			);
			const itemLocation = listLocation[indexSearch];

			if (itemLocation) {
				moveCameraToLocation(itemLocation.location);
				setCurrentCustomerSelected({ ...itemLocation, index: indexSearch });
				makerRefs[indexSearch].showCallout();
			}
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
				zoom: 14,
			},
			{
				duration: 2000,
			},
		);
	};

	// const _onMarkerPress = async (item: ICustomerLocation, index: number) => {
	//   setCurrentCustomerSelected({ ...item, index });
	// };

	const _scrollView = React.useRef<any>(null);

	const onMarkerPress = mapEventData => {
		const markerID = mapEventData._targetInst.return.key;
		_scrollView?.current?.scrollToIndex({
			animated: true,
			index: markerID,
		});
	};

	const confirmDirection = async (item: ICustomerLocation, index: number) => {
		setCurrentCustomerSelected({ ...item, index });
		setHaveDistance(true);
		setSelectIndex(index);
		setListCoords([]);
		setListItemSelected({
			lat: item.location.latitude,
			lng: item.location.longitude,
		});

		/* Check location đã tồn tại trong list selected chưa */
		// const indexExited = listItemSelected.findIndex(
		//   itemSelected => itemSelected.LESE_ID === currentCustomerSelected?.LESE_ID,
		// );

		// setListItemSelected(listLocationSelect => {
		//   const listLocationOld = [...listLocationSelect];
		//   if (indexExited > -1) {
		//     listLocationOld.splice(indexExited, 1);
		//     return listLocationOld;
		//   }

		//   return [...listLocationOld, currentCustomerSelected!];
		// });

		/* Chọn điểm bắt đầu và call API google map */
		// const origin =
		//   listItemSelected.length > 0
		//     ? indexExited > -1
		//       ? indexExited === 0
		//         ? currentLocation
		//         : listItemSelected[indexExited - 1].location
		//       : listItemSelected[listItemSelected.length - 1].location
		//     : currentLocation;

		// const destination =
		//   indexExited > -1
		//     ? listItemSelected[indexExited + 1].location
		//     : currentCustomerSelected?.location;

		const responseJson: any = await axios.get(
			'https://maps.googleapis.com/maps/api/directions/json',
			{
				params: {
					origin: `${currentLocation?.latitude},${currentLocation?.longitude}`,
					destination: `${item?.location?.latitude},${item?.location?.longitude}`,
					key: GOOGLE_API_KEY,
					language: 'vi',
				},
			},
		);

		setDir({
			Distance: responseJson.data.routes[0].legs[0].distance.text,
			Time: responseJson.data.routes[0].legs[0].duration.text,
		});

		/* Thêm polyline vào listCoords để show polyline */
		const points = polyline.decode(
			responseJson.data.routes[0].overview_polyline.points,
		);
		const coordsOb: any = points.map((point, index) => {
			return {
				latitude: parseFloat(point[0]),
				longitude: parseFloat(point[1]),
			};
		});
		const itemCoordsOb = {
			id: currentCustomerSelected?.lese_ID,
			coordsOb,
		};

		// setListCoords(listData => {
		//   const listOld = [...listData];
		//   if (indexExited > -1) {
		//     const indexCoordsOld = listData.findIndex(
		//       coords => currentCustomerSelected?.LESE_ID === coords.id,
		//     );
		//     listOld[indexCoordsOld] = itemCoordsOb;
		//     listOld.splice(indexCoordsOld + 1, 1);
		//     return [...listOld];
		//   }

		//   return [...listOld, itemCoordsOb];
		// });

		setListCoords([itemCoordsOb]);

		// setDir({latitude : currentCustomerSelected?.location.latitude , longitude: currentCustomerSelected?.location.longitude})
		moveCameraToLocation(currentLocation);
	};

	const getLocation = async () => {
		const map = await mapRef?.current?.getCamera();
		map.zoom < 12 ? setIsStop(false) : setIsStop(true);
	};

	const getCenterLocation = async () => {
		const map = await mapRef?.current?.getCamera();
		const centerLocation1 = {
			latitude: map.center.latitude,
			longitude: map.center.longitude,
		};
		setCenterLocation(centerLocation1);
		const listLocationMap = listLocation.filter(item => {
			return geolib.isPointWithinRadius(
				{
					latitude: item.location.latitude,
					longitude: item.location.longitude,
				},
				{
					latitude: centerLocation1.latitude,
					longitude: centerLocation1.longitude,
				},
				4000,
			);
		});

		setShowMarker(listLocationMap);
	};

	const _onPressOpenWithGoogleMap = async () => {
		// const stringLocation = listItemSelected.reduce(
		//   (a, b) => a + `/${b.location.latitude},${b.location.longitude}`,
		//   `/${currentLocation.latitude},${currentLocation.longitude}`,
		// );

		const stringLocation = `/${listItemSelected.lat},${listItemSelected.lng}/${currentLocation.latitude},${currentLocation.longitude}`;

		await Linking.openURL(`https://www.google.com/maps/dir${stringLocation}`);
	};

	return (
		<View style={styles.container}>
			<View style={styles.containerHeader}>
				<Header title={textAgency} />
			</View>

			{doneLoadAnimated && (
				<View style={{ flex: 1 }}>
					<Searchbar
						style={{
							position: 'absolute',
							top: 8,
							right: 8,
							left: 8,
							zIndex: 2,
						}}
						inputStyle={{ fontSize: 14 }}
						value={textSearch}
						placeholder="Search Name/ID/TaxCode"
						onChangeText={(text: string) => setTextSearch(text)}
						onSubmitEditing={() => _onSubmitSearch()}
					/>

					<MapView
						ref={mapRef}
						style={{ flex: 1 }}
						provider={PROVIDER_GOOGLE}
						showsUserLocation
						// showsMyLocationButton
						initialRegion={{
							latitude: currentLocation.latitude,
							longitude: currentLocation.longitude,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA,
						}}
						// onRegionChange={region => {
						//   // const zoomLevel = Math.log2(
						//   //     360 * (widthScreen / 256 / region.longitudeDelta) + 1,
						//   // );
						//   // if (zoomLevel >= 11.73) {
						//   //   setIsShowLabel(true);
						//   // } else {
						//   //   setIsShowLabel(false);
						//   // }
						//   getLocation();
						// }}
						// onRegionChangeComplete={region => {
						//   getCenterLocation();
						// }}
					>
						{listCoords.map((item, index) => (
							<Polyline
								key={index.toString()}
								coordinates={[...item.coordsOb]}
								strokeColor={listColor[index]} // fallback for when `strokeColors` is not supported by the map-provider
								strokeWidth={6}
								style={{ zIndex: 10 - index }}
							/>
						))}

						{showMarker.length > 0 &&
							showMarker?.map((item, index) => {
								if (isStop) {
									const scaleStyle = {
										transform: [
											{
												scale: interpolations[index].scale,
											},
										],
									};
									return (
										<Marker
											ref={ref => makerRefs.push(ref)}
											key={index.toString()}
											coordinate={{
												latitude: item.location.latitude,
												longitude: item.location.longitude,
											}}
											style={{ height: 50, width: 50 }}
											title={
												item.dealeR_YN === '0'
													? `(C) - ${item.ls_nm.toString().substring(0, 30)}...`
													: `(D) - ${item.ls_nm.toString().substring(0, 30)}...`
											}
											// description={item.ADDR}
											onPress={e => onMarkerPress(e)}
											pinColor={
												item.dealeR_YN === '1'
													? 'orange'
													: item.OB === 0
													? Colors.approved
													: colors.primary
											}
										>
											<Animated.View
												style={[
													{
														alignItems: 'center',
														justifyContent: 'center',
														width: 50,
														height: 50,
													},
												]}
											>
												<Animated.Image
													resizeMode="cover"
													style={[{ height: 30, width: 30 }, scaleStyle]}
													source={{
														uri: 'https://img.icons8.com/external-kmg-design-outline-color-kmg-design/344/external-map-map-and-navigation-kmg-design-outline-color-kmg-design-6.png',
													}}
												/>
											</Animated.View>
										</Marker>
									);
								}
							})}
					</MapView>
				</View>
			)}

			<SafeAreaView
				style={{ position: 'absolute', bottom: 8, left: 0, right: 0 }}
			>
				{true ? (
					<Animated.View style={{ alignItems: 'center' }}>
						<AnimatedFlatList
							ref={_scrollView}
							onScroll={Animated.event(
								[
									{
										nativeEvent: {
											contentOffset: {
												x: mapAnimation,
											},
										},
									},
								],
								{ useNativeDriver: true },
							)}
							data={showMarker}
							horizontal={true}
							decelerationRate={0}
							bounces={false}
							snapToInterval={CARD_WIDTH + 20}
							snapToAlignment="center"
							renderItem={({ item, index }: any) => (
								<Card
									elevation={8}
									style={{
										width: CARD_WIDTH,
										marginHorizontal: 10,
									}}
								>
									<View style={{ padding: 8, flex: 1 }}>
										<View style={{ flex: 3, alignItems: 'center' }}>
											<Text
												style={{
													marginBottom: 8,
													fontWeight: 'bold',
													textAlign: 'center',
												}}
											>
												{item.ls_nm}{' '}
												<Text
													style={{
														fontWeight: 'normal',
														color:
															item.dealeR_YN === '1'
																? 'orange'
																: item.ob === 0
																? Colors.approved
																: colors.primary,
													}}
												>
													{item.dealeR_YN === '0' ? '(Customer)' : '(Dealer)'}
												</Text>
											</Text>

											<View
												style={{
													flexDirection: 'row',
													alignItems: 'center',
													marginBottom: 4,
												}}
											>
												<Icon
													as={Ionicons}
													name={'at-circle-outline'}
													size={18}
													color={Colors.approved}
													marginRight={8}
												/>
												<Text style={{ flex: 1 }}>{item.tax_code}</Text>
											</View>

											<View
												style={{
													flexDirection: 'row',
													alignItems: 'center',
													marginBottom: 12,
												}}
											>
												<Icon
													as={Ionicons}
													name={'map-outline'}
													size={18}
													color={Colors.approved}
													marginRight={8}
												/>
												<Text style={{ flexGrow: 1, flex: 1, width: 0 }}>
													{item.addr}
												</Text>
											</View>

											{haveDistance && selectIndex === index && (
												<View style={{ flexDirection: 'row', flex: 1 }}>
													<View
														style={{
															flexDirection: 'row',
															alignItems: 'center',
															marginBottom: 12,
															flex: 2,
														}}
													>
														<Icon
															as={MaterialCommunityIcons}
															name={'map-marker-distance'}
															size={18}
															color={Colors.approved}
															marginRight={8}
														/>
														<Text style={{ flexGrow: 1, flex: 1, width: 0 }}>
															{dir.Distance}
														</Text>
													</View>

													<View
														style={{
															flexDirection: 'row',
															alignItems: 'center',
															marginBottom: 12,
															flex: 2,
														}}
													>
														<Icon
															as={Ionicons}
															name={'time-outline'}
															size={18}
															color={Colors.approved}
															marginRight={8}
														/>
														<Text style={{ flexGrow: 1, flex: 1, width: 0 }}>
															{dir.Time}
														</Text>
													</View>
												</View>
											)}
										</View>

										<View
											style={{
												flexDirection: 'row',
												flex: 1,
												alignItems: 'flex-end',
											}}
										>
											<Button
												style={{ flex: 1, marginRight: 16 }}
												mode={'contained'}
												icon={'directions'}
												uppercase={false}
												onPress={() => {
													// _onMarkerPress(item, index);
													confirmDirection(item, index);
												}}
											>
												Direction
											</Button>
											<Button
												style={{ flex: 1, backgroundColor: Colors.approved }}
												mode={'contained'}
												icon={'map'}
												uppercase={false}
												onPress={_onPressOpenWithGoogleMap}
											>
												Google Map
											</Button>
										</View>
									</View>
								</Card>
							)}
						/>
					</Animated.View>
				) : (
					<Card elevation={8}>
						<Text>Choose customer to show information!</Text>
					</Card>
				)}
			</SafeAreaView>
		</View>
	);
}
