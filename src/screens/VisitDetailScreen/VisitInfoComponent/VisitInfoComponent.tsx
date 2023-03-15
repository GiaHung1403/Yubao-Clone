import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Button, Card, useTheme } from 'react-native-paper';
import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { useSelector } from 'react-redux';

import DateTimePickerModalCustom from '@components/DateTimePickerModalCustom';
import ImageViewerCustom from '@components/ImageViewerCustom';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import {
	getAddressVisit,
	getAllTcoByClass,
	getListCustomerStatusVisit,
	getListPositionVisit,
	getListPurposeVisit,
	getListTiming,
	updateVisit,
	uploadImageVisit,
} from '@data/api';
import { Ionicons } from '@expo/vector-icons';
import {
	ICustomer,
	ISeller,
	ITcoByClass,
	IUserSystem,
	IVisit,
} from '@models/types';
import {
	convertUnixTimeNoSpaceYYYYMMDDHHMM,
	convertUnixTimeSolid,
} from '@utils';
import axios from 'axios';
import { Icon } from 'native-base';
import * as ImagePicker from 'react-native-image-picker';

interface IRouteParams {
	visitInfo: IVisit;
	customerSelected: ICustomer | ISeller | {};
}

const listCustomerType = [
	{ label: 'Customer', value: 1 },
	{ label: 'Seller', value: 2 },
];

const listVisitMethod = [
	{ label: 'By call', value: 1 },
	{ label: 'Directly', value: 2 },
];

export default function VisitInfoComponent(props: any) {
	const navigation: any = useNavigation();

	const { colors } = useTheme();
	const dateTimePickerRef = useRef<any>(null);
	const imageViewerRef = useRef<any>();
	const isFocused = useIsFocused();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { visitInfo, customerSelected = {} }: IRouteParams = props;

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [listPosition, setListPosition] = useState<any>([]);
	const [listTiming, setListTiming] = useState<any>([]);
	const [listPurpose, setListPurpose] = useState<any>([]);
	const [listNextMove, setListNextMove] = useState<any>([]);
	const [listCustomerStatus, setListCustomerStatus] = useState<any>([]);
	const [customerName, setCustomerName] = useState(visitInfo?.ls_Nm);
	const [interview, setInterview] = useState(visitInfo?.int_per);
	const [positionSelected, setPositionSelected] = useState(
		visitInfo?.pos || '98',
	);
	const [travelTime, setTravelTime] = useState(
		visitInfo?.trvL_TIME?.toString(),
	);
	const [interviewTime, setInterviewTime] = useState(
		visitInfo?.int_time?.toString(),
	);
	const [remarks, setRemarks] = useState(visitInfo?.rmks);
	const [visitDate, setVisitDate] = useState(
		visitInfo ? new Date(visitInfo.bas_Date) : new Date(),
	);
	const [customerStatusSelected, setCustomerStatusSelected] = useState<string>(
		visitInfo?.lesE_STC,
	);
	const [nextMoveSelected, setNextMoveSelected] = useState<string>(
		visitInfo?.nxT_MOVE,
	);
	const [purposeSelected, setPurposeSelected] = useState<string>(
		visitInfo?.pur.trim(),
	);
	const [gradeSelected, setGradeSelected] = useState<string>(
		visitInfo?.grade.trim(),
	);
	const [indexRadioButton, setIndexRadioButton] = useState<number>(
		visitInfo?.lesE_TP - 1 || 0,
	);
	const [indexRadioButtonMethod, setIndexRadioButtonMethod] = useState<number>(
		parseInt(visitInfo?.visit_Method, 10) - 1 || 1,
	);
	const [imageCall, setImageCall] = useState<any>({
		uri:
			visitInfo?.visit_Method === '1'
				? `http://124.158.8.254:9898/export/CILC_APP/VISIT/${visitInfo?.seq}_1.jpg`
				: '',
	});
	const [listAddress, setListAddress] = useState<any>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;
			/* ============================== List Position ============================== */
			const responsePosition: any = await getListPositionVisit({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
			});

			const positionConvert = responsePosition.map(position => ({
				label: position.STND_C_NM,
				value: position.C_NO,
			}));

			setListPosition(positionConvert);

			/* ============================== List Purpose ============================== */
			const responsePurpose: any = await getListPurposeVisit({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
			});

			const purposeConvert = responsePurpose.map(purpose => ({
				label: purpose.STND_C_NM,
				value: purpose.C_NO,
			}));

			setListPurpose(purposeConvert);

			/* ============================== List Timing ============================== */
			const responseTiming: any = await getListTiming({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
			});

			const timingConvert = responseTiming.map(timing => ({
				label: timing.STND_C_NM,
				value: timing.C_NO,
			}));

			setListTiming(timingConvert);

			/* ============================== List Customer Status ============================== */
			const responseStatus: any = await getListCustomerStatusVisit({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
			});

			const statusConvert = responseStatus
				.map(status => ({
					label: status.STND_C_NM,
					value: status.C_NO,
				}))
				.splice(2);

			setListCustomerStatus(statusConvert);

			const responseNextMove: ITcoByClass[] = (await getAllTcoByClass({
				classNo: 'cdln000004',
			})) as ITcoByClass[];

			const listNextMoveConvert: any[] = responseNextMove.map(item => ({
				label: item.stnD_C_NM,
				value: item.c_No,
			}));

			setListNextMove(listNextMoveConvert);

			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (isFocused) {
			(async () => {
				const responseAddress: any[] = (await getAddressVisit({
					leseID:
						('LESE_ID' in customerSelected
							? customerSelected?.LESE_ID
							: 'ID' in customerSelected
							? customerSelected?.ID
							: '') || visitInfo?.lese_ID,
				})) as any[];
				const listAddressVisitConvert: any[] = responseAddress
					.filter(item => item.addrName !== 'Choose')
					.map((item, index) => ({
						address: item.addrName,
						title:
							index === 0
								? 'Address'
								: index === 1
								? 'Contact Address'
								: 'Invoice Address',
					}));
				setListAddress(listAddressVisitConvert);
			})();
		}
	}, [isFocused]);

	const _onHandleConfirmDate = (date: Date) => {
		setVisitDate(date);
	};

	const _onPressShowModalDate = () => {
		dateTimePickerRef.current.onShowModal();
	};

	const _onPressUpdate = async () => {
		if (indexRadioButtonMethod === 0 && !imageCall?.base64) {
			Alert.alert('Warning', 'Please upload image!');
			return;
		}

		if (!visitInfo && Object.keys(customerSelected).length === 0) {
			Alert.alert(
				'Warning',
				`Please choose ${indexRadioButton === 0 ? 'customer' : 'seller'}!`,
			);
			return;
		}

		setLoading(true);

		try {
			const response = (await updateVisit({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				action: visitInfo ? 'UPDATE' : 'INSERT', // INSERT, UPDATE, DELETE
				leseID:
					visitInfo?.lese_ID ||
					('LESE_ID' in customerSelected
						? customerSelected?.LESE_ID
						: 'ID' in customerSelected
						? customerSelected?.ID
						: ''),
				seq: visitInfo?.seq || '',
				interview,
				position: positionSelected,
				visitDate: convertUnixTimeNoSpaceYYYYMMDDHHMM(
					new Date().getTime() / 1000,
				),
				purpose: purposeSelected,
				nextMove: nextMoveSelected,
				travelTime,
				interviewTime,
				remarks,
				leseType: indexRadioButton + 1, // (Customer Type: 1: Customer, 2: Dealer)
				grade: gradeSelected,
				customerStatus: customerStatusSelected,
				visitMethod: indexRadioButtonMethod + 1,
				AddressType: 'Lese',
			})) as any[];

			if (indexRadioButtonMethod === 0) {
				await axios.post('http://124.158.8.254:3030/upload/upload_file', {
					imageBase64: imageCall.base64,
					fileName: `${response[0].SEQ}_1`,
				});

				await uploadImageVisit({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					visitID: response[0].SEQ,
					fileName: `${response[0].SEQ}_1`,
				});
			}

			setLoading(false);
			navigation.goBack();
		} catch (e: any) {
			Alert.alert('Error', e.message);
			setLoading(false);
		}
	};

	const _onPressDelete = () => {
		Alert.alert('Alert', 'Do you want to delete this?', [
			{ text: 'Cancel' },
			{
				text: 'OK',
				onPress: async () => {
					try {
						await updateVisit({
							User_ID: dataUserSystem.EMP_NO,
							Password: '',
							action: 'DELETE', // INSERT, UPDATE, DELETE
							leseID: visitInfo?.lese_ID,
							seq: visitInfo?.seq,
							interview,
							position: positionSelected,
							visitDate: convertUnixTimeNoSpaceYYYYMMDDHHMM(
								new Date().getTime() / 1000,
							),
							purpose: purposeSelected,
							nextMove: nextMoveSelected,
							travelTime,
							interviewTime,
							remarks,
							leseType: indexRadioButton + 1, // (Customer Type: 1: Customer, 2: Dealer)
							grade: gradeSelected,
							customerStatus: customerStatusSelected,
						});

						navigation.goBack();
					} catch (e: any) {
						Alert.alert('Error', e.message);
					}
				},
			},
		]);
	};

	const _onPressChooseImage = () => {
		const options = {
			quality: 1,
			mediaType: '',
			includeBase64: true,
		};

		ImagePicker.launchImageLibrary(
			options as ImagePicker.ImageLibraryOptions,
			async response => {
				if (response.didCancel) {
					return;
				}

				if (response.assets) {
					setImageCall({
						base64: response.assets[0].base64,
						uri: response.assets[0].uri,
					});
				}
			},
		);
	};

	const _onPressRadioChooseCustomer = (index: number) => {
		setIndexRadioButton(index);
		navigation.setParams({
			customerSelected: {},
		});
		setListAddress([]);
	};

	return doneLoadAnimated ? (
		<KeyboardAvoidingView
			style={{
				flex: 1,
				marginVertical: Platform.OS === 'ios' ? 20 : 8,
			}}
			behavior="padding"
			enabled={Platform.OS === 'ios'}
		>
			<ScrollView
				style={{ flex: 1, padding: 8 }}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<View
					style={{
						marginBottom: 8,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Card style={{ flex: 1, padding: 8 }}>
						<Text style={{ fontWeight: '500', color: '#555' }}>
							Customer Type
						</Text>
						<RadioForm formHorizontal={true} animation={true}>
							{listCustomerType.map((obj, index) => (
								<RadioButton labelHorizontal={true} key={index}>
									<RadioButtonInput
										obj={obj}
										index={index}
										isSelected={indexRadioButton === index}
										onPress={() => _onPressRadioChooseCustomer(index)}
										borderWidth={1}
										buttonInnerColor={colors.primary}
										buttonOuterColor={
											indexRadioButton === index ? '#2196f3' : '#5a5a5a'
										}
										buttonSize={14}
										buttonOuterSize={20}
										buttonWrapStyle={{ paddingVertical: 12 }}
									/>
									<RadioButtonLabel
										obj={obj}
										index={index}
										labelHorizontal={true}
										onPress={() => _onPressRadioChooseCustomer(index)}
										labelStyle={{
											color:
												indexRadioButton === index ? colors.primary : '#5a5a5a',
											fontWeight: '500',
											marginLeft: -4,
											marginRight: 20,
										}}
									/>
								</RadioButton>
							))}
						</RadioForm>
					</Card>

					{/* <Card style={{ flex: 1, padding: 8 }}>
					<Text
						style={{ fontWeight: '500', color: '#555', textAlign: 'center' }}
					>
						Visit method
					</Text>
					<RadioForm formHorizontal={true} animation={true}>
						{listVisitMethod.map((obj, index) => (
							<RadioButton labelHorizontal={true} key={index}>
								<RadioButtonInput
									obj={obj}
									index={index}
									isSelected={indexRadioButtonMethod === index}
									onPress={() => setIndexRadioButtonMethod(index)}
									borderWidth={1}
									buttonInnerColor={colors.primary}
									buttonOuterColor={
										indexRadioButton === index ? '#2196f3' : '#5a5a5a'
									}
									buttonSize={14}
									buttonOuterSize={20}
									buttonWrapStyle={{ paddingVertical: 12 }}
								/>
								<RadioButtonLabel
									obj={obj}
									index={index}
									labelHorizontal={true}
									onPress={() => setIndexRadioButtonMethod(index)}
									labelStyle={{
										color:
											indexRadioButtonMethod === index
												? colors.primary
												: '#5a5a5a',
										fontWeight: '500',
										marginLeft: -4,
										marginRight: 8,
									}}
								/>
							</RadioButton>
						))}
					</RadioForm>
				</Card> */}
				</View>

				<Card style={{ padding: 8 }}>
					<TextInputCustomComponent
						label={`${indexRadioButton === 0 ? 'Customer' : 'Seller'} Name`}
						placeholder=""
						enable={false}
						iconRight={'search-outline'}
						value={
							('LS_NM' in customerSelected
								? customerSelected?.LS_NM
								: 'SELLER_NM' in customerSelected
								? customerSelected?.SELLER_NM
								: '') || customerName
						}
						style={{ marginBottom: 8 }}
						multiline={true}
						onPress={() =>
							navigation.navigate(
								indexRadioButton === 0
									? 'ChooseCustomerModal'
									: 'SellerListScreen',
								{
									idCustomerExisted:
										'LS_NM' in customerSelected
											? customerSelected?.LS_NM
											: 'SELLER_NM' in customerSelected
											? customerSelected?.SELLER_NM
											: 'new',
									screenBack: 'VisitDetailScreen',
								},
							)
						}
					/>

					{indexRadioButtonMethod === 1 ? (
						<View style={{ marginBottom: 8, flex: 1 }}>
							{listAddress.map((item, index) => (
								<View
									key={index.toString()}
									style={{
										marginTop: 8,
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}
								>
									<Text
										style={{
											fontWeight: '600',
											color: colors.primary,
											marginRight: 8,
										}}
									>{`${item.title}:`}</Text>
									<Text
										style={{ textAlign: 'right', flex: 1 }}
									>{`${item.address}`}</Text>
								</View>
							))}

							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginTop: 8,
								}}
							>
								<Icon
									as={Ionicons}
									name={'alert-circle-outline'}
									size={5}
									color={'red.500'}
									marginRight={1}
								/>
								<Text
									style={{ color: 'red', fontStyle: 'italic', fontSize: 12 }}
								>{`Yubao will use these address for check-in function!`}</Text>
							</View>
						</View>
					) : null}
				</Card>

				<Card style={{ padding: 8, marginTop: 8 }}>
					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<TextInputCustomComponent
							label="Visit Date"
							placeholder=""
							keyboardType="number-pad"
							style={{ flex: 1, marginRight: 8 }}
							enable={false}
							onPress={() => _onPressShowModalDate()}
							value={convertUnixTimeSolid(visitDate.getTime() / 1000)}
						/>

						<TextInputCustomComponent
							label="PIC"
							placeholder=""
							autoCapitalize="words"
							style={{ flex: 1 }}
							value={visitInfo?.emp_Nm || dataUserSystem.EMP_NM}
							enable={false}
						/>
					</View>
					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<TextInputCustomComponent
							label="Interviewee"
							placeholder=""
							autoCapitalize="words"
							style={{ flex: 1, marginRight: 12 }}
							value={interview}
							onChangeText={text => {
								setInterview(text);
							}}
						/>
						<PickerCustomComponent
							showLabel={true}
							listData={listPosition}
							label="Position"
							value={positionSelected}
							style={{ flex: 1 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text => setPositionSelected(text)}
						/>
					</View>
					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<TextInputCustomComponent
							label="Travel Time (minutes)"
							placeholder=""
							keyboardType="numeric"
							style={{ flex: 1, marginRight: 12 }}
							value={travelTime}
							onChangeText={text => setTravelTime(text)}
						/>
						<TextInputCustomComponent
							label="Interview Time (minutes)"
							placeholder=""
							keyboardType="numeric"
							style={{ flex: 1 }}
							value={interviewTime}
							onChangeText={text => setInterviewTime(text)}
						/>
					</View>

					<View style={{ marginBottom: 12 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listCustomerStatus}
							label="Customer Status"
							value={customerStatusSelected}
							style={{ flex: 1 }}
							textStyle={{ maxWidth: '90%' }}
							onValueChange={text => setCustomerStatusSelected(text)}
						/>
					</View>

					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listPurpose}
							label="Purpose"
							value={purposeSelected}
							textStyle={{ maxWidth: 110 }}
							style={{ flex: 1, marginRight: 12 }}
							onValueChange={text => setPurposeSelected(text)}
						/>
						<PickerCustomComponent
							showLabel={true}
							listData={listTiming}
							label="Timing Of Demand"
							value={gradeSelected}
							textStyle={{ maxWidth: 110 }}
							style={{ flex: 1 }}
							onValueChange={text => setGradeSelected(text)}
						/>
					</View>

					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listNextMove}
							label="Next Move"
							value={nextMoveSelected}
							textStyle={{ maxWidth: 110 }}
							style={{ flex: 1, marginRight: 12 }}
							onValueChange={text => setNextMoveSelected(text)}
						/>
						<TextInputCustomComponent
							label="Customer Source"
							placeholder=""
							style={{ flex: 1 }}
							value={
								'SRC_NM' in customerSelected ? customerSelected?.SRC_NM : ''
							}
							enable={false}
						/>
					</View>

					<TextInputCustomComponent
						label="Remarks"
						placeholder="Remarks"
						style={{ marginBottom: 12 }}
						multiline
						inputStyle={{ height: 60, textAlign: 'left' }}
						value={remarks}
						onChangeText={text => {
							setRemarks(text);
						}}
					/>

					{indexRadioButtonMethod === 0 && (
						<Card
							elevation={2}
							style={{ marginBottom: 12, flex: 1 }}
							onPress={() =>
								imageCall?.uri
									? imageViewerRef.current.onShowViewer(
											[{ url: imageCall?.uri }],
											0,
									  )
									: _onPressChooseImage()
							}
						>
							{loading ? (
								<ActivityIndicator />
							) : (
								<View
									style={{
										padding: 8,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<View style={{ width: '100%', position: 'relative' }}>
										<Image
											source={{
												uri:
													imageCall?.uri ||
													'https://img.icons8.com/bubbles/100/000000/upload.png',
											}}
											resizeMode={imageCall?.uri ? 'cover' : 'contain'}
											style={{ width: '100%', height: 70 }}
										/>
									</View>
									<Text
										style={{ marginTop: 12, fontWeight: '500', color: '#333' }}
									>
										Upload image
									</Text>

									{imageCall?.uri ? (
										<TouchableOpacity
											style={{ position: 'absolute', top: -10, right: -10 }}
											onPress={() => setImageCall({})}
										>
											<View>
												<Icon
													as={Ionicons}
													name={'close-circle-outline'}
													size={7}
													color={'red'}
												/>
											</View>
										</TouchableOpacity>
									) : null}
								</View>
							)}
						</Card>
					)}
				</Card>

				<View style={{ flexDirection: 'row', marginTop: 20 }}>
					{visitInfo && visitInfo?.approvaL_STATUS === 'Waiting' && (
						<Button
							mode="contained"
							style={{ flex: 1, backgroundColor: 'red' }}
							uppercase={false}
							onPress={() => _onPressDelete()}
						>
							Delete
						</Button>
					)}

					{(!visitInfo || visitInfo?.approvaL_STATUS === 'Waiting') && (
						<Button
							mode="contained"
							style={{ flex: 1, marginLeft: 8 }}
							uppercase={false}
							disabled={loading}
							loading={loading}
							onPress={() => _onPressUpdate()}
						>
							{visitInfo ? 'Update' : 'Create'}
						</Button>
					)}
				</View>

				<DateTimePickerModalCustom
					ref={dateTimePickerRef}
					date={visitDate}
					onConfirm={_onHandleConfirmDate}
				/>
				<ImageViewerCustom
					ref={ref => {
						imageViewerRef.current = ref;
					}}
				/>
				<View style={{ height: 100 }} />
			</ScrollView>
		</KeyboardAvoidingView>
	) : (
		<LoadingFullScreen />
	);
}
