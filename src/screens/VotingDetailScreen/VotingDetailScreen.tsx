import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Animated,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '@components/Header/Header';
import { IUserSystem } from '@models/types';
import EventEmitter from '@utils/events';

const bannerStart = require('@assets/banner_vote.png');
const bannerSuccess = require('@assets/Vote_Successfully.jpg');

let listTemp: any = '';
export function VotingDetailScreen(props: any) {
	const { key } = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [valueQuestion, setValueQuestion] = useState<any>();
	const [valueAnswer, setValueAnswer] = useState<any>();
	const [isAnswer, setIsAnswer] = useState<boolean>(false);
	const [listVote, setListVote] = useState<any[]>([]);
	const [countVote, setCountVote] = useState<any[]>([]);
	const [haveValue, setHaveValue] = useState(false);
	const [isDeadline, setIsDeadline] = useState(false);
	const [count, setCount] = useState(0);

	const listC: any = [];
	const { colors } = useTheme();
	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			firestore()
				.collection('Voting')
				.doc(key)
				.get()
				.then(item => {
					setValueQuestion({ data: item.data(), key: item.id });
					setIsDeadline(new Date() > new Date(item?.data()?.deadLine.toDate()));
				});
		});
	}, []);

	useEffect(() => {
		const value = countVote.reduce((total, value) => total + value.count, 0);
		setCount(value);
	}, [countVote]);

	useEffect(() => {
		if (valueQuestion) {
			const doc = firestore()
				.collection('Voting')
				.doc(key)
				.collection('listUserVote')
				.doc(dataUserSystem.EMP_NO)
				.onSnapshot(
					docSnapshot => {
						setIsAnswer(docSnapshot.exists);
						setValueAnswer(docSnapshot?.data()?.Vote);
						if (!doneLoadAnimated) {
							setDoneLoadAnimated(true);
						}
					},
					err => {
						Alert.alert('Error', err.message);
					},
				);
		}
	}, [valueQuestion]);

	useEffect(() => {
		if (isAnswer) {
			const doc = firestore()
				.collection('Voting')
				.doc(key)
				.collection('listUserVote')
				.get()
				.then(item => {
					setListVote(item.docs);
					listTemp = item.docs.length;
					setHaveValue(true);
				});
		}
	}, [isAnswer]);

	// const _onPressSubmit = async () => {
	// 	try {
	// 		await firestore()
	// 			.collection('Voting')
	// 			.doc(valueQuestion.key)
	// 			.collection('listUserVote')
	// 			.doc(dataUserSystem.EMP_NO)
	// 			.set({
	// 				Vote: valueAnswer,
	// 				createAt: firestore.Timestamp.now(),
	// 			});

	// 		Alert.alert('Thông báo', 'Submit thành công!');
	// 	} catch (error) {
	// 		Alert.alert('Error', error.message);
	// 	}
	// };

	useEffect(() => {
		valueQuestion?.data.listVote?.map((obj, i) => {
			if (haveValue) {
				var enabledCount = listVote.filter(
					item => item?._data.Vote?.value === obj.value,
				).length;
				listC.push({ count: enabledCount, value: i });
				setCountVote(listC);
			}
		});
	}, [haveValue]);

	const onRefresh = async () => {
		const doc = firestore()
			.collection('Voting')
			.doc(key)
			.collection('listUserVote')
			.get()
			.then((item: any) => {
				valueQuestion?.data.listVote?.map((obj, i) => {
					var enabledCount = item.docs.filter(
						item => item?._data.Vote?.value === obj.value,
					).length;
					listC.push({ count: enabledCount, value: i });
				});
				setCountVote(listC);
				setListVote(item.docs);
				setDoneLoadAnimated(true);
				setHaveValue(true);
			});
	};

	const _onPressSubmit = async () => {
		if (valueAnswer) {
			try {
				await firestore()
					.collection('Voting')
					.doc(valueQuestion.key)
					.collection('listUserVote')
					.doc(dataUserSystem.EMP_NO)
					.set({
						Vote: valueAnswer,
						createAt: firestore.Timestamp.now(),
					});

				Alert.alert('Alert', 'Submit successfully!');
				EventEmitter.emit('summitVote');
				if (isAnswer) {
					onRefresh();
					setDoneLoadAnimated(false);
				}
			} catch (error: any) {
				Alert.alert('Error', error.message);
			}
		} else {
			Alert.alert('Alert', "You haven't choose any vote !");
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 1 }}>
				<Header title="Voting" />
			</View>

			{doneLoadAnimated ? (
				<ScrollView style={{ flex: 1, padding: 8, backgroundColor: '#fff' }}>
					<Card elevation={2} style={{ marginBottom: 16 }}>
						<View style={{ padding: 8 }}>
							<Image
								source={
									isAnswer
										? bannerSuccess
										: {
												uri: 'https://npr.brightspotcdn.com/dims4/default/05d524a/2147483647/strip/true/crop/1389x729+0+122/resize/1200x630!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F61%2F03%2Fa9335fbf4500ae42d955becf4a6c%2Fvote.jpeg',
										  }
								}
								resizeMode="contain"
								style={{ width: '100%', height: 200 }}
							/>
							<Text
								style={{
									fontWeight: '400',
									fontSize: 17,
									color: '#3e3e3e',
									marginTop: 20,
									textAlign: 'center',
								}}
							>
								{valueQuestion?.data?.VoteTitle}
							</Text>
						</View>
					</Card>

					{isAnswer &&
						countVote.length > 0 &&
						count > 0 &&
						valueQuestion?.data.listVote?.map((obj, i) => {
							const anime = {
								width: new Animated.Value(0),
							};

							Animated.timing(anime.width, {
								toValue: 1,
								duration: 300,
								useNativeDriver: false,
							}).start();

							return (
								<View>
									<TouchableOpacity
										key={i}
										style={{
											paddingVertical: 16,
											borderWidth: 1,
											// borderColor:
											// 	valueAnswer?.value === obj?.value
											// 		? colors.primary
											// 		: '#d3d3d3',
											// backgroundColor:
											// 	valueAnswer?.value === obj?.value
											// 		? colors.primary
											// 		: null,
											borderColor:
												valueAnswer === obj ? colors.primary : 'black',
											marginBottom: 16,
											borderRadius: 10,
											flexDirection: 'row',
										}}
										// onPress={() => setValueAnswer(obj)}
										onPress={() => setValueAnswer(obj)}
									>
										<Animated.View
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												bottom: 0,
												width: anime.width.interpolate({
													inputRange: [0, 1],
													outputRange: [
														'0%',
														`${Math.round(
															(countVote[i]?.count / count) * 100,
														)}%`,
													],
												}),
												backgroundColor:
													valueAnswer?.value === obj?.value
														? colors.primary
														: colors.disabled,
												borderTopLeftRadius: 10,
												borderBottomLeftRadius: 10,
												borderRadius:
													Math.round((countVote[i]?.count / count) * 100) == 100
														? 10
														: 0,
											}}
										/>
										<Text
											style={{
												fontSize: 15,
												color: '#000',
												flex: 1,
												marginLeft: 8,
											}}
										>
											{`${obj?.value}. ${obj?.label}`}
										</Text>
										<Text style={{ marginRight: 8 }}>
											{Math.round((countVote[i]?.count / count) * 100)}%
										</Text>
										<Text style={{ marginRight: 8 }}>
											({countVote[i]?.count}/{count})
										</Text>
									</TouchableOpacity>
								</View>
							);
						})}

					{/* To create radio buttons, loop through your array of options */}
					{!isAnswer &&
						valueQuestion?.data.listVote?.map((obj, i) => (
							<TouchableOpacity
								key={i}
								style={{
									paddingVertical: 16,
									paddingHorizontal: 8,
									borderWidth: 1,
									borderColor: valueAnswer === obj ? colors.primary : '#d3d3d3',
									marginBottom: 16,
									borderRadius: 10,
								}}
								onPress={() => setValueAnswer(obj)}
							>
								<Text
									style={{
										fontSize: 15,
										color: valueAnswer === obj ? colors.primary : '#000',
									}}
								>
									{`${obj?.value}. ${obj?.label}`}
								</Text>
							</TouchableOpacity>
						))}

					{!isDeadline && (
						<Button
							mode="contained"
							dark
							onPress={() => _onPressSubmit()}
							uppercase={false}
							style={{
								width: 200,
								borderRadius: 20,
								alignSelf: 'center',
								marginTop: 20,
							}}
							labelStyle={{ fontSize: 15 }}
						>
							Submit
						</Button>
					)}

					<SafeAreaView style={{ height: 60 }} />
				</ScrollView>
			) : (
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<ActivityIndicator color={colors.primary} />
				</View>
			)}
		</View>
	);
}
