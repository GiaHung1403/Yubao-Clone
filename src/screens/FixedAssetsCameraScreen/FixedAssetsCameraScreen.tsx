import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, InteractionManager, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import styles from './styles';

export function FixedAssetsCameraScreen(props: any) {
	const camera = useRef<any>();
	let enableScan: boolean = true;
	const navigation: any = useNavigation();

	const { locationSelected } = props.route.params;

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [stopCamera, setStopCamera] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setStopCamera(false);
			enableScan = true;
		});

		return () => {
			unsubscribe;
		};
	}, [navigation]);

	const _onQRDetect = async (data: string) => {
		if (!enableScan) {
			return;
		}
		enableScan = false;
		const listData = data.split(',');
		const item = listData.find(item => item.includes('Asset Code'));

		if (item) {
			const indexSplice = item.indexOf(':');
			const dataSplice = item?.slice(indexSplice + 1);
			navigation.navigate('FixedAssetsDetailScreen', {
				codeFixedAsset: dataSplice,
				locationSelected,
			});
			setStopCamera(true);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#000' }}>
			<View style={{ zIndex: 2 }}>
				<Header title="QRCode" />
			</View>

			{doneLoadAnimated && !stopCamera ? (
				<RNCamera
					ref={ref => {
						camera.current = ref;
					}}
					style={{ flex: 1, zIndex: 1 }}
					type={RNCamera.Constants.Type.back}
					flashMode={RNCamera.Constants.FlashMode.off}
					androidCameraPermissionOptions={{
						title: 'Permission to use camera',
						message: 'We need your permission to use your camera',
						buttonPositive: 'Ok',
						buttonNegative: 'Cancel',
					}}
					onBarCodeRead={text => _onQRDetect(text.data)}
				/>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
