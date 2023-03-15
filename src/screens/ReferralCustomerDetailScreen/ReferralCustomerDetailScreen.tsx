import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Color from '@config/Color';
import {
	getLisStatusRefCustomer,
	getReferralCustomer,
	insertReferralCustomer,
} from '@data/api';
import {
	ICustomer,
	IReferralCustomer,
	ISeller,
	IUserSystem,
} from '@models/types';
import { useNavigation } from '@react-navigation/native';
import { removeEmptyField } from '@utils/index';
import {
	referralCustomersAtom,
	searchKeyRefCustomerAtom,
} from 'atoms/referral-customer.atom';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	InteractionManager,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button } from 'react-native-paper';
import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { useSelector } from 'react-redux';

const listCustomerType = [
	{ label: 'Company', value: '1' },
	{ label: 'Individual', value: '2' },
];

interface IRouteParams {
	referralCustomer?: IReferralCustomer;
	customerSelected?: ICustomer;
	salesmanSelected?: ISaleMan;
	dealerSelected?: ISeller;
}

interface ISaleMan {
	salemaN_ID: string;
	salemaN_NM: string;
}

function ReferralCustomerDetailScreen(props: any) {
	const navigation: any = useNavigation();

	const {
		referralCustomer,
		customerSelected,
		salesmanSelected,
		dealerSelected,
	}: IRouteParams = props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const setReferralCustomers = useUpdateAtom(referralCustomersAtom);
	const searchKey = useAtomValue(searchKeyRefCustomerAtom);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [keyPerson, setKeyPerson] = useState<string>(
		referralCustomer?.keY_PERSON || '',
	);
	const [customerName, setCustomerName] = useState<string>(
		referralCustomer?.lS_NM || '',
	);
	const [taxCode, setTaxCode] = useState<string>(
		referralCustomer?.taX_CODE || '',
	);
	const [telephone, setTelephone] = useState<string>(
		referralCustomer?.tno || '',
	);
	const [typeSelected, setTypeSelected] = useState<string>(
		referralCustomer?.lS_TP || '1',
	);
	const [statusSelected, setStatusSelected] = useState<string>(
		referralCustomer?.sT_C || '',
	);
	const [listStatus, setListStatus] = useState<
		{ label: string; value: string; }[]
	>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
			const response = (await getLisStatusRefCustomer({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			})) as any;
			const dataResponse = response.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));
			setListStatus(dataResponse);
		});
	}, []);

	useEffect(() => {
		if (!customerSelected) return;

		setCustomerName(customerSelected?.LS_NM);
		setTaxCode(customerSelected?.TAX_CODE.trim())
	}, [customerSelected]);

	const _onPressSave = async () => {
		setLoading(true);
		const objectParam = {
			userId: dataUserSystem.EMP_NO,
			referralCustomerId: referralCustomer?.id,
			leseId: customerSelected?.LESE_ID || referralCustomer?.lesE_ID,
			leseType: typeSelected,
			leseName: customerName,
			taxCode: taxCode,
			regID: customerSelected?.REG_ID || referralCustomer?.reG_ID,
			keyPerson,
			status: statusSelected,
			dealerId: dealerSelected?.ID || referralCustomer?.dealeR_ID,
			saleManId: salesmanSelected?.salemaN_ID,
			telephone,
		};

		await insertReferralCustomer(removeEmptyField(objectParam));

		const response = (await getReferralCustomer({
			userId: dataUserSystem.EMP_NO,
			searchKey,
			fromDate: searchKey
				? moment().subtract('10', 'years').format('DDMMYYYY')
				: moment().subtract('1', 'months').format('DDMMYYYY'),
			toDate: moment().format('DDMMYYYY'),
		})) as IReferralCustomer[];
		setReferralCustomers(response);
		setLoading(false);
		setTimeout(() => {
			navigation.goBack();
		}, 200);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header
					title={
						referralCustomer
							? 'Detail Referral Customer'
							: 'Create New Referral Customer'
					}
				/>
			</View>

			{doneLoadAnimated ? (
				<ScrollView style={{ flex: 1, padding: 8, backgroundColor: '#fff' }}>
					<View style={{ marginTop: 8, marginBottom: 12 }}>
						<TextInputCustomComponent
							label={`Customer Name`}
							placeholder="Choose customer"
							enable={true}
							iconRight={'search-outline'}
							value={customerName}
							multiline={true}
							onPress={() =>
								navigation.navigate('ChooseCustomerModal', {
									idCustomerExisted: customerSelected?.LS_NM,
									screenBack: 'ReferralCustomerDetailScreen',
								})
							}
							onChangeText={setCustomerName}
						/>
					</View>

					<TextInputCustomComponent
						label={typeSelected === '1' ? 'TaxCode' : 'ID No./ Passport'}
						placeholder=""
						autoCapitalize="characters"
						style={{ flex: 1, marginBottom: 12 }}
						value={taxCode}
						enable={true}
						onChangeText={setTaxCode}
					/>

					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<TextInputCustomComponent
							label="Key person"
							placeholder=""
							autoCapitalize="words"
							style={{ flex: 1, marginRight: 8 }}
							value={keyPerson}
							onChangeText={setKeyPerson}
						/>

						<TextInputCustomComponent
							label="Telephone No."
							placeholder=""
							autoCapitalize="none"
							keyboardType="number-pad"
							style={{ flex: 1 }}
							value={telephone}
							onChangeText={setTelephone}
						/>
					</View>

					<TextInputCustomComponent
						label={`Dealer Name`}
						placeholder="Choose dealer"
						enable={false}
						iconRight={'search-outline'}
						value={dealerSelected?.SELLER_NM || referralCustomer?.selleR_NM}
						style={{ marginBottom: 12 }}
						multiline={true}
						onPress={() =>
							navigation.navigate('ChooseDealerModal', {
								taxCodeSaleManSelected: dealerSelected?.TAX_CODE,
								screenBack: 'ReferralCustomerDetailScreen',
							})
						}
					/>

					<TextInputCustomComponent
						label={`Salesman Name`}
						placeholder="Choose salesman"
						enable={false}
						iconRight={'search-outline'}
						value={salesmanSelected?.salemaN_NM || referralCustomer?.salemaN_NM}
						style={{ marginBottom: 12 }}
						multiline={true}
						onPress={() =>
							navigation.navigate('ChooseSaleManModal', {
								idSaleManSelected: dealerSelected?.SELLER_NM,
								dealerId: dealerSelected?.ID || referralCustomer?.dealeR_ID,
								screenBack: 'ReferralCustomerDetailScreen',
							})
						}
					/>

					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<TextInputCustomComponent
							label="Time create"
							placeholder=""
							autoCapitalize="characters"
							style={{ flex: 1, marginRight: 8 }}
							value={
								referralCustomer?.datE_CREATE.replace(/\./g, '/') ||
								moment().format('DD/MM/YYYY')
							}
							enable={false}
						/>

						<TextInputCustomComponent
							label="PIC"
							placeholder=""
							autoCapitalize="words"
							style={{ flex: 1 }}
							value={referralCustomer?.mo || dataUserSystem.EMP_NM}
							enable={false}
						/>
					</View>

					<PickerCustomComponent
						showLabel={true}
						listData={listStatus.filter(
							item => item.value === '' || item.value === '01' || item.value === statusSelected,
						)}
						label="Status"
						value={statusSelected}
						style={{ flex: 1, marginBottom: 12 }}
						onValueChange={setStatusSelected}
					/>

					<View style={{ marginBottom: 12 }}>
						<Text style={{ color: '#555', fontWeight: '500' }}>
							Type of Customer
						</Text>
						<RadioForm formHorizontal={true} animation={true}>
							{listCustomerType.map((obj, index) => (
								<RadioButton labelHorizontal={true} key={index}>
									<RadioButtonInput
										obj={obj}
										index={index}
										isSelected={typeSelected === obj.value}
										onPress={() => setTypeSelected(obj.value)}
										borderWidth={1}
										buttonInnerColor={Color.main}
										buttonOuterColor={
											typeSelected === obj.value ? '#2196f3' : '#5a5a5a'
										}
										buttonSize={14}
										buttonOuterSize={20}
										buttonWrapStyle={{ paddingVertical: 8 }}
									/>
									<RadioButtonLabel
										obj={obj}
										index={index}
										labelHorizontal={true}
										onPress={() => setTypeSelected(obj.value)}
										labelStyle={{
											color:
												typeSelected === obj.value ? Color.main : '#5a5a5a',
											fontWeight: '500',
											marginLeft: -4,
											marginRight: 20,
										}}
									/>
								</RadioButton>
							))}
						</RadioForm>
					</View>

					<Button
						mode="contained"
						uppercase={false}
						onPress={_onPressSave}
						loading={loading}
					>
						{loading ? 'Loading...' : 'Save'}
					</Button>

					<View style={{ height: 60 }} />
				</ScrollView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}

export { ReferralCustomerDetailScreen };
