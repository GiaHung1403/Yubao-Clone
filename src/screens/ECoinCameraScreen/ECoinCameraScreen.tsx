import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { InteractionManager, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import styles from './styles';

export function ECoinCameraScreen(props: any) {
	const camera = useRef<any>();
	let enableScan: boolean = true;
	const navigation: any = useNavigation();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
		return () => camera.current.stopRecording();
	}, []);

	const _onQRDetect = async (data: string) => {
		if (!enableScan) {
			return;
		}

		enableScan = false;

		navigation.navigate('ECoinInfoGiftModal', { giftNo: data });

		setTimeout(() => {
			enableScan = true;
		}, 100);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="QRCode" />
			</View>

			{doneLoadAnimated ? (
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
