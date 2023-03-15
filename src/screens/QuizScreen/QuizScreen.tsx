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
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '@components/Header/Header';
import { IUserSystem } from '@models/types';

const bannerStart = require('@assets/banner_get_started.png');
const bannerSuccess = require('@assets/banner_success.png');

export function QuizScreen(props: any) {
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [valueQuestion, setValueQuestion] = useState<any>();
	const [valueAnswer, setValueAnswer] = useState<number>();
	const [isAnswer, setIsAnswer] = useState<boolean>(false);

	const { colors } = useTheme();
	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const dataQuestion = await firestore().collection('QA').limit(1).get();

			dataQuestion.forEach(item =>
				setValueQuestion({ data: item.data(), key: item.id }),
			);
		});
	}, []);

	useEffect(() => {
		if (valueQuestion) {
			const doc = firestore()
				.collection('QA')
				.doc(valueQuestion.key)
				.collection('listUserAnswer')
				.doc(dataUserSystem.EMP_NO)
				.onSnapshot(
					docSnapshot => {
						if (!doneLoadAnimated) {
							setDoneLoadAnimated(true);
						}
						setIsAnswer(docSnapshot.exists);
					},
					err => {
						Alert.alert('Error', err.message);
					},
				);
		}
	}, [valueQuestion]);

	const _onPressSubmit = async () => {
		try {
			await firestore()
				.collection('QA')
				.doc(valueQuestion.key)
				.collection('listUserAnswer')
				.doc(dataUserSystem.EMP_NO)
				.set({
					answer: valueAnswer,
					createAt: firestore.Timestamp.now(),
				});

			Alert.alert('Thông báo', 'Submit thành công!');
		} catch (error: any) {
			Alert.alert('Error', error.message);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 1 }}>
				<Header title="Quiz" />
			</View>

			{doneLoadAnimated ? (
				<ScrollView style={{ flex: 1, padding: 8, backgroundColor: '#fff' }}>
					<Card elevation={2} style={{ marginBottom: 16 }}>
						<View style={{ padding: 8 }}>
							<Image
								source={isAnswer ? bannerSuccess : bannerStart}
								resizeMode="contain"
								style={{ width: '100%', height: 200 }}
							/>
							<Text
								style={{
									fontWeight: '400',
									fontSize: 17,
									color: '#3e3e3e',
									marginTop: 20,
									textAlign: isAnswer ? 'center' : 'left',
								}}
							>
								{isAnswer
									? 'You answered the question this time! We will notify you of the results soon! Thanks!'
									: valueQuestion?.data?.question}
							</Text>
						</View>
					</Card>

					{/* To create radio buttons, loop through your array of options */}
					{!isAnswer &&
						valueQuestion?.data.listAnswer?.map((obj, i) => (
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

					{!isAnswer && (
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
