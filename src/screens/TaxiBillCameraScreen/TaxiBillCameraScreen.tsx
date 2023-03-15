import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Image,
	ImageBackground,
	InteractionManager,
	PermissionsAndroid,
	Text,
	View,
} from 'react-native';
import ml from '@react-native-firebase/ml';
import { Camera } from 'react-native-vision-camera';

import { ActivityIndicator, useTheme } from 'react-native-paper';
import 'react-native-reanimated';
import { promtTaxi, responseGPT } from '@utils/textScanGpt';

import { Read_Line_Taxi } from '@utils/textReadByLine';
import { ScanScreenComponent } from '@components/ScanScreenComponent/ScanScreenComponent';

export function TaxiBillCameraScreen(_props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const isFocused = useIsFocused();
	const [photoPath, setPhotoPath] = useState('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			await Camera.requestCameraPermission();
		});
	}, []);

	useEffect(() => {
		const _onProcessImage = async () => {
			try {
				// console.log(photoData);
				let ImgWidth;
				let ImgHeight;
				Image.getSize(photoPath, (width, height) => {
					ImgWidth = width;
					ImgHeight = height;
				});

				const tmep = await ml().cloudTextRecognizerProcessImage(photoPath);

				const gptResult = await responseGPT(
					promtTaxi(Read_Line_Taxi(tmep.blocks, ImgWidth)),
				);

				navigation.navigate('TaxiBillResultScreen', {
					result: tmep?.text,
					image: photoPath,
					gptText: gptResult,
				});

				setPhotoPath('');
			} catch (e: any) {
				console.log(e.message);
				Alert.alert('Load Image Failed', 'Please Load Your Image Again');
				setPhotoPath('');
			}
		};
		if (photoPath) _onProcessImage();
	}, [photoPath]);
	useEffect(() => {
		if (isFocused) {
			let temp = async () => {
				let ImageScan = await ScanScreenComponent();
				console.log(ImageScan);
				if (ImageScan) {
					setPhotoPath(ImageScan[0]);
				} else {
					navigation.goBack();
				}
			};
			temp();
		}
	}, [isFocused]);

	if (!photoPath) {
		return <View style={{ flex: 1, backgroundColor: 'black' }}></View>;
	}

	return (
		<View style={{ flex: 1, backgroundColor: 'black' }}>
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
