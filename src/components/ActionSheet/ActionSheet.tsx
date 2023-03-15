import { useBackHandler } from '@react-native-community/hooks';
import React, {
	forwardRef,
	isValidElement,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Image, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
	Easing,
	Extrapolate,
	interpolateNode,
	Value,
} from 'react-native-reanimated';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';

import { useTheme } from 'react-native-paper';
import AvatarBorder from '../AvatarBorder';
import styles, { ITEM_HEIGHT } from './styles';
import shortnameToUnicode from '@utils/shortnameToUnicode';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DOMAIN_SERVER_CHAT } from '@data/Constants';

const getItemLayout = (data, index) => ({
	length: ITEM_HEIGHT,
	offset: ITEM_HEIGHT * index,
	index,
});

const ANIMATION_DURATION = 250;

const ANIMATION_CONFIG = {
	duration: ANIMATION_DURATION,
	// https://easings.net/#easeInOutCubic
	// easing: Easing.bezier(0.645, 0.045, 0.355, 1.0),
	easing: null,
};

const ActionSheet = React.memo(
	forwardRef(({ children }, ref) => {
		const bottomSheetRef = useRef<any>();
		const [data, setData] = useState<any>({});
		const [isVisible, setVisible] = useState(false);

		const navigation = useNavigation<StackNavigationProp<any>>();
		const { colors } = useTheme();
		/*
		 * if the action sheet cover more
		 * than 60% of the whole screen
		 * and it's not at the landscape mode
		 * we'll provide more one snap
		 * that point 50% of the whole screen
		 */
		const snaps = ['50%', '100%'];
		const openedSnapIndex = snaps.length > 2 ? 1 : 0;
		const closedSnapIndex = snaps.length - 1;

		const toggleVisible = () => setVisible(!isVisible);

		const hide = () => {
			bottomSheetRef.current?.snapTo(closedSnapIndex);
		};

		const show = options => {
			setData(options);
			toggleVisible();
		};

		const onBackdropPressed = ({ nativeEvent }) => {
			if (nativeEvent.oldState === State.ACTIVE) {
				hide();
			}
		};

		useBackHandler(() => {
			if (isVisible) {
				hide();
			}
			return isVisible;
		});

		useEffect(() => {
			if (isVisible) {
				Keyboard.dismiss();
				//Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).then();
				bottomSheetRef.current?.snapTo(openedSnapIndex);
			}
		}, [isVisible]);

		// Hides action sheet when orientation changes

		useImperativeHandle(ref, () => ({
			showActionSheet: show,
			hideActionSheet: hide,
		}));

		const renderHandle = useCallback(
			() => (
				<>{isValidElement(data?.customHeader) ? data.customHeader : null}</>
			),
			[],
		);

		const animatedPosition = React.useRef(new Value(0));
		const opacity = interpolateNode(animatedPosition.current, {
			inputRange: [0, 1],
			outputRange: [0, 0.7],
			extrapolate: Extrapolate.CLAMP,
		});

		const getEmoji = (item,index)=>{
			if(item.includes('custom'))
			{
				const temp2 = item.split(' ')
				return temp2.map((a,b)=>{
					if (a.includes('custom'))
					{
						const temp = a.split(':');
						const newEmoji = temp[1] + '.png';
						return (
							<View key={b.toString()}>
								<Image
									source={{
										uri: `${DOMAIN_SERVER_CHAT}/emoji-custom/${newEmoji}`,
									}}
									style={{ width: 24, height: 24 ,marginHorizontal : 2}}
								/>
							</View>
						);
					}
					else
					{
						return (
							<View key={b.toString()}>
								<Text style={{}}>{item ? shortnameToUnicode(a) : ''}</Text>
							</View>
						);
					}
				})
			}
			else{
				return (
					<View key={index.toString()}>
						<Text style={{}}>
							{item ? shortnameToUnicode(item) : ''}
						</Text>
					</View>
				);
			}
		}

		return (
			<>
				{isVisible && (
					<>
						<TapGestureHandler onHandlerStateChange={onBackdropPressed}>
							<Animated.View
								testID="action-sheet-backdrop"
								style={[
									styles.backdrop,
									{
										backgroundColor: '#3e3e3e',
										opacity,
									},
								]}
							/>
						</TapGestureHandler>
						<ScrollBottomSheet
							ref={bottomSheetRef}
							componentType="FlatList"
							snapPoints={snaps}
							initialSnapIndex={closedSnapIndex}
							renderHandle={renderHandle}
							onSettle={index => index === closedSnapIndex && toggleVisible()}
							animatedPosition={animatedPosition.current}
							containerStyle={styles.container}
							// @ts-ignore
							animationConfig={ANIMATION_CONFIG}
							// FlatList props
							data={data?.options}
							renderItem={({ item, index }) => {
								return (
									<TouchableOpacity
										onPress={() => {
											// navigation.navigate('UserInfoScreen', {
											// 	userID: item?.username,
											// });
										}}
										style={{ marginTop: index === 0 ? 50 : 8 }}
									>
										<View
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<AvatarBorder
												size={40}
												username={item?.username}
												name={item?.name}
											/>
											<Text
												style={{
													marginLeft: 12,
													flex: 1,
													fontWeight: '500',
													color: colors.primary,
												}}
											>
												{item?.name}
											</Text>
											{getEmoji(item?.reactions, index)}
											{/* <View key={index.toString()}>
												<Text style={{}}>
													{item ? shortnameToUnicode(item?.reactions) : ''}
												</Text>
											</View> */}
										</View>
									</TouchableOpacity>
								);
							}}
							keyExtractor={(item, index) => index.toString()}
							style={{ backgroundColor: '#fff' }}
							contentContainerStyle={styles.content}
							ListFooterComponent={() => <View style={{ height: 60 }} />}
							ListHeaderComponent={() => (
								<View
									style={{
										paddingTop: 8,
										paddingBottom: 16,
										justifyContent: 'center',
										alignItems: 'center',
										borderBottomWidth: 0.5,
										borderBottomColor: '#ddd',
										marginHorizontal: -8,
										position: 'absolute',
										left: 0,
										right: 0,
									}}
								>
									<Text style={{ fontWeight: '600' }}>
										{data.options.length} people reacted this message
									</Text>
								</View>
							)}
							getItemLayout={getItemLayout}
						/>
					</>
				)}
			</>
		);
	}),
);

export default ActionSheet;
