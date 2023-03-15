import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { useDispatch, useSelector } from 'react-redux';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInfoRow from '@components/TextInfoRow';

import {
	IConsultationDetail,
	ICreditProgressCF,
	ICustomer,
	IGuarantor,
	IUserSystem,
	IValidCFSentMailResult,
} from '@models/types';

import EventEmitter from '@utils/events';

interface IPropsRouteParams {
	consultationID: string;
	customerSelected: ICustomer;
	consultationItem: IConsultationDetail;
}

const listCreditProgressRadio = [
	{ label: 'Yes', value: 'Y' },
	{ label: 'No', value: 'N' },
	{ label: 'Not set', value: '-' },
];

export default function ConsultationDetailScreen(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const dispatch = useDispatch();
	const { customerSelected, consultationItem }: IPropsRouteParams = props;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [consultationDetail, setConsultationDetail] =
		useState<IConsultationDetail>();
	const [listCreditProgress, setListCreditProgress] = useState<
		ICreditProgressCF[] | undefined
	>([]);
	const [listValueCreditProgress, setListValueCreditProgress] = useState<
		string[]
	>([]);
	const [showAllCreditProgress, setShowAllCreditProgress] =
		useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			await getConsultationItemData();
			setDoneLoadAnimated(true);
		});
	}, []);

	const getConsultationItemData = async () => {
		// const consultationItem = (await getConsultationDetail({
		// 	cnid: consultationID,
		// })) as IConsultationDetail;
		// setConsultationDetail(consultationItem);
		// const regex = /<[^>]*>?/gm;
		setListCreditProgress(consultationItem.lstCFConsIns);
		const valueCreditProgress =
			consultationItem?.crE_PRO_2?.trim().split(' ') ||
			Array.from(Array(26).keys()).map((item, index) => '-');
		setListValueCreditProgress(valueCreditProgress);

		// const responseGuarantor: any = await getListGuarantorByCustomerID({
		// 	User_ID: dataUserSystem.EMP_NO,
		// 	Password: '',
		// 	LESE_ID: consultationItem?.lesE_ID,
		// });

		// setListGuarantor(responseGuarantor);
	};

	useEffect(() => {
		EventEmitter.emit('_updateCheckBox_Consultation', {
			value: listValueCreditProgress,
		});
	}, [listValueCreditProgress]);

	return (
		<View style={{ flex: 1 }}>
			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<ScrollView style={{ flex: 1, padding: 8 }}>
						<Card style={{ padding: 8, marginTop: 8 }}>
							<View
								style={{
									padding: 8,
									flex: 1,
								}}
							>
								{listCreditProgress
									?.slice(
										0,
										showAllCreditProgress ? listCreditProgress.length : 4,
									)
									.map((item, index) => (
										<View key={index.toString()} style={{ marginBottom: 20 }}>
											<TextInfoRow
												icon={'barcode-outline'}
												value={`${item.creproID.toString()} - ${item.essData}`}
												styleValue={{
													color: '#5a5a5a',
													fontWeight: Platform.OS === 'ios' ? '500' : '400',
													flex: 1,
												}}
												containerStyle={{ alignItems: 'flex-start' }}
											/>
											<View
												style={{
													flexDirection: 'row',
													flex: 1,
													justifyContent: 'space-between',
													marginTop: 8,
												}}
											>
												{listCreditProgressRadio.map(
													(itemRadio, indexRadio) => (
														<RadioButton
															labelHorizontal={true}
															key={indexRadio}
														>
															<RadioButtonInput
																obj={itemRadio}
																index={index}
																isSelected={
																	listValueCreditProgress[index] ===
																	itemRadio.value
																}
																onPress={() => {
																	setListValueCreditProgress(listOld => {
																		const listValueNew = [...listOld];
																		listValueNew[index] = itemRadio.value;
																		return listValueNew;
																	});
																}}
																borderWidth={1}
																buttonInnerColor={colors.primary}
																buttonOuterColor={
																	listValueCreditProgress[index] ===
																	itemRadio.value
																		? colors.primary
																		: '#5a5a5a'
																}
																buttonSize={12}
																buttonOuterSize={20}
															/>
															<RadioButtonLabel
																obj={itemRadio}
																index={index}
																labelHorizontal={true}
																onPress={() => {
																	setListValueCreditProgress(listOld => {
																		const listValueNew = [...listOld];
																		listValueNew[index] = itemRadio.value;
																		return listValueNew;
																	});
																}}
																labelStyle={{
																	color:
																		listValueCreditProgress[index] ===
																		itemRadio.value
																			? colors.primary
																			: '#5a5a5a',
																	fontWeight: '500',
																	marginRight: 20,
																}}
															/>
														</RadioButton>
													),
												)}
											</View>
										</View>
									))}
							</View>

							<TouchableOpacity
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									paddingVertical: 8,
								}}
								onPress={() =>
									setShowAllCreditProgress(oldStatus => !oldStatus)
								}
							>
								<Icon
									as={Ionicons}
									name={
										showAllCreditProgress
											? 'chevron-up-outline'
											: 'chevron-down-outline'
									}
									size={7}
									color={colors.primary}
								/>
							</TouchableOpacity>
						</Card>
						<SafeAreaView style={{ height: 60 }} />
					</ScrollView>
				</KeyboardAvoidingView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
