import React, { useState, memo, useEffect } from 'react';
import {
	View,
	Text,
	useWindowDimensions,
	ScrollView,
	TouchableOpacity,
	Animated
} from 'react-native';
import { TabView } from 'react-native-tab-view';

import categories from '@data/categories';

import EmojiCategory from './EmojiCategory';
import TabBar from './TabBar';

import { emojisByCategory } from '@data/emojis';
import { useDimensions } from '@react-native-community/hooks';
import shortnameToUnicode from '@utils/shortnameToUnicode';
// import Animated from 'react-native-reanimated';

const EmojiPicker = ( props ) => {
	const layout = useWindowDimensions();
	const [index, setIndex] = useState(0);
	const { tabHeight, listMessageRef, room } = props;
	const [routes, setRoutes] = useState(
		categories.tabs.map(tab => ({ key: tab.category, title: tab.tabLabel })),
	);

	const { width } = useDimensions().screen;

	const renderScene = ({ route }) => <EmojiCategory category={route.key} />;

	return (
			<TabView
				renderTabBar={props => <TabBar setIndex={setIndex} {...props} />}
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				initialLayout={{ width: layout.width }}
				lazyPreloadDistance={true}
			/>

		// <ScrollView
		// 	style={{ paddingTop: 8, flex: 1 }}
		// 	showsVerticalScrollIndicator={false}
		// 	scrollEventThrottle={16}
		// 	// onScroll={Animated.event(
		// 	// 	[{ nativeEvent: { contentOffset: { y: tabHeight } } }],
		// 	// 	{ useNativeDriver: false },
		// 	// )}
		// 	// onScroll={()=>{
		// 	//     console.log('====================================');
		// 	//     console.log(insets);
		// 	//     console.log('====================================');
		// 	// }}
		// >
		// 	<Text
		// 		style={{
		// 			marginLeft: 8,
		// 			marginBottom: 4,
		// 			fontWeight: '500',
		// 			color: '#777',
		// 		}}
		// 	>
		// 		Yubao Emoji
		// 	</Text>
		// 	<View
		// 		style={{
		// 			flexDirection: 'row',
		// 			flex: 1,
		// 			flexWrap: 'wrap',
		// 		}}
		// 	>
		// 		{emojisByCategory.people.map((emoji, index) => (
		// 			<TouchableOpacity
		// 				key={index.toString()}
		// 				style={{
		// 					marginHorizontal: 2,
		// 					marginBottom: 8,
		// 					width: width / 6 - 16,
		// 					alignItems: 'center',
		// 				}}
		// 				onPress={() => {
		// 					EventEmitter.emit('showEmoji', {
		// 						value: `${message} ${`:${emoji}:`}`,
		// 						view: `${messageDisplay} ${shortnameToUnicode(`:${emoji}:`)}`,
		// 					});
		// 				}}
		// 			>
		// 				<Text style={{ fontSize: 35 }}>
		// 					{shortnameToUnicode(`:${emoji}:`)}
		// 				</Text>
		// 			</TouchableOpacity>
		// 		))}
		// 	</View>
		// </ScrollView>
	);
};

export default memo(EmojiPicker);
