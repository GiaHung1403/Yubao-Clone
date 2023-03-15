import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
	InteractionManager,
	Keyboard,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Button, Card, Snackbar, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { postFeedBack, postNotifyFeedBack } from '@data/api';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import RatingReview from '@components/RatingReview';
import { LocalizationContext } from '@context/LocalizationContext';
import { IUserSystem } from '@models/types';
import styles from './styles';

const listDataType = [
	{ label: 'Upgrade function', value: 'Upgrade function' },
	{ label: 'Bug', value: 'Bug' },
	{ label: 'New function', value: 'New function' },
	{ label: 'Rating Yubao App', value: 'Rating' },
	{ label: 'Other', value: 'Other' },
];

export function FeedbackScreen(props: any) {
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [type, setType] = useState('Upgrade function');
	const [content, setContent] = useState('');
	const [visibleSnackBar, setVisibleSnackBar] = useState(false);
	const [labelSnackBar, setLabelSnackBar] = useState('');
	const [ratingReview, setRatingReview] = useState(5);
	const [loading, setLoading] = useState<boolean>(false);

	const I18n = useContext(LocalizationContext);
	const textFeedback = I18n.t('feedback');
	const textContent = I18n.t('content');
	const textSend = I18n.t('send');
	const textFeedbackThank = I18n.t('feedback_thank');

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressSend = async () => {
		setLoading(true);
		try {
			Keyboard.dismiss();
			await firestore().collection('Report').add({
				userID: dataUserSystem.EMP_NO,
				type,
				description: content,
				rating: ratingReview,
				createAt: firestore.Timestamp.now(),
			});

			const data: any = await postFeedBack({
				subj: type,
				oP_EMP_NO: dataUserSystem.EMP_NO,
				descript: content,
			});

			if (data?.loG_ID == null) {
				await postNotifyFeedBack({
					title: type,
					user: dataUserSystem.EMP_NO,
					content: content,
					short_content: content,
				});
			}

			setLoading(false);

			setContent('');
			setLabelSnackBar('Đã gửi góp ý thành công!');
			setVisibleSnackBar(true);

			setTimeout(() => {
				setVisibleSnackBar(false);
				navigation.goBack();
			}, 3000);
		} catch (err: any) {
			setLoading(false);
			setLabelSnackBar(err.message);
			setVisibleSnackBar(true);

			setTimeout(() => {
				setVisibleSnackBar(false);
			}, 3000);
		}
	};

	return (
		<TouchableWithoutFeedback
			style={{ flex: 1 }}
			onPress={() => Keyboard.dismiss()}
		>
			<View style={{ flex: 1 }}>
				<View style={{ zIndex: 2 }}>
					<Header title={textFeedback} />
				</View>

				{doneLoadAnimated ? (
					<View style={{ flex: 1 }}>
						<Card style={styles.cardFormBody}>
							<Text style={{ color: '#3e3e3e', marginBottom: 16 }}>
								{textFeedbackThank}
							</Text>

							<PickerCustomComponent
								showLabel={true}
								listData={listDataType}
								label="Type feedback"
								value={type}
								onValueChange={text => setType(text)}
							/>

							{type === 'Rating' && (
								<View
									style={{
										padding: 20,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<RatingReview
										ratingReview={ratingReview}
										onPressRating={numberRating =>
											setRatingReview(numberRating)
										}
									/>
								</View>
							)}

							<TextInput
								textAlign={'left'}
								label={textContent}
								mode="outlined"
								value={content}
								style={{ marginTop: type === 'Rating' ? 0 : 8 }}
								multiline
								onChangeText={text => setContent(text)}
								onPressIn={() => null}
								onPressOut={() => null}
								autoComplete={'off'}
							/>

							<Button
								icon="send"
								mode="contained"
								uppercase={false}
								loading={loading}
								disabled={loading}
								style={{ marginTop: 20 }}
								onPress={_onPressSend}
							>
								{loading ? 'Loading' : textSend}
							</Button>
						</Card>
					</View>
				) : (
					<LoadingFullScreen />
				)}

				<Snackbar
					visible={visibleSnackBar}
					onDismiss={() => null}
					action={{
						label: 'OK',
						onPress: () => {
							setVisibleSnackBar(false);
						},
					}}
				>
					{labelSnackBar}
				</Snackbar>
			</View>
		</TouchableWithoutFeedback>
	);
}
