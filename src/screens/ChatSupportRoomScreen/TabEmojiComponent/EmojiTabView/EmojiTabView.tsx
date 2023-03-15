import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Icon } from 'native-base';

import React, {
	useEffect,
	useMemo,
	useRef,
	useState,
	useCallback,
	useImperativeHandle,
} from 'react';

import {
	Alert,
	Platform,
	// SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Animated,
	useWindowDimensions,
	StatusBar,
} from 'react-native';

// import ImagePicker, {
// 	Image,
// 	ImageOrVideo,
// 	Options,
// } from 'react-native-image-crop-picker';
import { Card, Menu, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { clearUserTyping, setUserTyping } from '@actions/message_action';
import { getListRoomMemberRC } from '@actions/room_rc_action';
import ActionSheet from '@components/ActionSheet/ActionSheet';
import HeaderRoom from '@components/HeaderRoom';
import { getInfoUserRC, getListRoomMessageRC, upLoadFileRC } from '@data/api';
import { DOMAIN_SERVER_CHAT, getDomainAPIChat } from '@data/Constants';
import { RocketChat } from '@data/rocketchat';
import { FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { RoomType } from '@models/RoomTypeEnum';
import {
	IMemberRoom,
	IMessage,
	IPinMessage,
	IRoom,
	IUserLoginRC,
} from '@models/types';
import { generateHash } from '@utils';
import openLink from '@utils/openLink';

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
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';
import { hasNotch } from 'react-native-device-info';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import EventEmitter from '@utils/events';
// import { useKeyboard } from '@react-native-community/hooks';
// import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { flex } from 'styled-system';

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
let formattedContent: any = '';
let currentPointer: number = 0;

export default function EmojiTabView(props: any) {
	const { tabHeight, listMessageRef, room } = props;
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { width } = useDimensions().screen;
	const { colors } = useTheme();
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	const [listEmojiCustom, setListEmojiCustom] = useState<any[]>([]);
	const insets = useSafeAreaInsets();
	// const [tabHeight , setTabHeight] = useState(-47)
	//  const scrollListener = useRef(
	// 			new Animated.Value(tabHeight),
	// 		).current;

	const [routes] = React.useState([
		{ key: 'emoji', icon: 'smile', isNormalEmoji: true },
		{ key: 'kawaii', icon: 'smile_kawaii_custom' },
		{ key: 'freemojis', icon: 'ok_hand_2_freemojis_custom' },
		{ key: 'team', icon: 'drink_beer_team_custom' },
		{ key: 'zoo', icon: 'yay_zoo_custom' },
	]);

	const initialLayout = useWindowDimensions();

	useEffect(() => {
		(async function getData() {
			const data = await RocketChat.getListCustomEmoji();
			setListEmojiCustom(data.emojis);
		})();
	}, []);

	const [indexTab, setIndexTab] = React.useState(0);

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
								marginHorizontal: 8,
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
					{listEmojiCustom.map((emoji, index) => (
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
					))}
				</View>
			</ScrollView>
		),
		freemojis: () => null,
		team: () => null,
		zoo: () => null,
	});

	return (
		<View
			style={{
				backgroundColor: '#f5f5f5',
                flex : 1
			}}
		>
			<TabView
				navigationState={{ index: indexTab, routes }}
				renderScene={renderScene}
				renderTabBar={renderTabBar}
				onIndexChange={setIndexTab}
				initialLayout={initialLayout}
                lazy={false}
				// style={{ marginTop: StatusBar.currentHeight }}
			/>
		</View>
	);
}
