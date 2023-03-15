import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	View,
	Text,
} from 'react-native';
import { Button, Card, Checkbox, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListCustomer } from '@actions/customer_action';
import Header from '@components/Header';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { getAllTcoByClass, insertCustomerInfo, getListNation } from '@data/api';
import { INation, ITcoByClass, IUserSystem } from '@models/types';
// import CheckBox from '@react-native-community/checkbox';
import styles from './styles';
import { MaterialIcons } from '@expo/vector-icons';

import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from 'react-native-simple-radio-button';

import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import moment from 'moment';

interface ICustomerSrc {
	label: string;
	value: string;
}

interface INationConvert {
	label: string;
	value: string;
}

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() - 7),
);

export function CustomerNewScreen(props: any) {
	const dispatch = useDispatch();
	const navigation: any = useNavigation();

	const { leseName, telephone, taxCodeRef, customerSource } =
		props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [loading, setLoading] = useState<boolean>(false);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	//Name VN/EN
	const [englishName, setEnglishName] = useState<string>(leseName || '');
	const [VNName, setVNName] = useState<string>('');

	//Adder
	const [address_VN, setAddress_VN] = useState<string>('');
	const [address_EN, setAddress_EN] = useState<string>('');

	// Nation
	const [nationSelected, setNationSelected] = useState<string>('VN');
	const [listNation, setListNation] = useState<INationConvert[]>([]);

	const [taxCode, setTaxCode] = useState<string>(taxCodeRef || '');
	const [telephoneNo, setTelephoneNo] = useState<string>(telephone || '');
	const [listCustomerSrc, setListCustomerSrc] = useState<ICustomerSrc[]>([]);
	const [customerSourceSelected, setCustomerSourceSelected] = useState<string>(
		customerSource || '',
	);
	// const [passportNo, setPassPortNo] = useState<string>('');
	// const [datedDG, setDatedGD] = useState<Date>(new Date());
	// const [customerType, setCustomerType] = useState<boolean>(false);
	const { colors } = useTheme();

	const [BirthDay, setBirthDay] = useState(timeFrom);

	const listCustomerType = [
		{ label: 'Company', value: 1 },
		{ label: 'Individual', value: 2 },
	];

	const [indexRadioButton, setIndexRadioButton] = useState<number>(1);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (doneLoadAnimated) {
			(async function getData() {
				const responseCustomerSrc: ITcoByClass[] = (await getAllTcoByClass({
					classNo: 'cdln000001',
				})) as ITcoByClass[];

				const listCustomerSrcConvert: ICustomerSrc[] = responseCustomerSrc.map(
					item => ({
						label: item.stnD_C_NM,
						value: item.c_No,
					}),
				);

				setListCustomerSrc(listCustomerSrcConvert);

				/* Get List Nation */
				const responseNation = (await getListNation({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
				})) as INation[];

				const listNationConvert: INationConvert[] = responseNation.map(
					item => ({
						label: item.STND_C_NM,
						value: item.C_NO,
					}),
				);

				setListNation(listNationConvert);
			})();
		}
	}, [doneLoadAnimated]);

	const _onPressButtonSave = async () => {
		switch (indexRadioButton) {
			case 1:
				if (
					(taxCode.length !== 10 && taxCode.length !== 14) ||
					(taxCode.length === 14 && !taxCode.includes('-'))
				) {
					Alert.alert('Alert', 'Tax Code wrong!');
					return;
				}

				if (!englishName || !VNName) {
					Alert.alert('Alert', 'Please input name!');
					return;
				}

				if (!address_VN || !address_EN) {
					Alert.alert('Alert', 'Please input address!');
					return;
				}
				if (!telephoneNo) {
					Alert.alert('Alert', 'Please input Telephone!');
					return;
				}
				if (customerSourceSelected === '') {
					Alert.alert('Alert', 'Please Choose Customer Source!');
					return;
				}
				break;
			case 2:
				if (
					taxCode.length < 9 ||
					(taxCode.length > 9 && taxCode.length !== 12)
				) {
					Alert.alert('Alert', 'Tax Code wrong!');
					return;
				}

				if (!englishName || !VNName) {
					Alert.alert('Alert', 'Please input name!');
					return;
				}

				if (!address_VN || !address_EN) {
					Alert.alert('Alert', 'Please input address!');
					return;
				}
				if (!telephoneNo) {
					Alert.alert('Alert', 'Please input Telephone!');
					return;
				}
				if (customerSourceSelected === '') {
					Alert.alert('Alert', 'Please Choose Customer Source!');
					return;
				}
				break;
			default:
				break;
		}

		setLoading(true);
		try {
			const aler: any = await insertCustomerInfo({
				COMPANY_TAXCODE: indexRadioButton === 1 ? taxCode : '',
				CUSTOMER_NAME: englishName,
				COMPANY_ADDRESS: address_VN,
				COMPANY_NAME_VN: VNName,
				TNO: telephoneNo,
				USER_ID: dataUserSystem.EMP_NO,
				PERSON_TNO: telephoneNo,
				CCCD: indexRadioButton === 1 ? '' : taxCode,
				BIRTHDAY:
					indexRadioButton === 1
						? '31122049'
						: moment(BirthDay).format('DDMMYYYY'),
				CUSTOMER_TYPE: indexRadioButton,
			});
			Alert.alert('Alert', aler.message);
			setTimeout(() => {
				dispatch(
					getListCustomer({
						User_ID: dataUserSystem.EMP_NO,
						Password: '',
						query: '',
					}),
				);
			}, 500);
			navigation.goBack();
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
		setLoading(false);
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Create New Customer'} />

			{doneLoadAnimated ? (
				<ScrollView
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps={'handled'}
				>
					<Card elevation={2} style={{ margin: 8 }}>
						<View style={{ padding: 8 }}>
							<View style={{ flexDirection: 'row' }}>
								<TextInputCustomComponent
									label="VN Name"
									placeholder="VN"
									style={{ marginTop: 8, flex: 1, marginRight: 8 }}
									value={VNName}
									onChangeText={text => setVNName(text)}
								/>
								<TextInputCustomComponent
									label="EN Name"
									placeholder="EN"
									style={{ flex: 1, marginTop: 8 }}
									value={englishName}
									onChangeText={text => setEnglishName(text)}
								/>
							</View>

							<View style={{ flexDirection: 'row' }}>
								<TextInputCustomComponent
									label="Address VN"
									placeholder="VN"
									style={{ marginTop: 8, flex: 1, marginRight: 8 }}
									value={address_VN}
									onChangeText={text => setAddress_VN(text)}
								/>

								<TextInputCustomComponent
									label="Address EN"
									placeholder="EN"
									style={{ marginTop: 8, flex: 1 }}
									value={address_EN}
									onChangeText={text => setAddress_EN(text)}
								/>
							</View>

							<View style={{ marginTop: 8, flexDirection: 'row' }}>
								<TextInputCustomComponent
									label="Telephone No."
									placeholder=""
									keyboardType={'numeric'}
									style={{ flex: 1, marginRight: 8 }}
									value={telephoneNo}
									onChangeText={text => setTelephoneNo(text)}
								/>

								<TextInputCustomComponent
									label={
										indexRadioButton === 1 ? 'Tax Code' : 'ID No./Passport No'
									}
									placeholder=""
									keyboardType={'numeric'}
									style={{ flex: 1 }}
									value={taxCode}
									onChangeText={text => setTaxCode(text)}
								/>
							</View>

							<PickerCustomComponent
								showLabel={true}
								listData={listNation}
								label="Nation"
								value={nationSelected}
								textStyle={{ maxWidth: '90%' }}
								style={{ flex: 1, marginVertical: 8 }}
								onValueChange={text => setNationSelected(text)}
							/>

							<PickerCustomComponent
								showLabel={true}
								listData={listCustomerSrc}
								label="Customer Source"
								value={customerSourceSelected}
								textStyle={{ maxWidth: '90%' }}
								style={{ flex: 1, marginVertical: 8 }}
								onValueChange={text => setCustomerSourceSelected(text)}
							/>
							{/* <PickerCustomComponent
								listData={[
									{ label: 'Company', value: 1 },
									{ label: 'Individual', value: 2 },
								]}
								label="Type of Customer"
								value={customerType}
								style={{ flex: 1, marginVertical: 8 }}
								onValueChange={text => setCustomerType(text)}
							/> */}
							{/* <View style={{ flexDirection: 'row' }}>
								{genderList.map((data, index) => (
									<TouchableOpacity
										key={data}
										style={{
											flexDirection: 'row',
											margin: 10,
											justifyContent: 'flex-end',
										}}
										onPress={genderChangeHandler.bind(this, index)}
									>
										<MaterialIcons
											name={
												index === genderIndex
													? 'radio-button-checked'
													: 'radio-button-unchecked'
											}
											size={18}
											color="#ccc"
										/>
										<Text style={styles.termsText}>{data}</Text>
									</TouchableOpacity>
								))}
							</View> */}
							<View style={{ flex: 1, padding: 8, flexDirection: 'row' }}>
								<View>
									<Text style={{ fontWeight: '500', color: '#555' }}>
										Type of Customer
									</Text>
									<RadioForm formHorizontal={true} animation={true}>
										{listCustomerType.map((obj, index) => (
											<RadioButton labelHorizontal={true} key={index}>
												<RadioButtonInput
													obj={obj}
													index={index}
													isSelected={indexRadioButton === obj.value}
													onPress={() => setIndexRadioButton(obj.value)}
													borderWidth={1}
													buttonInnerColor={colors.primary}
													buttonOuterColor={
														indexRadioButton === obj.value
															? '#2196f3'
															: '#5a5a5a'
													}
													buttonSize={14}
													buttonOuterSize={20}
													buttonWrapStyle={{ paddingVertical: 12 }}
												/>
												<RadioButtonLabel
													obj={obj}
													index={index}
													labelHorizontal={true}
													onPress={() => setIndexRadioButton(obj.value)}
													labelStyle={{
														color:
															indexRadioButton === obj.value
																? colors.primary
																: '#5a5a5a',
														fontWeight: '500',
														marginLeft: -4,
														marginRight: 20,
													}}
												/>
											</RadioButton>
										))}
									</RadioForm>
								</View>
								{indexRadioButton === 2 ? (
									<ButtonChooseDateTime
										label={'Birthday'}
										modalMode={'date'}
										valueDisplay={moment(BirthDay).format('DD/MM/YYYY')}
										value={BirthDay}
										onHandleConfirmDate={setBirthDay}
										containerStyle={{ flex: 1 }}
									/>
								) : null}
							</View>
						</View>
					</Card>

					{/*<Card elevation={2} style={{ marginHorizontal: 8, marginBottom: 8 }}>*/}
					{/*  <View style={{ padding: 8 }}>*/}
					{/*    <Text*/}
					{/*        style={{*/}
					{/*          marginBottom: 12,*/}
					{/*          fontSize: 15,*/}
					{/*          fontWeight: '600',*/}
					{/*          color: Color.main,*/}
					{/*        }}*/}
					{/*    >*/}
					{/*      GD Information*/}
					{/*    </Text>*/}

					{/*    <View style={{ flexDirection: 'row' }}>*/}
					{/*      <TextInputCustomComponent*/}
					{/*          label="ID No./Passport No."*/}
					{/*          placeholder=""*/}
					{/*          style={{ flex: 1, marginRight: 8 }}*/}
					{/*          inputStyle={{}}*/}
					{/*          value={passportNo}*/}
					{/*          onChangeText={text => setPassPortNo(text)}*/}
					{/*      />*/}

					{/*      <ButtonChooseDateTime*/}
					{/*          label={'Dated (GD)'}*/}
					{/*          valueDisplay={convertUnixTimeDDMMYYYY(datedDG.getTime() / 1000)}*/}
					{/*          value={datedDG}*/}
					{/*          modalMode={'date'}*/}
					{/*          onHandleConfirmDate={setDatedGD}*/}
					{/*          containerStyle={{ flex: 1 }}*/}
					{/*      />*/}
					{/*    </View>*/}
					{/*  </View>*/}
					{/*</Card>*/}

					{/*<Card elevation={2} style={{ marginHorizontal: 8, marginBottom: 8 }}>*/}
					{/*  <View style={{ padding: 8 }}>*/}
					{/*    <Text*/}
					{/*        style={{*/}
					{/*          marginBottom: 12,*/}
					{/*          fontSize: 15,*/}
					{/*          fontWeight: '600',*/}
					{/*          color: Color.main,*/}
					{/*        }}*/}
					{/*    >*/}
					{/*      Customer is Individua*/}
					{/*    </Text>*/}

					{/*    <View style={{ flexDirection: 'row' }}>*/}
					{/*      <TextInputCustomComponent*/}
					{/*          label="ID No./Passport No."*/}
					{/*          placeholder=""*/}
					{/*          style={{ flex: 1 }}*/}
					{/*          inputStyle={{}}*/}
					{/*          value={passportNo}*/}
					{/*          onChangeText={text => setPassPortNo(text)}*/}
					{/*      />*/}
					{/*    </View>*/}
					{/*  </View>*/}
					{/*</Card>*/}

					{/*<Card elevation={2} style={{ marginHorizontal: 8, marginBottom: 8 }}>*/}
					{/*  <View style={{ padding: 8 }}>*/}
					{/*    <Text*/}
					{/*        style={{*/}
					{/*          marginBottom: 12,*/}
					{/*          fontSize: 15,*/}
					{/*          fontWeight: '600',*/}
					{/*          color: Color.main,*/}
					{/*        }}*/}
					{/*    >*/}
					{/*      Customer is Individua*/}
					{/*    </Text>*/}

					{/*    <View style={{ flexDirection: 'row' }}>*/}
					{/*      <TextInputCustomComponent*/}
					{/*          label="Registered No."*/}
					{/*          placeholder=""*/}
					{/*          style={{ flex: 1 }}*/}
					{/*          inputStyle={{}}*/}
					{/*          value={passportNo}*/}
					{/*          onChangeText={text => setPassPortNo(text)}*/}
					{/*      />*/}
					{/*    </View>*/}
					{/*  </View>*/}
					{/*</Card>*/}

					<Button
						mode={'contained'}
						uppercase={false}
						style={{ margin: 8 }}
						loading={loading}
						onPress={_onPressButtonSave}
					>
						{loading ? 'Loading' : 'Save'}
					</Button>

					<SafeAreaView style={{ height: 60 }} />
				</ScrollView>
			) : null}
		</View>
	);
}
