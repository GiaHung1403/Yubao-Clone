import { Ionicons } from '@expo/vector-icons';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	FlatList,
	Image,
	Platform,
	TouchableOpacity,
	View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import * as Keychain from 'react-native-keychain';
import { Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Header from '@components/Header';
import { getImages, removeImage, uploadImage } from '@data/api';
import { IAssetImage, IUserSystem } from '@models/types';

const widthScreen = Dimensions.get('screen').width;

export function CATakePhotoScreen(props: any) {
	const { CNID } = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [currentLocation, setCurrentLocation] = useState({
		latitude: 16.59885,
		longitude: 105.746316,
	});
	const [listImage, setListImage] = useState<IAssetImage[]>(new Array(8));
	const [loading, setLoading] = useState<boolean>(false);
	const [indexItemLoading, setIndexItemLoading] = useState<number>();

	const { colors } = useTheme();

	useEffect(() => {
		getListAssetImage();
		Geolocation.getCurrentPosition(
			position => {
				setCurrentLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			error =>
				Alert.alert(
					'Alert',
					'Cannot get current location! Please contact MIS!\n' + error.message,
				),
			Platform.OS === 'ios'
				? { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
				: {},
		);
	}, []);

	const getListAssetImage = async () => {
		const credentials: any = await Keychain.getGenericPassword();
		const { username, password } = credentials;
		const responseImage: any = await getImages({
			User_ID: dataUserSystem.EMP_NO,
			Password: password,
			key: CNID,
			SEQ: '',
			tableName: 'CA',
		});

		setListImage(listOld => [].concat(responseImage));
	};

	const _onPressItem = (index: number) => {
		setIndexItemLoading(index);
		setLoading(true);

		const options = {
			maxWidth: 1920,
			quality: 1,
			mediaType: '',
		};

		ImagePicker.launchCamera(
			options as ImagePicker.ImageLibraryOptions,
			async response => {
				if (response.didCancel) {
					setLoading(false);
					return;
				}

				if (listImage[index]) {
					try {
						await removeImage({
							key: CNID,
							SEQ: listImage[index].SEQ,
							tableName: 'CA',
						});
					} catch (error: any) {
						Alert.alert('Error Remove Image', error.message);
					}
				}

				try {
					const credentials: any = await Keychain.getGenericPassword();
					const { username, password } = credentials;

					setListImage(listOld => {
						listOld[index] = Object.assign(listOld[index] || { URL_FILE: '' }, {
							URL_FILE: response.assets ? response.assets[0].uri : '',
						});
						return listOld;
					});
					try {
						await axios.post('http://192.168.10.81:3000/upload/upload_file', {
							imageBase64: response.assets ? response.assets[0].base64 : '',
							functionName: 'CA',
							fileName: `${CNID}_${index + 1}`,
						});

						await uploadImage({
							User_ID: dataUserSystem.EMP_NO,
							Password: password,
							imageName: `${CNID}_${index + 1}`,
							imageURI: `/export/CILC_APP/CA/${CNID}_${index + 1}.jpg`,
							SEQ: index + 1,
							latLng: `${currentLocation.latitude},${currentLocation.longitude}`,
							location: `${currentLocation.latitude},${currentLocation.longitude}`,
							key: CNID,
							tableName: 'CA',
						});
					} catch (error: any) {
						Alert.alert('Error', error.message);
					}

					setLoading(false);
				} catch (error: any) {
					Alert.alert('Error', error.message);
				}
			},
		);
	};

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<View
				style={{
					zIndex: 2,
				}}
			>
				<Header title="Take photos" />
			</View>

			<FlatList
				data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
				style={{ padding: 8 }}
				keyExtractor={(_, index) => index.toString()}
				numColumns={3}
				renderItem={({ item, index }) => (
					<Card
						style={{
							height: 100,
							maxWidth: widthScreen / 3 - 8,
							flex: 1,
							marginBottom: 8,
							marginRight: (index + 1) % 3 === 0 ? 0 : 8,
						}}
						key={index.toString()}
					>
						<TouchableOpacity
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								flex: 1,
							}}
							onPress={() => _onPressItem(index)}
						>
							{indexItemLoading === index && loading ? (
								<View>
									<ActivityIndicator />
								</View>
							) : listImage[index] ? (
								<Image
									source={{ uri: listImage[index].URL_FILE }}
									resizeMode="contain"
									style={{ width: '100%', height: '100%' }}
								/>
							) : (
								<Icon
									as={Ionicons}
									name={index < 10 ? 'image-outline' : 'aperture-outline'}
									color={colors.primary}
								/>
							)}
						</TouchableOpacity>
					</Card>
				)}
			/>
		</View>
	);
}
