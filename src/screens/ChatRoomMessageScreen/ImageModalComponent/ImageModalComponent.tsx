// import { useRef } from 'react';
// import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';

// export default function ImageModalComponent() {
// 	const sheetRef = useRef<BottomSheetRef>();
// 	return (
// 		<BottomSheet open ref={sheetRef}>
// 			<button
// 				onClick={() => {
// 					// Full typing for the arguments available in snapTo, yay!!
// 					sheetRef.current.snapTo(({ maxHeight }) => maxHeight);
// 				}}
// 			>
// 				Expand to full height
// 			</button>
// 		</BottomSheet>
// 	);
// }

import CameraRoll from '@react-native-community/cameraroll';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { FlatList, Image, InteractionManager, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';

function ImageModalComponent(props: any, ref: any) {
	const [visible, setVisible] = useState<boolean>(false);
	const [imageViewer, setImageViewer] = useState<any>();
	const [listImage, setListImage] = useState('');

	useImperativeHandle(ref, () => ({
		onShowViewer: imageURL => {
			setVisible(true);
			setImageViewer([
				{
					// Simplest usage.
					url: imageURL,

					// width: number
					// height: number
					// Optional, if you know the image size, you can set the optimization performance

					// You can pass props to <Image />.
					props: {
						// headers: ...
					},
				},
			]);
		},
	}));

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			askPermission();
		});
	}, []);

	const getPhotos = () => {
		CameraRoll.getPhotos({
			first: 9999,
			assetType: 'All',
		})
			.then((res: any) => {
				setListImage(res?.edges);
			})
			.catch(error => {
				console.log(error);
			});
	};

	const askPermission = async () => {
		getPhotos();
		// if (Platform.OS === 'android') {
		// 	const result = await PermissionsAndroid.request(
		// 		PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
		// 		{
		// 			title: 'Permission Explanation',
		// 			message: 'ReactNativeForYou would like to access your photos!',
		// 		},
		// 	);
		// 	if (result !== 'granted') {
		// 		console.log('Access to pictures was denied');
		// 		return;
		// 	} else {

		// 	}
		// } else {
		// 	getPhotos();
		// }
	};

	return (
		<Modal isVisible={visible} style={{ margin: 0 }}>
			{/* <ImageViewer
				imageUrls={imageViewer}
				backgroundColor="transparent"
				enableSwipeDown
				onSwipeDown={() => setVisible(false)}
				renderImage={propsImage => <FastImage {...propsImage} />}
				swipeDownThreshold={0.3}
			/> */}
			<View>
				<FlatList
					data={listImage}
					keyExtractor={(_, index) => index.toString()}
					numColumns={3}
					renderItem={({ item }) => (
						<Image
							style={{
								width: '33%',
								height: 150,
								marginRight: 2,
								marginBottom: 2,
							}}
							source={{ uri: item.node.image.uri }}
						/>
					)}
				/>
			</View>
		</Modal>
	);
}

export default React.forwardRef(ImageModalComponent);
