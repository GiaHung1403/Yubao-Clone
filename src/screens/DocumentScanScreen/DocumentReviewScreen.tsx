import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useRef, useState } from 'react';
import {
	Alert,
	Dimensions,
	FlatList,
	Image,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import RNImageToPdf from 'react-native-image-to-pdf';
import { Card, FAB, useTheme } from 'react-native-paper';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { Ionicons } from '@expo/vector-icons';
import ImageViewerComponent from './ImageViewerComponent';

const deviceHeight = () => Dimensions.get('screen').height;
const deviceWidth = () => Dimensions.get('screen').width;

export function DocumentReviewScreen(props: any) {
	const navigation: any = useNavigation();
	const { listImage } = props.route.params;
	const imageViewerRef = useRef<any>();
	const { colors } = useTheme();
	const [listImageCopy, setListImageCopy] = useState(listImage);
	const [loading, setLoading] = useState(false);

	const myAsyncPDFFunction = async () => {
		setLoading(true);
		try {
			const options = {
				imagePaths: listImageCopy.map(image => {
					let uriRename = '';
					if (Platform.OS === 'android') {
						uriRename = image.replace('file:', '');
					} else {
						uriRename = image;
					}
					return uriRename;
				}),
				name: 'PDF_File_Convert',
				maxSize: {
					// optional maximum image dimension - larger images will be resized
					width: 900,
					height: Math.round((deviceHeight() / deviceWidth()) * 900),
				},
				quality: 0.5, // optional compression paramter
			};
			const pdf = await RNImageToPdf.createPDFbyImages(options);
			setLoading(false);
			navigation.navigate('DocumentPDFViewScreen', {
				urlPDF: pdf.filePath,
				isShowButton: true,
			});
		} catch (e: any) {
			setLoading(false);
			Alert.alert('Error', e.message);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<StatusBar
				backgroundColor="transparent"
				barStyle="light-content"
				hidden={false}
			/>
			<View style={{ zIndex: 1 }}>
				<Header
					title="Confirm Image"
					onPressButtonBack={() =>
						navigation.navigate('DocumentScanScreen', {
							listImageModified: listImageCopy,
						})
					}
				/>
			</View>

			{loading ? (
				<LoadingFullScreen />
			) : (
				<FlatList
					style={{ flex: 1, padding: 8 }}
					data={listImageCopy}
					extraData={listImage}
					numColumns={3}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ item, index }) => (
						<Card
							elevation={2}
							style={{
								flex: 1,
								height: 120,
								marginLeft: index % 3 === 0 ? 0 : 8,
								marginBottom: 8,
							}}
							onPress={() => imageViewerRef.current.onShowViewer(item)}
						>
							<View style={{ position: 'relative' }}>
								<Image
									source={{ uri: item }}
									resizeMode="cover"
									style={{ width: '100%', height: '100%' }}
								/>

								<TouchableOpacity
									style={{ zIndex: 1, position: 'absolute', top: 0, right: 0 }}
									onPress={() =>
										setListImageCopy(listOld => {
											const listImageOld = [].concat(listOld);
											listImageOld.splice(index, 1);
											return listImageOld;
										})
									}
								>
									<Icon
										as={Ionicons}
										name="close-circle-outline"
										size={6}
										color={colors.primary}
									/>
								</TouchableOpacity>
							</View>
						</Card>
					)}
				/>
			)}

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB icon="file-pdf-box" onPress={() => myAsyncPDFFunction()} />
			</SafeAreaView>

			<ImageViewerComponent
				ref={ref => {
					imageViewerRef.current = ref;
				}}
			/>
		</View>
	);
};
