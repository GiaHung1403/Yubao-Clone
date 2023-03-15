import { Ionicons } from '@expo/vector-icons';
import ml from '@react-native-firebase/ml';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Image,
	InteractionManager,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Button, Card, useTheme } from 'react-native-paper';

import Header from '@components/Header';
import ImageViewerCustom from '@components/ImageViewerCustom';
import LoadingFullScreen from '@components/LoadingFullScreen';

import styles from './styles';

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

export function VRCScanScreen(props) {
	const navigation: any = useNavigation();
	const imageViewerRef = useRef<any>();

	const { colors } = useTheme();
	const [pickerAPNO, setPickerAPNO] = useState('');
	const [pickerAsset, setPickerAsset] = useState<any>();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [imageFrontUpdate, setImageFrontUpdate] = useState(undefined);
	const [imageBackUpdate, setImageBackUpdate] = useState(undefined);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (pickerAPNO) {
			setPickerAsset(null);
		}
	}, [pickerAPNO]);

	const _onPressNextButton = async () => {
		if (!imageFrontUpdate && !imageBackUpdate) {
			Alert.alert('Alert', 'Please input image!!!');
			return;
		}

		setLoading(true);

		try {
			const processedFront = imageFrontUpdate
				? await ml().cloudDocumentTextRecognizerProcessImage(
						imageFrontUpdate || '',
				  )
				: { text: '' };
			const processedBack = imageBackUpdate
				? await ml().cloudDocumentTextRecognizerProcessImage(
						imageBackUpdate || '',
				  )
				: { text: '' };

			setLoading(false);
			navigation.navigate('VRCResultScreen', {
				resultFront: processedFront.text,
				resultBack: processedBack.text,
				APNO: pickerAPNO,
				assetSelected: pickerAsset,
				imageFront: imageFrontUpdate,
				imageBack: imageBackUpdate,
			});
		} catch (e: any) {
			Alert.alert('Error', e.message);
			setLoading(false);
		}
	};

	const ViewPicker = ({ title, data }) => {
		return (
			<View style={styles.pickerStyle}>
				<Text style={{ fontSize: 15, flex: 3 }}>{title}</Text>
				<View
					style={{
						flexDirection: 'row',
						flex: 3,
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}
				>
					<Text style={{ textAlign: 'right' }}>{data}</Text>
					<Icon
						as={Ionicons}
						name={'chevron-forward-outline'}
						size={6}
						color={colors.primary}
					/>
				</View>
			</View>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Scan VCR'} />

			{doneLoadAnimated ? (
				<View>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('VRCPickerModal', {
								title: 'APNO',
								apnoOld: pickerAPNO, //'C211017612',
								getPicker: item => {
									setPickerAPNO(item.APNO);
								},
							});
						}}
					>
						<ViewPicker title="Select Contract" data={`${pickerAPNO}`} />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {
							navigation.navigate('VRCPickerModal', {
								title: 'Asset',
								apnoOld: pickerAPNO, //C211017612',
								assetIDOld: pickerAsset?.ASTS_ID,
								isMortgageAsset: pickerAsset?.isMortgage,
								getPicker: item => {
									setPickerAsset(item);
								},
							});
						}}
					>
						<ViewPicker
							title="Select Asset"
							data={`${pickerAsset?.ASTS_NM || ''}`}
						/>
					</TouchableOpacity>

					<View style={{ flexDirection: 'row' }}>
						<Card
							elevation={2}
							style={{ margin: 8, flex: 1 }}
							onPress={() => {
								if (!pickerAsset) {
									Alert.alert('Warning', 'Please choose assets!');
									return;
								}

								imageFrontUpdate
									? imageViewerRef.current.onShowViewer(
											[{ url: imageFrontUpdate }],
											0,
									  )
									: ImagePicker.openCamera(optionsCamera).then((image: any) => {
											setImageFrontUpdate(image.path);
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
											uri:
												imageFrontUpdate ||
												'https://img.icons8.com/bubbles/344/business-contact.png',
										}}
										resizeMode={imageFrontUpdate ? 'cover' : 'contain'}
										style={{ width: '100%', height: 70 }}
									/>

									{imageFrontUpdate && (
										<TouchableOpacity
											style={{ position: 'absolute', top: -10, right: -10 }}
											onPress={() => setImageFrontUpdate(undefined)}
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
								<Text
									style={{ marginTop: 12, fontWeight: '500', color: '#333' }}
								>
									Front image
								</Text>
							</View>
						</Card>

						<Card
							elevation={2}
							style={{ marginVertical: 8, marginRight: 8, flex: 1 }}
							onPress={() => {
								if (!pickerAsset) {
									Alert.alert('Warning', 'Please choose assets!');
									return;
								}
								imageBackUpdate
									? imageViewerRef.current.onShowViewer(
											[{ url: imageBackUpdate }],
											0,
									  )
									: ImagePicker.openCamera(optionsCamera).then((image: any) => {
											setImageBackUpdate(image.path);
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
											uri:
												imageBackUpdate ||
												'https://img.icons8.com/bubbles/344/bank-card-back-side.png',
										}}
										resizeMode={imageBackUpdate ? 'cover' : 'contain'}
										style={{ width: '100%', height: 70 }}
									/>

									{imageBackUpdate && (
										<TouchableOpacity
											style={{ position: 'absolute', top: -10, right: -10 }}
											onPress={() => setImageBackUpdate(undefined)}
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
								<Text
									style={{ marginTop: 12, fontWeight: '500', color: '#333' }}
								>
									Back image
								</Text>
							</View>
						</Card>
					</View>

					<Button
						mode={'contained'}
						uppercase={false}
						loading={loading}
						style={{
							margin: 8,
							backgroundColor:
								!imageFrontUpdate && !imageBackUpdate
									? '#d3d3d3'
									: colors.primary,
						}}
						onPress={() => _onPressNextButton()}
					>
						{loading ? 'Loading...' : 'Next'}
					</Button>
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
