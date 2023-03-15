import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { readFile } from 'react-native-fs';

import { FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import { Checkbox, Button, Card, useTheme } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import ImageViewerCustom from '@components/ImageViewerCustom';
import Modal from 'react-native-modal';
import * as FileSystem from 'expo-file-system';

import Header from '@components/Header';
import { LocalizationContext } from '@context/LocalizationContext';
import { PreferencesContext } from '@context/PreferencesContext';
import { listThemes } from '@data/Constants';
import AsyncStorage from '@data/local/AsyncStorage';
import { ColorPicker } from 'react-native-color-picker';

import styles from './styles';

//const fs = RNFetchBlob.fs;
const optionsCamera = {
	cropping: true,
	compressImageQuality: 0.8,
	width: 1200,
	height: 1600,
	freeStyleCropEnabled: true,
	cropperAvoidEmptySpaceAroundImage: false,
	cropperChooseText: 'Choose',
	cropperCancelText: 'Cancel',
	includeBase64: true,
};
export function SettingCustomThemeScreen(props: any) {
	const navigation: any = useNavigation();
	const imageViewerRef = useRef<any>();
	const I18n = React.useContext(LocalizationContext);
	const BG_HCM = require('@assets/bg_hcm.jpg');
	// const BG_HCM = require('@assets/christmas_Theme.jpeg');

	const { colors } = useTheme();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const Colors = React.useContext(PreferencesContext);

	const [lastTheme, setLastTheme] = useState<any>({});
	const [theme, setThemeUpdate] = useState(undefined);
	const [headerTheme, setHeaderThemeUpdate] = useState(undefined);
	const [colorTheme, setColorTheme] = useState('white');

	useEffect(() => {
		(async () => {
			const main = await AsyncStorage.getColor();
			setLastTheme(main);
		})();
	}, []);

	async function getImageToBase64(imageURL) {
		let image;
		try {
			const { uri } = await FileSystem.downloadAsync(
				imageURL,
				FileSystem.documentDirectory + 'bufferimg.png',
			);

			image = await readFile(imageURL, 'base64');
		} catch (err) {
			console.log(err);
		}
		return image;
	}

	const _onPressItem = async item => {
		Colors.toggleTheme(item);
		await AsyncStorage.setColor(item);
		navigation.goBack();
	};

	const _onPressTheme = async item => {
		console.log(item);

		const sysTheme = {
			color: item.Color,
			theme: item.Link,
			header: item.HeaderLink,
		};
		Colors.toggleTheme(sysTheme);
		await AsyncStorage.setColor(sysTheme);
		navigation.goBack();
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={I18n.t('themeCustom')} />
			</View>
			<View>
				<Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>
					Choose you theme
				</Text>
				<FlatList
					data={listThemes}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							onPress={() => {
								_onPressTheme(item);
							}}
							style={styles.containerItem}
						>
							<Image
								source={
									typeof item.Link === 'number' ? item.Link : { uri: item.Link }
								}
								resizeMode={'cover'}
								style={{
									width: 180,
									height: 150,
									alignSelf: 'center',
									marginVertical: 16,
								}}
							/>
						</TouchableOpacity>
					)}
				/>
			</View>
			<Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>
				Customize you theme
			</Text>
			<View style={{ flexDirection: 'row' }}>
				<Card
					elevation={2}
					style={{ margin: 8, flex: 1 }}
					onPress={() => {
						theme
							? imageViewerRef.current.onShowViewer([{ url: theme }], 0)
							: ImagePicker.openPicker(optionsCamera).then((image: any) => {
									setThemeUpdate(image.data);
							  });
					}}
				>
					<View
						style={{
							padding: 8,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View style={{ width: '100%', position: 'relative' }}>
							<Image
								source={{
									uri: theme
										? `data:image/jpeg;base64,${theme}`
										: 'https://cdn-icons-png.flaticon.com/512/3596/3596298.png',
								}}
								resizeMode={theme ? 'cover' : 'contain'}
								style={{ width: '100%', height: 70 }}
							/>

							{theme && (
								<TouchableOpacity
									style={{ position: 'absolute', top: -10, right: -10 }}
									onPress={() => setThemeUpdate(undefined)}
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
						</View>
						<Text style={{ marginTop: 12, fontWeight: '500', color: '#333' }}>
							Theme
						</Text>
					</View>
				</Card>

				<Card
					elevation={2}
					style={{ marginVertical: 8, marginRight: 8, flex: 1 }}
					onPress={() => {
						headerTheme
							? imageViewerRef.current.onShowViewer([{ url: headerTheme }], 0)
							: ImagePicker.openPicker(optionsCamera).then((image: any) => {
									setHeaderThemeUpdate(image.data);
							  });
					}}
				>
					<View
						style={{
							padding: 8,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View style={{ width: '100%', position: 'relative' }}>
							<Image
								source={{
									uri: headerTheme
										? `data:image/jpeg;base64,${headerTheme}`
										: 'https://cdn-icons-png.flaticon.com/512/3596/3596219.png',
								}}
								resizeMode={headerTheme ? 'cover' : 'contain'}
								style={{ width: '100%', height: 70 }}
							/>

							{headerTheme && (
								<TouchableOpacity
									style={{ position: 'absolute', top: -10, right: -10 }}
									onPress={() => setHeaderThemeUpdate(undefined)}
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
						</View>
						<Text style={{ marginTop: 12, fontWeight: '500', color: '#333' }}>
							Theme Header
						</Text>
					</View>
				</Card>
			</View>

			<View>
				<Card
					elevation={2}
					style={{ margin: 8, backgroundColor: colorTheme }}
					onPress={() => {
						setIsModalVisible(true);
					}}
				>
					<View
						style={{
							padding: 8,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View style={{ width: '100%', position: 'relative' }}>
							<Image
								source={{
									uri: 'https://cdn-icons-png.flaticon.com/512/1199/1199134.png',
								}}
								resizeMode={null ? 'cover' : 'contain'}
								style={{ width: '100%', height: 70 }}
							/>
						</View>
						<Text style={{ marginTop: 12, fontWeight: '500', color: '#333' }}>
							Theme Color
						</Text>
					</View>
				</Card>
			</View>
			<Button
				mode={'contained'}
				uppercase={false}
				style={{
					margin: 8,
					backgroundColor: colors.primary,
				}}
				onPress={() => {
					let newTheme = { color: colorTheme, theme, header: headerTheme };
					if (theme == undefined) {
						newTheme = { ...newTheme, theme: lastTheme?.theme };
					}
					if (headerTheme == undefined) {
						newTheme = { ...newTheme, header: lastTheme?.header };
					}
					if (colorTheme == 'white') {
						newTheme = { ...newTheme, color: lastTheme?.color };
					}
					_onPressItem(newTheme);
				}}
			>
				{' '}
				Changes
			</Button>

			<View style={{ flex: 1 }}>
				<Modal
					isVisible={isModalVisible}
					style={{ marginVertical: 100, zIndex: 0.5 }}
					animationIn={'slideInUp'}
					animationOut={'slideOutDown'}
				>
					<TouchableOpacity
						style={{ flex: 1 }}
						activeOpacity={1}
						onPress={() => {
							setIsModalVisible(false);
						}}
					>
						<View style={{ flex: 1, padding: 45, backgroundColor: '#212021' }}>
							<Text style={{ color: 'white', textAlign: 'center' }}>
								Choose you color
							</Text>

							<ColorPicker
								onColorSelected={color => {
									setColorTheme(color);
									setIsModalVisible(false);
								}}
								style={{ flex: 1 }}
							/>
						</View>
					</TouchableOpacity>
				</Modal>
			</View>

			<View>
				<ImageViewerCustom
					ref={ref => {
						imageViewerRef.current = ref;
					}}
				/>
			</View>
		</View>
	);
}
