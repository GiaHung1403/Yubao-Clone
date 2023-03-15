import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { InteractionManager, View } from 'react-native';
import 'react-native-reanimated';
import {
	runOnJS,
	useDerivedValue,
	useSharedValue,
} from 'react-native-reanimated';

import { StyleSheet } from 'react-native';
import {
	CameraDevice,
	useCameraDevices,
	useFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { scanFaces, Face } from 'vision-camera-face-detector';
import { readFile } from 'react-native-fs';

let enableScan: boolean = true;

export function AttendanceViaFaceScreen(props: any) {
	const camera = useRef<Camera>(null);
	const navigation: any = useNavigation();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	const [hasPermission, setHasPermission] = useState(false);
	const [faces, setFaces] = useState<Face[]>();

	const devices = useCameraDevices('wide-angle-camera');
	const device = devices.front;

	const sharedFaces = useSharedValue<Face[]>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);

			const status = await Camera.requestCameraPermission();
			setHasPermission(status === 'authorized');
		});
	}, []);

	const frameProcessor = useFrameProcessor(
		frame => {
			'worklet';
			if (doneLoadAnimated) {
				const scannedFaces = scanFaces(frame);
				sharedFaces.value = scannedFaces;
			}
		},
		[doneLoadAnimated],
	);

	const onFaceDetected = async faces => {
		if (!enableScan || faces.length === 0) {
			return;
		}
		const photo: any = await camera?.current?.takePhoto({
			flash: 'off',
		});
		// enableScan = false;
		const base64 = await readFile(photo.path, 'base64');
	};

	useDerivedValue(() => {
		runOnJS(onFaceDetected)(sharedFaces.value);
	});

	return hasPermission ? (
		<View style={{ flex: 1 }}>
			<Camera
				ref={camera}
				style={StyleSheet.absoluteFill}
				device={device as CameraDevice}
				isActive={true}
				frameProcessor={frameProcessor}
				frameProcessorFps={5}
				photo={true}
			/>
		</View>
	) : null;
}
