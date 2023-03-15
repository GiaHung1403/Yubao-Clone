import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BlurView } from '@react-native-community/blur';
import {
	ActivityIndicator,
	Alert,
	Image,
	InteractionManager,
	PermissionsAndroid,
	Platform,
	View,
	Dimensions,
	SafeAreaView,
	Text,
} from 'react-native';
import RNFS, {
	DocumentDirectoryPath,
	downloadFile,
	DownloadFileOptions,
	readFile,
} from 'react-native-fs';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import { WebView } from 'react-native-webview';

import Header from '@components/Header';
import Color from '@config/Color';
import { useTheme } from 'react-native-paper';
import ReactNativeBlobUtil from 'react-native-blob-util';
// import ViewShot from 'react-native-view-shot';
import { flex, height } from 'styled-system';
import RNImageToPdf from 'react-native-image-to-pdf';
import { DOMAIN_API_CHAT_NEW } from '@data/Constants';
// import { usePreventScreenCapture } from 'expo-screen-capture';

// import RNFetchBlob from 'rn-fetch-blob';

export function WebviewScreen(props: any) {
	const navigation: any = useNavigation();
	const { url, title, isShowButton, isHTML, isPDF } = props.route.params;

	console.log('====================================');
	console.log(url);
	console.log('====================================');
	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [visibleLoading, setVisibleLoading] = useState(true);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			// setDoneLoadAnimated(true);
			if (!url) {
				Alert.alert('Alert', 'Something wrong! Please try again!', [
					{ text: 'OK', onPress: () => navigation.goBack() },
				]);
			}
		});
	}, []);

	const _onPressButtonShare = () => {
		Platform.OS === 'ios' ? sharePDFWithIOS() : sharePDFWithAndroid();
	};

	const LoadingIndicatorView = style => {
		return (
			<View style={[{ flex: 1 }, style, { backgroundColor: 'transparent' }]}>
				<ActivityIndicator color={Color?.main} size="large" />
			</View>
		);
	};

	// const sharePDFWithIOS = async () => {
	// 	// Define path to store file along with the extension
	// 	const path = `${DocumentDirectoryPath}/${title}.pdf`;
	// 	const headers = {
	// 		Accept: 'application/pdf',
	// 		'Content-Type': 'application/pdf',
	// 		Authorization: `Bearer [token]`,
	// 	};

	// 	// Define options
	// 	const options: DownloadFileOptions = {
	// 		fromUrl: url,
	// 		toFile: path,
	// 		headers,
	// 	};
	// 	// Call downloadFile
	// 	// await downloadFile(options).promise;
	// 	const response = await downloadFile(options);

	// 	response.promise.then(async res => {
	// 		if (res && res.statusCode === 200 && res.bytesWritten > 0 ) {
	// 			console.log(res);
	// 		} else {
	// 			console.log(res, url);
	// 		}
	// 	});

	// 	const optionsShare = {
	// 		title: '',
	// 		type: 'application/pdf',
	// 		url: path,
	// 	};
	// 	await Share.open(optionsShare);
	// 	// remove the image or pdf from device's storage
	// 	await RNFS.unlink(path);
	// };

	const sharePDFWithIOS = async () => {
		setDoneLoadAnimated(true);
		const convertURL = url.includes('quotationofferprint')
			? url
					.toLowerCase()
					.replace('http://leasesys', 'https://system.chailease.com.vn/')
			: url;
		ReactNativeBlobUtil.config({
			fileCache: true,
			path:
				ReactNativeBlobUtil.fs.dirs.DocumentDir +
				`/${props.route.params.title}.pdf`,
		})
			.fetch(
				'GET',
				!url.includes('quotationofferprint')
					? convertURL
					: `${DOMAIN_API_CHAT_NEW}/api/convertPDF?url=${convertURL}`,
				{
					// some headers ..
				},
			)
			.then(async res => {
				const path = res.path();
				const options = {
					type: 'application/pdf',
					url: path,
					message: '',
					title: '',
				};
				setDoneLoadAnimated(false);
				await Share.open(options);
				// remove the image or pdf from device's storage
				await RNFS.unlink(path);
			});

		// const path = `${DocumentDirectoryPath}/${props.route.params.title}.png`;
		// // const headers = {
		// // 	Accept: 'application/pdf',
		// // 	'Content-Type': 'application/pdf',
		// // 	Authorization: `Bearer [token]`,
		// // };

		// const headers = {
		// 	Accept: 'image/*',
		// 	'Content-Type': 'image/*',
		// 	Authorization: `Bearer [token]`,
		// };
		// // Define options
		// const options: DownloadFileOptions = {
		// 	fromUrl:
		// 		'http://api.chailease.com.vn:9999/mk/quotationofferprint.aspx?id=114516&type=1',
		// 	toFile: path,
		// 	headers,
		// };
		// // Call downloadFile
		// await downloadFile(options).promise;
		// const test = await downloadFile(options).promise;
		// console.log('====================================');
		// console.log({ test, path });
		// console.log('====================================');

		// const optionsShare = {
		// 	title: 'pdf',
		// 	type: 'application/pdf',
		// 	url: path,
		// };
		// await Share.open(optionsShare);
	};

	// const sharePDFWithAndroid = async () => {
	// 	// Define path to store file along with the extension
	// 	const path = `${DocumentDirectoryPath}/${title}.pdf`;
	// 	const headers = {
	// 		Accept: 'application/pdf',
	// 		'Content-Type': 'application/pdf',
	// 		Authorization: `Bearer [token]`,
	// 	};
	// 	// Define options
	// 	const options: DownloadFileOptions = {
	// 		fromUrl: url,
	// 		toFile: path,
	// 		headers,
	// 	};
	// 	// Call downloadFile
	// 	await downloadFile(options).promise;
	// 	const base64Data = await readFile(path, 'base64');
	// 	const optionsShare = {
	// 		title: '',
	// 		url: `data:application/pdf;base64,` + base64Data,
	// 		filename: `${title}`,
	// 	};
	// 	await Share.open(optionsShare);
	// 	// remove the image or pdf from device's storage
	// };
	// usePreventScreenCapture();

	const sharePDFWithAndroid = async () => {
		const convertURL = url.includes('quotationofferprint')
			? url
					.toLowerCase()
					.replace('http://leasesys', 'https://system.chailease.com.vn/')
			: url;

		let filePath = '';
		const configOptions = {
			fileCache: true,
		};
		ReactNativeBlobUtil.config(configOptions)
			.fetch(
				'GET',
				!url.includes('quotationofferprint')
					? convertURL
					: `${DOMAIN_API_CHAT_NEW}/api/convertPDF?url=${convertURL}`,
			)
			.then(resp => {
				filePath = resp.path();
				return resp.readFile('base64');
			})
			.then(async base64Data => {
				base64Data = `data:application/pdf;base64,` + base64Data;
				await Share.open({
					message: '',
					title: '',
					url: base64Data,
					filename: `${props.route.params.title}`,
				});
				// remove the image or pdf from device's storage
				await RNFS.unlink(filePath);
			});
		// remove the image or pdf from device's storage
		// await RNFS.unlink(path);
	};

	const full = useRef<any>();

	const checkAndroidPermission = async () => {
		try {
			const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
			await PermissionsAndroid.request(permission);
			await Promise.resolve();

			// const permission2 = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
			// await PermissionsAndroid.request(permission2);
			// await Promise.resolve();
		} catch (error) {
			await Promise.reject(error);
		}
	};

	const onCapture_Android = useCallback(async () => {
		// await checkAndroidPermission();
		full.current.capture().then(async uri => {
			const path = `${DocumentDirectoryPath}/${title}.pdf`;
			// console.log(uri);
			const options = {
				imagePaths: [`data:image/jpg;base64,` + uri],
				name: 'PDFName',
				quality: 0.9, // optional compression paramter
			};
			// const pdf = await RNImageToPdf.createPDFbyImages(options);
			// console.log(pdf, 'ahihi');

			await Share.open({
				type: 'image/jpg',
				message: '',
				title: '',
				url: `data:image/jpg;base64,` + uri,
				filename: `${props.route.params.title}`,
			});

			// const optionsShare = {
			// 	title: 'pdf',
			// 	type: 'application/pdf',
			// 	url: `${pdf.filePath}`,
			// };
			// await Share.open(optionsShare);
		});
	}, []);

	// const dimension = { width: Dimensions.get('window').width, height: 1000 };

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header
					title={title}
					isShowButton={isShowButton}
					labelButton="Share"
					onPressButton={() => _onPressButtonShare()}
				/>
			</View>
			{doneLoadAnimated && (
				<ActivityIndicator
					color={Color?.main}
					size="large"
					style={{
						position: 'absolute',
						top: '50%',
						left: '45%',
						alignSelf: 'center',
						zIndex: 2,
					}}
				/>
			)}

			{!url ? (
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<Text>No data!</Text>
				</View>
			) : isPDF || (url.includes('.pdf') && !isHTML) ? (
				<Pdf
					trustAllCerts={false}
					source={{
						uri: url,
					}}
					style={{ flex: 1 }}
					onError={error => {
						console.log('====================================');
						console.log({ error });
						console.log('====================================');
						Alert.alert('Thông báo', 'Dữ liệu chưa được cập nhật');
					}}
				/>
			) : (
				<View style={{ flex: 1 }}>
					{/* <ViewShot
							ref={full}
							options={{
								fileName: 'Print',
								format: 'jpg',
								quality: 1.0,
								result: 'base64',
							}}
							style={dimension}
						> */}
					<WebView
						style={{ zIndex: 1 }}
						source={
							isHTML
								? { html: `<html lang="">${url}</html>` }
								: {
										// uri: url,
										uri: url.includes('quotationofferprint')
											? url.replace(
													'http://leasesys',
													'http://api.chailease.com.vn:9999',
											  )
											: url,
								  }
						}
						startInLoadingState
						javaScriptEnabled={true}
						domStorageEnabled={true}
						sharedCookiesEnabled={true}
						mixedContentMode="compatibility"
						renderLoading={() => LoadingIndicatorView({})}
						// startInLoadingState={true}
					/>
					{/* </ViewShot> */}
				</View>
			)}
		</View>
	);
}
