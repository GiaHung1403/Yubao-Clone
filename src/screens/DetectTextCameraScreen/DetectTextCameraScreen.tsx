/* eslint-disable react-native/no-inline-styles */
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,

	ImageBackground,

	View,
	Text,
	InteractionManager,

} from 'react-native';
import ml from '@react-native-firebase/ml';
import { Camera, PhotoFile } from 'react-native-vision-camera';

import { ActivityIndicator, useTheme } from 'react-native-paper';
import 'react-native-reanimated';
import { propmtCardVisit, responseGPT } from '@utils/textScanGpt';
import { ScanScreenComponent } from '@components/ScanScreenComponent/ScanScreenComponent';

export function DetectTextCameraScreen(_props: any) {
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
		const _onProcessImage = async (

		) => {

			try {
				const processed = await ml().cloudDocumentTextRecognizerProcessImage(
					photoPath,
				);


				const gptResult = await responseGPT(propmtCardVisit(processed.text));



				navigation.navigate('DetectTextResultScreen', {
					textDetail: processed.text,

					gptText: gptResult,
				});
				setPhotoPath('');
			} catch (e: any) {
				console.log(e.message);
				Alert.alert('Load Image Failed', 'Please Load Your Image Again');
				setPhotoPath('');
			}
		};
		if (photoPath)
			_onProcessImage()
	}, [photoPath])

	useEffect(() => {
		if (isFocused) {

			let temp = async () => {
				let ImageScan = await ScanScreenComponent()
				if (ImageScan) {
					setPhotoPath(ImageScan[0])

				}
				else {
					navigation.goBack()
				}
			}
			temp()
		}
	}, [isFocused])

	if (!photoPath) {
		return <View style={{ flex: 1, backgroundColor: "black" }}>

		</View>;
	}

	return (<View style={{ flex: 1, backgroundColor: "black" }}>


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
//@old versions
// import ml from '@react-native-firebase/ml';
// import { useNavigation } from '@react-navigation/native';
// import * as React from 'react';
// import { View } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import { Button } from 'react-native-paper';

// import Header from '@components/Header';
// import styles from './styles';

// let camera: any = null;
// export function DetectTextCameraScreen(props: any) {
//  const navigation: any = useNavigation();
//  const [loading, setLoading] = React.useState(false);

//  const takePicture = async () => {
//      setLoading(true);
//      if (camera) {
//          const options = { quality: 0.5, base64: true };
//          try {
//              const data = await camera.takePictureAsync(options);

//              const processed = await ml().cloudDocumentTextRecognizerProcessImage(
//                  data.uri,
//              );

//              setLoading(false);
//              navigation.navigate('DetectTextResultScreen', {
//                  textDetail: processed.text,
//              });
//          } catch (error) {
//              console.log(error);
//          }
//      }
//  };

//  return (
//      <View style={styles.container}>
//          <View>
//              <Header title="Scan CardVisit" />
//          </View>
//          <RNCamera
//              ref={ref => {
//                  camera = ref;
//              }}
//              style={styles.preview}
//              type={RNCamera.Constants.Type.back}
//              flashMode={RNCamera.Constants.FlashMode.auto}
//              androidCameraPermissionOptions={{
//                  title: 'Permission to use camera',
//                  message: 'We need your permission to use your camera',
//                  buttonPositive: 'Ok',
//                  buttonNegative: 'Cancel',
//              }}
//              androidRecordAudioPermissionOptions={{
//                  title: 'Permission to use audio recording',
//                  message: 'We need your permission to use your audio',
//                  buttonPositive: 'Ok',
//                  buttonNegative: 'Cancel',
//              }}
//          />
//          <View
//              style={{
//                  flex: 0,
//                  flexDirection: 'row',
//                  justifyContent: 'center',
//                  marginVertical: 20,
//              }}
//          >
//              <Button
//                  loading={loading}
//                  mode="contained"
//                  onPress={() => takePicture()}
//              >
//                  {loading ? 'loading' : 'SCAN'}
//              </Button>
//          </View>
//      </View>
//  );
// }




