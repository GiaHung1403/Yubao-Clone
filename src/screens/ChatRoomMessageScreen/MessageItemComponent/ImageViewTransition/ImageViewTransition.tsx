import React, { useEffect, useRef } from 'react';
import {
	Animated,
	Image,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
	SharedElement,
	createSharedElementStackNavigator,
} from 'react-navigation-shared-element';
import { useNavigation } from '@react-navigation/native';
import { Modal } from 'native-base';
import ImageViewScreen from '@components/ImageViewScreen';

// import POSTS from './posts';
// import Button from './Button';
// import Icon from './Icon';

const SPACING = 15;
const POST_GUTTER_WIDTH = 2;

const ListScreen = ({ navigation }) => {
	const dimensions = useWindowDimensions();
	const imageWidth = dimensions.width / 2 - POST_GUTTER_WIDTH;

	return (
		<SafeAreaView style={styles.wrapper}>
			<View style={styles.wrapper}>
				<Text style={styles.listHeader}>Marketplace</Text>

				<View style={styles.posts}>
					{/* {POSTS.map((post, index) => ( */}
					<Pressable
						onPress={() =>
							navigation.navigate('Detail', {
								id: '1',
							})
						}
						style={{
							width: imageWidth,
						}}
					>
						<SharedElement id={'1'}>
							<Image
								source={{
									uri: 'https://i1-dulich.vnecdn.net/2021/05/27/xavier-portela-dubai-glow-2-1622087761.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=zpEojRsSC5lw_3noiyUkag',
								}}
								style={{
									height: 180,
									width: imageWidth,
									// marginRight: index % 2 === 1 ? 0 : POST_GUTTER_WIDTH,
									// marginLeft: index % 2 === 1 ? POST_GUTTER_WIDTH : 0,
									marginRight: POST_GUTTER_WIDTH,
									marginLeft: POST_GUTTER_WIDTH,
								}}
							/>
						</SharedElement>

						<View style={styles.postTexts}>
							<Text numberOfLines={1} style={styles.postHeader}>
								€{'ahihi'} · {'ahihi'}
							</Text>

							<Text numberOfLines={1} style={styles.postDescription}>
								{'testing'}
							</Text>
						</View>
					</Pressable>
					{/* ))} */}
				</View>
			</View>
		</SafeAreaView>
	);
};

const DetailScreen = ({ route, navigation }) => {
	const { id } = route.params;
	const safeInsets = useSafeAreaInsets();
	const opacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(opacity, {
			toValue: 1,
			duration: 250,
			delay: 500,
			useNativeDriver: true,
		}).start();
	}, []);

	return (
		<View style={styles.wrapper}>
			<Animated.View
				style={{
					opacity,
					position: 'absolute',
					top: safeInsets.top + SPACING,
					left: safeInsets.left + SPACING,
					right: safeInsets.right + SPACING,
					zIndex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				{/* <Icon name="x" onPress={() => navigation.goBack()} />
				<Icon name="more-horizontal" /> */}
			</Animated.View>

			<SharedElement id={id}>
				<Image
					source={{
						uri: 'https://i1-dulich.vnecdn.net/2021/05/27/xavier-portela-dubai-glow-2-1622087761.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=zpEojRsSC5lw_3noiyUkag',
					}}
					style={styles.postImage}
				/>
			</SharedElement>

			<View style={styles.postDetails}>
				<Text style={styles.postTitle}>{'ahihi'}</Text>

				<Text style={styles.postPrice}>€{'ahihi'}</Text>

				{/* <Button title="Contact Seller" style={styles.postContactButton} /> */}

				<Animated.Text
					style={{
						opacity,
						fontSize: 17,
					}}
				>
					{'ahsoghsafhaf'}
				</Animated.Text>
			</View>
		</View>
	);
};

const Stack = createSharedElementStackNavigator();

const MainScreen = () => (
	<View style={{ flex: 1, height: 500, width: 1000 }}>
		<Stack.Navigator mode="modal" screenOptions={{ headerShown: true }}>
			<Stack.Screen name="List" component={ListScreen} />
			<Stack.Screen
				name="Detail"
				component={ImageViewScreen}
				sharedElements={route => {
					return ['1'];
				}}
			/>
		</Stack.Navigator>
	</View>
	// <View>
	//    <ListScreen/>
	// </View>
);

export default function ImageViewTransition() {
	return (
		<View>
			<MainScreen />
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	listHeader: {
		fontSize: 28,
		fontWeight: '800',
		margin: SPACING,
	},
	posts: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	postTexts: {
		margin: 10,
		marginBottom: 15,
	},
	postHeader: {
		fontWeight: '600',
	},
	postDescription: {
		color: 'gray',
	},
	postImage: {
		height: 300,
		width: '100%',
	},
	postDetails: {
		paddingVertical: 10,
		paddingHorizontal: SPACING,
	},
	postTitle: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	postPrice: {
		fontSize: 24,
	},
	postContactButton: {
		marginVertical: SPACING,
	},
});
