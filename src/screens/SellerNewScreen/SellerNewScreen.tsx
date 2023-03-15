import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListSeller } from '@actions/customer_action';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import {
	getAllTcoByClass,
	getListNation,
	insertSellerInfo,
	getType_Organization,
} from '@data/api';
import { INation, ITcoByClass, IUserSystem } from '@models/types';
import styles from './styles';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import CheckBoxCustomComponent from '@components/CheckBoxCustomComponent';

import moment from 'moment';

interface INationConvert {
	label: string;
	value: string;
}

export function SellerNewScreen(props: any) {
	const dispatch = useDispatch();
	const navigation: any = useNavigation();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();

	const [loading, setLoading] = useState<boolean>(false);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [VNName, setVNName] = useState<string>('');
	const [englishName, setEnglishName] = useState<string>('');
	const [address_VN, setAddress_VN] = useState<string>('');
	const [address_EN, setAddress_EN] = useState<string>('');
	const [telephoneNo, setTelephoneNo] = useState<string>('');
	const [listNation, setListNation] = useState<INationConvert[]>([]);
	const [nationSelected, setNationSelected] = useState<string>('VN');
	const listTypeOfSeller = [
		{ label: 'Company', value: 1 },
		{ label: 'Individual', value: 2 },
	];

	const ListSellerIsCompany = [
		{ label: 'Overseas', value: 1 },
		{ label: 'Local company', value: 2 },
	];

	const [TypeOfSeller, setTypeOfSeller] = useState<number>(1);

	const [SellerIsCompany, setSellerIsCompany] = useState<number>(1);

	// const [typeOfSellerSelected, setTypeOfSellerSelected] = useState<string>('');
	const [listCICCode, setListCICCode] = useState<any[]>([]);
	const [cicCodeSelected, setCICCodeSelected] = useState<string>('0');

	//View Company
	const [ID_NoGD, setID_NoGD] = useState('');
	const [phoneNo_GD, setPhoneNo_GD] = useState('');
	const [taxCode, setTaxCode] = useState<string>('');
	const [Establish, setEstablish] = useState<Date>(new Date());
	const [listOrganization, setListOrganization] = useState<any[]>([]);
	const [selectOrganization, setSelectOrganization] = useState('0');
	// const [] = useState('');

	//View Individual
	const [IssuedByVN, setIssuedByVN] = useState('');
	const [IssuedByEN, setIssuedByEN] = useState('');
	const [ID_No, setID_No] = useState('');
	const [Issued, setIssued] = useState<Date>(new Date());

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			/* Get List Nation */
			const responseNation = (await getListNation({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			})) as INation[];

			const listNationConvert: INationConvert[] = responseNation.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));

			setListNation(listNationConvert);

			/* Get CIC Code */
			const responseCICCode: ITcoByClass[] = (await getAllTcoByClass({
				classNo: 'cdln000013',
			})) as ITcoByClass[];

			//Get Type
			const typeOf_Organization: any = await getType_Organization({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				KEY_DATA_EXT2: '',
			});

			const listCICCodeConvert = responseCICCode.map(item => ({
				label: `${item.c_No} ${item.stnD_C_NM}`,
				value: item.c_No,
			}));

			const listOrganizationConvert = typeOf_Organization.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));

			setListCICCode(listCICCodeConvert);
			setListOrganization(listOrganizationConvert);

			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressButtonSave = async () => {
		if (
			(taxCode.length !== 10 && taxCode.length !== 14) ||
			(taxCode.length === 14 && !taxCode.includes('-'))
		) {
			if (TypeOfSeller === 1) {
				Alert.alert('Alert', 'Tax Code wrong!');
				return;
			}
		}

		if (!englishName && !VNName) {
			Alert.alert('Alert', 'Please input name!');
			return;
		}

		if (!address_VN && address_EN) {
			Alert.alert('Alert', 'Please input address!');
			return;
		}
		setLoading(true);
		try {
			await insertSellerInfo({
				// TAX_CODE: taxCode,
				// CUSTOMER_NAME: englishName,
				// COMPANY_ADDRESS: address,
				// COMPANY_NAME_VN: englishName,
				// TNO: telephoneNo,
				// USER_ID: dataUserSystem.EMP_NO,
				// PERSON_TNO: telephoneNo,
				// nation: nationSelected,
				// typeOfSeller: typeOfSellerSelected,
				// cicCode: cicCodeSelected,

				TAX_CODE: taxCode,
				COMPANY_NAME: englishName,
				COMPANY_NAME_VN: VNName,
				COMPANY_ADDRESS_EN: address_EN,
				COMPANY_ADDRESS_VN: address_VN,
				Telephone_No: telephoneNo,
				USER_ID: dataUserSystem.EMP_NO,
				Phone_NO_GD: phoneNo_GD,
				nation: nationSelected,
				typeOfSeller: TypeOfSeller,
				cicCode: cicCodeSelected,
				OrganizationType: selectOrganization,
				FROM_DATE: moment(Establish).format('DDMMYYYY'),
				TO_DATE: moment(Issued).format('DDMMYYYY'),
				Passport_GD: ID_NoGD,
				TypeOfCompany: SellerIsCompany,
				Passport: ID_No,
				IssuedBy_VN: IssuedByVN,
				IssuedBy_EN: IssuedByEN,
			});

			setTimeout(() => {
				dispatch(
					getListSeller({
						User_ID: dataUserSystem.EMP_NO,
						Password: '',
						query: '',
						refresh: true,
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
			<Header title={'Create New Seller'} />

			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<ScrollView showsVerticalScrollIndicator={false}>
						<Card elevation={2} style={{ margin: 8 }}>
							<View style={{ padding: 8 }}>
								<View style={{ flexDirection: 'row' }}>
									<TextInputCustomComponent
										label="VN/EN Name"
										placeholder="VN"
										style={{ marginTop: 8, flex: 1, marginRight: 8 }}
										value={VNName}
										onChangeText={text => setVNName(text)}
									/>
									<TextInputCustomComponent
										label=""
										placeholder="EN"
										style={{ marginTop: 11, flex: 1 }}
										value={englishName}
										onChangeText={text => setEnglishName(text)}
									/>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<TextInputCustomComponent
										label="Address VN/EN"
										placeholder="VN"
										style={{ marginTop: 8, flex: 1, marginRight: 8 }}
										value={address_VN}
										onChangeText={text => setAddress_VN(text)}
									/>

									<TextInputCustomComponent
										label=""
										placeholder="EN"
										style={{ marginTop: 11, flex: 1 }}
										value={address_EN}
										onChangeText={text => setAddress_EN(text)}
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

								<View style={{ marginTop: 8, flexDirection: 'row' }}>
									<TextInputCustomComponent
										label="Telephone No."
										placeholder=""
										keyboardType={'numeric'}
										style={{ flex: 1, marginRight: 8 }}
										value={telephoneNo}
										onChangeText={text => setTelephoneNo(text)}
									/>

									<PickerCustomComponent
										showLabel={true}
										listData={listCICCode}
										label="CIC code"
										value={cicCodeSelected}
										textStyle={{ maxWidth: 110 }}
										style={{ flex: 1 }}
										onValueChange={text => setCICCodeSelected(text)}
									/>
								</View>

								<View style={{ flex: 1, marginTop: 8 }}>
									<CheckBoxCustomComponent
										title={'Type of Seller'}
										listData={listTypeOfSeller}
										value={TypeOfSeller}
										setValue={value => setTypeOfSeller(value)}
										showTitle={true}
									/>
								</View>

								{TypeOfSeller === 1 ? (
									// Company View
									<View>
										<View style={{ flexDirection: 'row' }}>
											<PickerCustomComponent
												showLabel={true}
												listData={listOrganization}
												label="Organization Type"
												value={selectOrganization}
												textStyle={{ maxWidth: 110 }}
												style={{ flex: 1 }}
												onValueChange={text => setSelectOrganization(text)}
											/>
										</View>

										<View
											style={{
												marginTop: 8,
												flexDirection: 'row',
											}}
										>
											<TextInputCustomComponent
												label="ID No./Passport No. (GD)"
												placeholder=""
												// keyboardType={'numeric'}
												style={{ flex: 1, marginRight: 8 }}
												value={ID_NoGD}
												onChangeText={text => setID_NoGD(text)}
											/>
											<TextInputCustomComponent
												label="Phone No(GD)"
												placeholder=""
												keyboardType={'numeric'}
												style={{ flex: 1 }}
												value={phoneNo_GD}
												onChangeText={text => setPhoneNo_GD(text)}
											/>
										</View>

										<View
											style={{
												marginTop: 8,
												flexDirection: 'row',
											}}
										>
											<TextInputCustomComponent
												label="Tax Code"
												placeholder=""
												keyboardType={'numeric'}
												style={{ flex: 1, marginRight: 8 }}
												value={taxCode}
												onChangeText={text => setTaxCode(text)}
											/>
											<View style={{ flex: 1 }}>
												<ButtonChooseDateTime
													label={'Establish Date'}
													modalMode={'date'}
													valueDisplay={moment(Establish).format('DD/MM/YYYY')}
													value={Establish}
													onHandleConfirmDate={setEstablish}
												/>
											</View>
										</View>

										<View style={{ marginTop: 8 }}>
											<CheckBoxCustomComponent
												title={'Type of Company'}
												listData={ListSellerIsCompany}
												value={SellerIsCompany}
												setValue={value => setSellerIsCompany(value)}
												showTitle={true}
											/>
										</View>
									</View>
								) : (
									//Individual View
									<View>
										<View
											style={{
												marginTop: 8,
												flexDirection: 'row',
											}}
										>
											<TextInputCustomComponent
												label="ID No./Passport No."
												placeholder=""
												keyboardType={'numeric'}
												style={{ flex: 1, marginRight: 8 }}
												value={ID_No}
												onChangeText={text => setID_No(text)}
											/>
											<View style={{ flex: 1 }}>
												<ButtonChooseDateTime
													label={'Issued Date'}
													modalMode={'date'}
													valueDisplay={moment(Issued).format('DD/MM/YYYY')}
													value={Issued}
													onHandleConfirmDate={setIssued}
												/>
											</View>
										</View>
										<View
											style={{
												marginTop: 8,
												flexDirection: 'row',
											}}
										>
											<TextInputCustomComponent
												label="Issued By (VN / EN)"
												placeholder="VN"
												// keyboardType={'numeric'}
												style={{ flex: 1, marginRight: 8 }}
												value={IssuedByVN}
												onChangeText={text => setIssuedByVN(text)}
											/>
											<TextInputCustomComponent
												label=""
												placeholder="EN"
												// keyboardType={'numeric'}
												style={{ flex: 1, marginTop: 3 }}
												value={IssuedByEN}
												onChangeText={text => setIssuedByEN(text)}
											/>
										</View>
									</View>
								)}
							</View>
						</Card>

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
				</KeyboardAvoidingView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
