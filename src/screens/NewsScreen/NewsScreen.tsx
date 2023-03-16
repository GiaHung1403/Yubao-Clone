// import Color from '@config/Color';
// import { Icon } from 'native-base';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
// 	ActivityIndicator,
// 	Alert,
// 	InteractionManager,
// 	PermissionsAndroid,
// 	Platform,
// 	SafeAreaView,
// 	Text,
// 	TouchableOpacity,
// 	View,
// } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import { Card, useTheme } from 'react-native-paper';
// import YouTube from 'react-native-youtube';
import ytdl from 'react-native-ytdl';

import HeaderBanner from '@components/HeaderBanner';
// import Toast from '@components/Toast';
// import { EventEmitterEnum } from '@models/EventEmitterEnum';
// import EventEmitter from '@utils/events';
// import openLink from '@utils/openLink';
import * as FileSystem from 'expo-file-system';
import Share from 'react-native-share';
// import NewsScreens from './NewsComponent';
// import NewsSlideComponent from './NewsSlideComponent';
// import styles from './styles';
// import ImageViewerCustom from '@components/ImageViewerCustom';
// import { useNavigation } from '@react-navigation/native';
// import { getChaileaseNews, getMarketNews } from '@data/api'
import Color from '@config/Color';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import CameraRoll from '@react-native-community/cameraroll';
import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	InteractionManager,
	PermissionsAndroid,
	Platform,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import YouTube from 'react-native-youtube';
import { getChaileaseNews, getMarketNews } from '@data/api';

// import HeaderBanner from './HeaderBanner';
import NewsScreens from './NewsComponent';
import NewsSlideComponent from './NewsSlideComponent';
import styles from './styles';
import { Icon } from 'native-base';
import { EventEmitterEnum } from '@models/EventEmitterEnum';
import EventEmitter from '@utils/events';

interface INew {
	id: number;
	date: string;
	author: string;
	cat_id: number;
	cat_name: string;
	focus: number;
	title: string;
	desc: string;
	content: string;
	url: string;
	imageUrl: string;
}

let playing: boolean = false;
let playing_2: boolean = false;

export function NewsScreen(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [chaileaseBlogs, setChaileaseBlogs] = useState<{
		chailease: INew[];
		markets: INew[];
	}>({
		chailease: [],
		markets: [],
	});
	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const responseChailease: any = await getChaileaseNews();
			const responseMarket: any = await getMarketNews();
			setChaileaseBlogs({
				chailease: responseChailease,
				markets: responseMarket,
			});
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressItemNews = ({ title, url }) => {
		navigation.navigate('WebviewScreen', {
			title,
			url,
		});
	};

	const checkAndroidPermission = async () => {
		try {
			const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
			await PermissionsAndroid.request(permission);
			await Promise.resolve();
		} catch (error) {
			await Promise.reject(error);
		}
	};

	const handleDownload = async url => {
		if (Platform.OS === 'android') {
			await checkAndroidPermission();
		}
		downloadImage(url).then();
	};

	const callback = progress => {
		return null;
	};

	const getURLVideo = async urlVideo => {
		return await ytdl(urlVideo, { quality: 'highestaudio' });
	};

	const downloadResumable = url => {
		return FileSystem.createDownloadResumable(
			url,
			FileSystem.documentDirectory + 'video.mp4',
			{},
			callback,
		);
	};

	const downloadImage = async url => {
		try {
			// @ts-ignore
			const urlVideo = await getURLVideo(url);
			const { uri } = (await downloadResumable(
				urlVideo[0].url,
			).downloadAsync()) as any;
			CameraRoll.save(uri, {
				type: 'auto',
				album: 'Yubao',
			}).then(() => {
				EventEmitter.emit(EventEmitterEnum.TOAST, {
					message: 'Download video success!',
				});
			});
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	const shareVideo = url => {
		const options = {
			title: 'Video',
			type: 'application/pdf',
			url,
		};
		Share.open(options).then();
	};

	//backgroundColor: '#E5E5E5'

	const onStateChange = useCallback(state => {
		if (state === 'ended') {
			playing = false;
			// setPlaying(false);
			Alert.alert('video has finished playing!');
		}
	}, []);

	return (
		<View style={styles.container}>
			<HeaderBanner />

			<View style={{ flex: 1 }}>
				{doneLoadAnimated ? (
					<ScrollView style={styles.containerBody}>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View style={styles.containerNewsSlide}>
								{[
									...chaileaseBlogs.chailease.slice(0, 3),
									...chaileaseBlogs.markets.slice(0, 3),
								].map((item, index) => (
									<NewsSlideComponent
										key={item.id}
										news={item}
										onPress={() =>
											_onPressItemNews({ title: item.title, url: item?.url })
										}
									/>
								))}
							</View>
						</ScrollView>

						<View style={styles.containerNews}>
							<View style={styles.containerContentNews}>
								<Text style={styles.labelContentNews}>Chailease Videos</Text>

								<Card elevation={2}>
									<View style={{ overflow: 'hidden', borderRadius: 4 }}>
										{Platform.OS === 'ios' ? (
											<YouTube
												origin="https://www.youtube.com"
												videoId="30741zlogHY" // The YouTube video ID
												play={false} // control playback of video with true/false
												fullscreen // control whether the video should play in fullscreen or inline
												style={{ alignSelf: 'stretch', height: 200 }}
												apiKey={''}
											/>
										) : (
											<YoutubePlayer
												height={200}
												play={playing}
												videoId={'30741zlogHY'}
												onChangeState={onStateChange}
												webViewStyle={{ opacity: 0.99 }}
											/>
										)}

										<View style={{ padding: 8 }}>
											<Text
												style={{
													marginTop: 12,
													fontWeight: '600',
													color: '#3e3e3e',
												}}
											>
												Giới thiệu Chailease Việt Nam 2021
											</Text>
											<Text
												style={{ fontSize: 12, color: '#888', marginTop: 4 }}
											>
												26 thg 7, 2021
											</Text>
											<View
												style={{
													justifyContent: 'flex-end',
													flexDirection: 'row',
												}}
											>
												<TouchableOpacity
													onPress={() =>
														shareVideo(
															'https://www.youtube.com/watch?v=30741zlogHY',
														)
													}
													style={{
														flexDirection: 'row',
														alignItems: 'center',
													}}
												>
													<Icon
														as={Ionicons}
														name={'share-social-outline'}
														size={7}
														color={colors.primary}
													/>
													<Text
														style={{
															marginLeft: 4,
															fontWeight: '600',
															color: '#3e3e3e',
														}}
													>
														Share
													</Text>
												</TouchableOpacity>

												<TouchableOpacity
													onPress={() =>
														handleDownload(
															'https://www.youtube.com/watch?v=30741zlogHY',
														)
													}
													style={{
														flexDirection: 'row',
														alignItems: 'center',
														marginLeft: 20,
													}}
												>
													<Icon
														as={Ionicons}
														name={'cloud-download-outline'}
														size={7}
														color={Color.approved}
													/>
													<Text
														style={{
															marginLeft: 4,
															fontWeight: '600',
															color: '#3e3e3e',
														}}
													>
														Download
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>
								</Card>

								<Card elevation={2} style={{ marginTop: 12 }}>
									<View style={{ overflow: 'hidden', borderRadius: 4 }}>
										{Platform.OS === 'ios' ? (
											<YouTube
												origin="https://www.youtube.com"
												videoId="TjtHF-P9guY" // The YouTube video ID
												play={false} // control playback of video with true/false
												fullscreen // control whether the video should play in fullscreen or inline
												loop // control whether the video should loop when ended
												style={{ alignSelf: 'stretch', height: 200 }}
												apiKey={''}
											/>
										) : (
											<YoutubePlayer
												height={220}
												play={playing_2}
												videoId={'TjtHF-P9guY'}
												onChangeState={state => {
													if (state === 'ended') {
														playing_2 = false;
														Alert.alert('video has finished playing!');
													}
												}}
												webViewStyle={{ opacity: 0.99 }}
											/>
										)}
										<View style={{ padding: 8 }}>
											<Text
												style={{
													marginTop: 12,
													fontWeight: '600',
													color: '#3e3e3e',
												}}
											>
												Hoạt động thiện nguyện của Chailease Việt Nam trong mùa
												COVID
											</Text>
											<Text
												style={{ fontSize: 12, color: '#888', marginTop: 4 }}
											>
												16 thg 7, 2021
											</Text>
											<View
												style={{
													justifyContent: 'flex-end',
													flexDirection: 'row',
												}}
											>
												<TouchableOpacity
													onPress={() =>
														shareVideo(
															'https://www.youtube.com/watch?v=TjtHF-P9guY',
														)
													}
													style={{
														flexDirection: 'row',
														alignItems: 'center',
													}}
												>
													<Icon
														as={Ionicons}
														name={'share-social-outline'}
														size={7}
														color={colors.primary}
													/>
													<Text
														style={{
															marginLeft: 4,
															fontWeight: '600',
															color: '#3e3e3e',
														}}
													>
														Share
													</Text>
												</TouchableOpacity>

												<TouchableOpacity
													onPress={() =>
														handleDownload(
															'https://www.youtube.com/watch?v=TjtHF-P9guY',
														)
													}
													style={{
														flexDirection: 'row',
														alignItems: 'center',
														marginLeft: 20,
													}}
												>
													<Icon
														as={Ionicons}
														name={'cloud-download-outline'}
														size={7}
														color={Color.approved}
													/>
													<Text
														style={{
															marginLeft: 4,
															fontWeight: '600',
															color: '#3e3e3e',
														}}
													>
														Download
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>
								</Card>
							</View>

							<View style={styles.containerContentNews}>
								<Text style={styles.labelContentNews}>Chailease News</Text>

								{chaileaseBlogs.chailease.slice(3, 9).map((item, index) => (
									<NewsScreens
										key={item.id}
										news={item}
										onPress={() =>
											_onPressItemNews({ title: item.title, url: item.url })
										}
									/>
								))}
							</View>

							<View style={styles.containerContentNews}>
								<Text style={styles.labelContentNews}>Market News</Text>

								{chaileaseBlogs.markets.slice(3, 9).map((item, index) => (
									<NewsScreens
										key={item.id}
										news={item}
										onPress={() =>
											_onPressItemNews({ title: item.title, url: item.url })
										}
									/>
								))}
							</View>
						</View>

						<SafeAreaView style={{ height: 8 }} />
					</ScrollView>
				) : (
					<View style={styles.loading}>
						<ActivityIndicator />
					</View>
				)}
			</View>
		</View>
	);
}
