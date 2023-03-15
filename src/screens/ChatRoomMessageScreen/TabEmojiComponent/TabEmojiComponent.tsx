import { useNavigation } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';

import {
	// SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Animated,
	useWindowDimensions,
	StatusBar,
	Platform,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';

import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { DOMAIN_SERVER_CHAT, getDomainAPIChat } from '@data/Constants';
import { RocketChat } from '@data/rocketchat';
import { IRoom, IUserLoginRC } from '@models/types';
import { generateHash } from '@utils';

import { emojisByCategory } from '@data/emojis';
import shortnameToUnicode from '@utils/shortnameToUnicode';
import { useDimensions } from '@react-native-community/hooks';
import CustomEmoji from '@components/EmojiPicker/CustomEmoji';
import {
	NavigationState,
	SceneMap,
	SceneRendererProps,
	TabBar,
	TabView,
} from 'react-native-tab-view';

import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';
import EventEmitter from '@utils/events';
// import { useKeyboard } from '@react-native-community/hooks';
// import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

const HEADER_HEIGHT = 340;
interface IRouteParams {
	room: IRoom;
}

type Route = {
	key: string;
	icon: string;
	isNormalEmoji?: boolean;
};
type State = NavigationState<Route>;

let message: string = '';
let messageDisplay: string = '';

export default function TabEmojiComponent(props: any) {
	let indexTab = 0;
	const { tabHeight, listMessageRef, room } = props;
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { width } = useDimensions().screen;
	const { colors } = useTheme();
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	const [listEmojiCustom, setListEmojiCustom] = useState<any[]>([]);

	const [routes] = React.useState([
		{ key: 'emoji', icon: 'smile', isNormalEmoji: true },
		{ key: 'kawaii', icon: 'smile_kawaii_custom' },
		{ key: 'team', icon: 'drink_beer_team_custom' },
		{ key: 'freemojis', icon: 'ok_hand_2_freemojis_custom' },
		{ key: 'zoo', icon: 'yay_zoo_custom' },
	]);

	const initialLayout = useWindowDimensions();

	useEffect(() => {
		(async function getData() {
			const data = await RocketChat.getListCustomEmoji();
			setListEmojiCustom(data.emojis);
		})();
	}, []);

	// const [indexTab, setIndexTab] = React.useState(0);

	const renderIcon = ({ route, color }: { route: Route; color: string }) =>
		route.isNormalEmoji ? (
			<Text style={{ fontSize: 30 }}>
				{shortnameToUnicode(`:${route.icon}:`)}
			</Text>
		) : (
			<CustomEmoji
				baseUrl={DOMAIN_SERVER_CHAT}
				style={[{ width: 30, height: 30 }]}
				emoji={{
					content: route.icon,
					name: route.icon,
					extension: 'png',
				}}
			/>
		);

	const renderTabBar = (
		props: SceneRendererProps & { navigationState: State },
	) => {
		return (
			<TabBar
				{...props}
				scrollEnabled={false}
				indicatorStyle={{ backgroundColor: '#ffeb3b' }}
				renderIcon={renderIcon}
				style={{ backgroundColor: '#fff' }}
			/>
		);
	};

	const renderScene = SceneMap({
		emoji: () => (
			<ScrollView
				style={{ paddingTop: 8 }}
				showsVerticalScrollIndicator={false}
				scrollEventThrottle={16}
				// onScroll={()=>{Animated.event(
				// 	[{ nativeEvent: { contentOffset: { y: offsetScroll } } }],
				// 	{ useNativeDriver: false },
				// );}}
			>
				<Text
					style={{
						marginLeft: 8,
						marginBottom: 4,
						fontWeight: '500',
						color: '#777',
					}}
				>
					Yubao Emoji
				</Text>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						flexWrap: 'wrap',
					}}
				>
					{emojisByCategory.people.map((emoji, index) => (
						<TouchableOpacity
							key={index.toString()}
							style={{
								alignSelf: 'center',
								marginHorizontal: 2,
								marginBottom: 8,
								width: width / 6 - 16,
							}}
							onPress={() => {
								EventEmitter.emit('showEmoji', {
									value: `${message} ${`:${emoji}:`}`,
									view: `${messageDisplay} ${shortnameToUnicode(`:${emoji}:`)}`,
								});
							}}
						>
							<Text style={{ fontSize: 35 }}>
								{shortnameToUnicode(`:${emoji}:`)}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		),
		kawaii: () => (
			<ScrollView style={{ paddingTop: 8 }}>
				<Text
					style={{
						marginLeft: 8,
						marginBottom: 4,
						fontWeight: '500',
						color: '#777',
					}}
				>
					Kawaii Emoji
				</Text>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						flexWrap: 'wrap',
						justifyContent: 'space-between',
					}}
				>
					{listEmojiCustom.map(
						(emoji, index) =>
							emoji.name.includes('kawaii') && (
								<TouchableOpacity
									key={index.toString()}
									style={{
										marginHorizontal: 8,
										marginBottom: 16,
										width: width / 4 - 24,
									}}
									onPress={async () => {
										const objectMess = {
											_id: '',
											_updatedAt: { $date: new Date().getTime() },
											channels: [],
											md: [
												{
													type: 'BIG_EMOJI',
													value: [
														{
															type: 'EMOJI',
															value: {
																type: 'PLAIN_TEXT',
																value: emoji.name,
															},
														},
													],
												},
											],
											mentions: [],
											msg: `:${emoji.name}:`,
											rid: room._id,
											ts: { $date: new Date().getTime() },
											u: {
												_id: dataUserRC.userId,
												name: dataUserRC.me.name,
												username: dataUserRC.me.username,
											},
											unread: true,
											urls: [],
										};

										listMessageRef.current.updateListMessage(objectMess);
										const objectParam = {
											_id: generateHash(17),
											rid: room.rid,
											msg: `:${emoji.name}:`,
											mentions: [],
										};
										await RocketChat.sendMessage(objectParam);
									}}
								>
									<CustomEmoji
										baseUrl={DOMAIN_SERVER_CHAT}
										style={[{ width: 60, height: 60 }]}
										emoji={{
											content: emoji.name,
											name: emoji.name,
											extension: emoji.extension,
										}}
									/>
								</TouchableOpacity>
							),
					)}
				</View>
			</ScrollView>
		),
		team: () => (
			<ScrollView style={{ paddingTop: 8 }}>
				<Text
					style={{
						marginLeft: 8,
						marginBottom: 4,
						fontWeight: '500',
						color: '#777',
					}}
				>
					Team Emoji
				</Text>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						flexWrap: 'wrap',
						justifyContent: 'space-between',
					}}
				>
					{listEmojiCustom.map(
						(emoji, index) =>
							emoji.name.includes('team') && (
								<TouchableOpacity
									key={index.toString()}
									style={{
										marginHorizontal: 8,
										marginBottom: 16,
										width: width / 4 - 24,
									}}
									onPress={async () => {
										const objectMess = {
											_id: '',
											_updatedAt: { $date: new Date().getTime() },
											channels: [],
											md: [
												{
													type: 'BIG_EMOJI',
													value: [
														{
															type: 'EMOJI',
															value: {
																type: 'PLAIN_TEXT',
																value: emoji.name,
															},
														},
													],
												},
											],
											mentions: [],
											msg: `:${emoji.name}:`,
											rid: room._id,
											ts: { $date: new Date().getTime() },
											u: {
												_id: dataUserRC.userId,
												name: dataUserRC.me.name,
												username: dataUserRC.me.username,
											},
											unread: true,
											urls: [],
										};

										listMessageRef.current.updateListMessage(objectMess);
										const objectParam = {
											_id: generateHash(17),
											rid: room.rid,
											msg: `:${emoji.name}:`,
											mentions: [],
										};
										await RocketChat.sendMessage(objectParam);
									}}
								>
									<CustomEmoji
										baseUrl={DOMAIN_SERVER_CHAT}
										style={[{ width: 60, height: 60 }]}
										emoji={{
											content: emoji.name,
											name: emoji.name,
											extension: emoji.extension,
										}}
									/>
								</TouchableOpacity>
							),
					)}
				</View>
			</ScrollView>
		),
		freemojis: () => (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Text
					style={{
						alignSelf: 'center',
						fontWeight: '600',
						fontSize: 25,
						color: colors.primary,
					}}
				>
					Coming Soon !!!!!!
				</Text>
				<CustomEmoji
					baseUrl={DOMAIN_SERVER_CHAT}
					style={[{ width: 150, height: 150, alignSelf: 'center' }]}
					emoji={{
						content: 'plot_team_custom',
						name: 'plot_team_custom',
						extension: 'png',
					}}
				/>
			</View>
		),
		zoo: () => (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Text
					style={{
						alignSelf: 'center',
						fontWeight: '600',
						fontSize: 25,
						color: colors.primary,
					}}
				>
					Coming Soon !!!!!!
				</Text>
				<CustomEmoji
					baseUrl={DOMAIN_SERVER_CHAT}
					style={[{ width: 150, height: 150, alignSelf: 'center' }]}
					emoji={{
						content: 'plot_team_custom',
						name: 'plot_team_custom',
						extension: 'png',
					}}
				/>
			</View>
		),
	});

	return (
		<Animated.View
			style={{
				backgroundColor: '#f5f5f5',
				height: tabHeight,
				// paddingTop : -100
			}}
		>
			<TabView
				navigationState={{ index: indexTab, routes }}
				renderScene={renderScene}
				renderTabBar={renderTabBar}
				onIndexChange={index => {
					indexTab = index;
				}}
				initialLayout={initialLayout}
				// style={{ marginTop: StatusBar.currentHeight }}
				style={{ marginBottom: -(StatusBar.currentHeight || 0) }}
			/>
		</Animated.View>
	);
}
