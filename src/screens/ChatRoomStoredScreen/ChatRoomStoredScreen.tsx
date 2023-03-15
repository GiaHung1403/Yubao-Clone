import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	InteractionManager,
	Text,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	useWindowDimensions,
	Platform,
	StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';

import { Snackbar, useTheme } from 'react-native-paper';
import Header from '@components/Header';
import ImageAutoSize from '@components/ImageAutoSize';
import Colors from '@config/Color';
import { DOMAIN_SERVER_CHAT } from '@data/Constants';
import { IFileRC, IRoom, IUserLoginRC } from '@models/types';
import FastImage from 'react-native-fast-image';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Share from 'react-native-share';
import {
	DocumentDirectoryPath,
	downloadFile,
	DownloadFileOptions,
	readFile,
} from 'react-native-fs';
import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';
import {
	SceneMap,
	SceneRendererProps,
	TabBar,
	TabView,
} from 'react-native-tab-view';
import EventEmitter from '@utils/events';
import { useNavigation } from '@react-navigation/native';
import openLink from '@utils/openLink';
import ReactNativeBlobUtil from 'react-native-blob-util';

export function ChatRoomStoredScreen(props: any) {
	const {room , isUpload}  = props.route.params;
	const navigation  = useNavigation()
	const { colors } = useTheme();
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const listFileRC: IFileRC[] = useSelector(
		(state: any) => state.document_reducer.listFileRC,
	);
	const [select, setSelect] = useState<any>([]);
	const [shareFile, setShareFile] = useState<any>([]);
	const [doneLoadAnimation, setDoneLoadAnimation] = useState(false);
	const [listMedia, setListMedia] = useState<any>([]);
	const [listFiles, setListFiles] = useState<any>([]);
	const [listLinks, setListLinks] = useState<any>([]);

	const textMedia = 'Media';
	const textLinks = 'Links';
	const textFiles = 'Files';

	const initialLayout = useWindowDimensions();

	const [indexTab, setIndexTab] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: textMedia },
		{ key: 'second', title: textFiles },
		{ key: 'three', title: textLinks },
	]);

	const [visibleSnackBar, setVisibleSnackBar]= useState(false);


	const imageViewer = (uri,item) => {
		const haveSelect = select.includes(uri);
		return (
			<View
				style={{
					borderWidth: haveSelect ? 3 : 1,
					borderColor: haveSelect ? colors.primary : '#ddd',
					borderRadius: 8,
					marginBottom: 4,
					overflow: 'hidden',
					position: 'relative',
					marginHorizontal: 2,
					flex: 1,
				}}
			>
				<TouchableWithoutFeedback
					// onPress={() => {
					// 	haveSelect
					// 		? setSelect(select.filter(item => item !== uri))
					// 		: setSelect(item => [...item, uri]);
					// 	_getImage(uri);
					// }}

					onPress={() => {
						isUpload ? getFileUpload(uri, item) : _onShareFile(uri);

					}}
				>
					<FastImage
						style={{
							// width:
							//   ratioSize === CaseRatioImage.WIDTH_THAN ? 0.8 * widthScreen : 200,
							// height: ratioSize === CaseRatioImage.WIDTH_THAN ? 200 : 300,
							// maxHeight: 300,
							// maxWidth: 0.8 * widthScreen - 20,
							width: '100%',
							height: 200,
						}}
						source={{
							uri,
							priority: FastImage.priority.normal,
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>
				</TouchableWithoutFeedback>
				{haveSelect && (
					<View style={{ position: 'absolute', top: 0, right: 0 }}>
						<Icon
							as={Ionicons}
							name={'checkmark-circle'}
							size={7}
							color={colors.primary}
						/>
					</View>
				)}
			</View>
		);
	};

	const _onShareFile= (uri)=>{
		const haveSelect = select.includes(uri);
			haveSelect ? setSelect(select.filter(item => item !== uri))
			: setSelect(item => [...item, uri]);
			_getImage(uri);
	}

	const getFileUpload = async (url, item) => {
		// Define path to store file along with the extension
		const haveSelect = select.includes(url);
		const path = `${DocumentDirectoryPath}/${url.split('/')[5]}.jpeg`;
		const headers = {
			Accept: 'image/*',
			'Content-Type': 'image/*',
			Authorization: `Bearer [token]`,
		};
		// Define options
		const options: DownloadFileOptions = {
			fromUrl: url,
			toFile: path,
			headers,
		};
		// Call downloadFile
		await downloadFile(options).promise;
		const base64Data = await readFile(path, 'base64');

		const file_Type = item.name.split('.');
		const getType = file_Type[file_Type.length - 1];
		EventEmitter.emit('getFileUpload', {
			base64: base64Data,
			type: getType,
			name : item.name.split('.')[0]
		});
		navigation.goBack();
	};

	/*FIXME: list file chat not show*/
	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			// const listFile = await RocketChat.getFiles({ roomId: room.rid, type: room.t, offset: 50 });
			const listMediaTemp: any = [];
			const listFilesTemp: any = [];
			const listLinksTemp: any = [];
			listFileRC.forEach(item => {
				if (
					(item.type === 'image/jpeg' || item.type === 'image/png') &&
					item?.typeGroup === 'image'
				) {
					listMediaTemp.push(item);
				}
				if(item.type === 'application/pdf')
				{
					listFilesTemp.push(item)
				}
			});
			setListMedia(listMediaTemp);
			setListFiles(listFilesTemp);
			setDoneLoadAnimation(true);
		});
	}, []);

	useEffect(() => {
		if (shareFile.length === select.length && shareFile.length>0) {
			setVisibleSnackBar(true);
		}
	}, [shareFile]);

	const renderListFile = (fileData,numColumns : number) => {
		return (
			<View style={{ flex: 1, padding: 8 }}>
				<FlatList
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					data={fileData}
					numColumns={numColumns}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ item, index }) => renderTypeContentMessage(item)}
				/>
			</View>
		);
	};

	const FirstRoute = () => renderListFile(listMedia,3);
	const SecondRoute = () => renderListFile(listFiles,1);
	const ThreeRoute = () => renderListFile(listLinks,2);


	const getPDFBase64 = async (item) =>{
		const response = await ReactNativeBlobUtil.fetch(
			'GET',
			`${DOMAIN_SERVER_CHAT}${item.path}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
		);
		const file_Type = item.name.split('.');
		const getType = file_Type[file_Type.length - 1];
		EventEmitter.emit('getFileUpload', {
			base64: response.base64(),
			type: getType,
			name: item.name.split('.')[0],
		});
		navigation.goBack();
	}

	const getFileOPDF = (item) =>{
		isUpload
			? getPDFBase64(item)
			: openLink(
					`${DOMAIN_SERVER_CHAT}${item.path}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
			  );
	}

	const renderTypeContentMessage = (item: IFileRC) => {
		switch (item.type) {
			case 'image/jpeg':
				return imageViewer(
					`${DOMAIN_SERVER_CHAT}${item.path}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
					item,
				);
			case 'image/png':
				return imageViewer(
					`${DOMAIN_SERVER_CHAT}${item.path}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
					item,
				);
			case 'application/pdf':
				return (
					<View>
						<TouchableOpacity
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() => getFileOPDF(item)}
						>
							<Image
								source={{ uri: 'https://img.icons8.com/bubbles/344/pdf-2.png' }}
								resizeMode="contain"
								style={{ width: 50, height: 50 }}
							/>
							<View style={{ maxWidth: '70%', marginLeft: 8 }}>
								<Text
									style={{
										color: colors.primary,
									}}
								>
									{item.name}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				);
			case 'text/plain':
				return (
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Image
							source={{
								uri: 'https://img.icons8.com/bubbles/344/documents.png',
							}}
							resizeMode="contain"
							style={{ width: 50, height: 50 }}
						/>
						<View style={{ maxWidth: '70%', marginLeft: 8 }}>
							<Text
								style={{
									color: colors.primary,
								}}
							>
								{item.name}
							</Text>
						</View>
					</View>
				);
			default:
				return <View />;
		}
	};




	const _getImage = url => {
		Platform.OS === 'ios' ? sharePDFWithIOS(url) : sharePDFWithAndroid(url);
	};

	const _buttonShareIOS = async () => {
		const optionsShare = {
			title: 'image',
			type: 'image/*',
			urls: shareFile,
		};
		await Share.open(optionsShare);
	};



	const _buttonShareAndroid = async () => {
		const optionsShare = {
			title: '',
			urls: shareFile,
			filename: `image`,
		};
		await Share.open(optionsShare);
	};

	const sharePDFWithIOS = async url => {
		const haveSelect = select.includes(url);
		// Define path to store file along with the extension
		const path = `${DocumentDirectoryPath}/${url.split('/')[5]}.jpeg`;
		const headers = {
			Accept: 'image/*',
			'Content-Type': 'image/*',
			Authorization: `Bearer [token]`,
		};
		// Define options
		const options: DownloadFileOptions = {
			fromUrl: url,
			toFile: path,
			headers,
		};
		// Call downloadFile
		haveSelect ? null : await downloadFile(options).promise;
		haveSelect
			? setShareFile(shareFile.filter(item => item !== path))
			: setShareFile(item => [...item, path]);
	};

	const sharePDFWithAndroid = async url => {
		// Define path to store file along with the extension
		const haveSelect = select.includes(url);
		const path = `${DocumentDirectoryPath}/${url.split('/')[5]}.jpeg`;
		const headers = {
			Accept: 'image/*',
			'Content-Type': 'image/*',
			Authorization: `Bearer [token]`,
		};
		// Define options
		const options: DownloadFileOptions = {
			fromUrl: url,
			toFile: path,
			headers,
		};
		// Call downloadFile
		haveSelect ? null : await downloadFile(options).promise;
		const base64Data = await readFile(path, 'base64');
		haveSelect
			? setShareFile(
					shareFile.filter(
						item => item !== `data:image/jpeg;base64,` + base64Data,
					),
			  )
			: setShareFile(item => [...item, `data:image/jpeg;base64,` + base64Data]);
	};

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
		three: ThreeRoute,
	});

	const renderTabBar = (
		propsData: SceneRendererProps & { navigationState },
	) => {
		return (
			<TabBar
				{...propsData}
				scrollEnabled
				indicatorStyle={{
					borderBottomColor: colors.primary,
					borderBottomWidth: 4,
				}}
				style={{ backgroundColor: '#fff' }}
				tabStyle={{ width: initialLayout.width / 3 }}
				labelStyle={{ fontWeight: '600', textTransform: undefined }}
				activeColor={colors.primary}
				inactiveColor={'#a1a1aa'}
			/>
		);
	};


	//LAZY LOADING


	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				<View style={{ zIndex: 2 }}>
					<Header
						title="Stored Media"
						isShowButtonImage={true}
						buttonImageName={'share-social-outline'}
						labelButton={'Share'}
						disabled={shareFile.length > 0 ? false : true}
						onPressButton={() =>
							Platform.OS === 'ios' ? _buttonShareIOS() : _buttonShareAndroid()
						}
					/>
					{/* <CustomModalMessage
						title="Success!"
						isVisible={true}
						// jsonPath={require('../assets/animations/success-checkmark.json')}
					/> */}
				</View>

				{doneLoadAnimation ? (
					<TabView
						navigationState={{ index: indexTab, routes }}
						renderScene={renderScene}
						renderTabBar={renderTabBar}
						onIndexChange={setIndexTab}
						initialLayout={initialLayout}
						// style={{ marginTop: StatusBar.currentHeight }}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View>
			<Snackbar
				visible={visibleSnackBar}
				onDismiss={() => setVisibleSnackBar(false)}
				duration={1000}
				// action={{
				// 	label: 'OK',
				// 	onPress: () => {
				// 		setVisibleSnackBar(false);
				// 	},
				// }}
			>
				{'Success!'}
			</Snackbar>
		</View>
	);
}
