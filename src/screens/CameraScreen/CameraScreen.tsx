import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, InteractionManager, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { LocalizationContext } from '@context/LocalizationContext';
import { RocketChat } from '@data/rocketchat';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';

import { getListMeetingRoom } from '@actions/book_meeting_action';
import { IUserSystem } from '@models/types';

export function CameraScreen(props: any) {
	const dispatch = useDispatch();
	const camera = useRef<any>();
	let enableScan: boolean = true;
	const navigation: any = useNavigation();
	// const { listMeetingRoom } = useSelector(
	// 	(state: any) => state.book_meeting_reducer,
	// );
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	const I18n = useContext(LocalizationContext);
	const textAlert = I18n.t('alert');
	const textDetailInfo = I18n.t('detailInfo');

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			dispatch(
				getListMeetingRoom({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					branchID: dataUserSystem.BRANCH_CODE,
				}),
			);
			setDoneLoadAnimated(true);
		});
		return () => camera.current.stopRecording();
	}, []);

	const _onQRDetect = async (data: string) => {
		if (!enableScan) {
			return;
		}
		enableScan = false;

		try {
			const dataParse = JSON.parse(data);
			if (typeof dataParse === 'object' && dataParse !== null) {
				if (dataParse.roomId) {
					await RocketChat.joinRoom({
						roomId: dataParse.roomId,
						joinCode: dataParse.roomId,
					});
					const dataRoom: any = await RocketChat.getRoomInfo({
						roomId: dataParse.roomId,
					});
					navigation.navigate('ChatRoomMessageScreen', {
						room: Object.assign(dataRoom.room, { rid: dataRoom.room._id }),
					});
					setTimeout(() => {
						enableScan = true;
					}, 2000);
				}
			}
		} catch (e: any) {
			if (data.search('/pdf|ebill/') > -1) {
				navigation.navigate('WebviewScreen', {
					title: textDetailInfo,
					url: data,
					isShowButton: true,
				});

				setTimeout(() => {
					enableScan = true;
				}, 1000);
			} else if (data.includes('INSR')) {
				navigation.navigate('ECoinInfoGiftModal', { giftNo: data });
				setTimeout(() => {
					enableScan = true;
				}, 2000);
				return;
			} else if (data.includes('BOOKMEETING')) {
				navigation.navigate('BookMeetingDetailScreen', {
					RoomID: data.split('_')[1],
				});
				setTimeout(() => {
					enableScan = true;
				}, 2000);
				return;
			} else {
				Alert.alert(
					textAlert,
					data,
					[
						{
							text: 'OK',
							onPress: async () => {
								enableScan = true;
							},
						},
					],
					{ cancelable: false },
				);
			}
		}
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
					captureAudio={false}
				/>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
