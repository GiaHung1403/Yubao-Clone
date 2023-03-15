import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { Button, Card, Checkbox, Switch, useTheme } from 'react-native-paper';

import Header from '@components/Header';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { ICustomer, ITele, IUserSystem } from '@models/types';
import { useSelector } from 'react-redux';
import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from 'react-native-simple-radio-button';
import moment from 'moment';

import {
	checkCIC,
	validateCIC_24H,
	get_CIC_Type,
	getListRelationship,
} from '@data/api';
import * as Keychain from 'react-native-keychain';
import styles from './styles';
// import { get_CIC_Type } from '@data/api/api_cic';

// interface IRouteParams {
// 	cicRequest: ITele;
// 	route: any;
// }

interface IRouteParams {
	customerSelected: ICustomer;
	leseID: any;
	customerName: any;
}

export function CICRequestDetailScreen(props: any) {
	// const { cicRequest } = props;
	const { customerSelected, leseID, customerName }: IRouteParams =
		props.route.params;

	const navigation: any = useNavigation();
	let toDay = new Date();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [LESE_ID, setLESE_ID] = useState('');
	// const [customerName, setCustomerName] = useState('');
	const [address, setAddress] = useState<string>(customerSelected?.ADDR);
	const [name, setName] = useState<string>('');
	const [userID, setUserID] = useState('');
	const [taxCode, setTaxCode] = useState('');
	const [CIC_Type, setCIC_Type] = useState('S10A');
	const [List_CIC_Type, setList_CIC_Type] = useState<any>([]);
	const [relationship, setRelationship] = useState('');
	const [listRelationship, setListRelationship] = useState<any>([]);
	const [other, setOther] = useState('');

	const listCustomerType = [
		{ label: 'Company', value: 1 },
		{ label: 'Individual', value: 2 },
	];

	const [indexRadioButton, setIndexRadioButton] = useState<number>(1);
	const { colors } = useTheme();

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			getDataCIC_Type(indexRadioButton);
			setLESE_ID(leseID);
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;
			const data: any = await getListRelationship({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
			});

			const convertData = data.map(item => ({
				label: item?.STND_C_NM,
				value: item?.C_NO,
			}));
			setListRelationship(convertData);
			setRelationship('1');
		});
	}, []);

	const getDataCIC_Type = async seq => {
		setIndexRadioButton(seq);
		const data: any = await get_CIC_Type({
			seq,
		});
		let convertData = data.map(({ product_ID, product_Name }) => ({
			label: product_Name,
			value: product_ID,
		}));
		setList_CIC_Type(convertData);
	};

	useEffect(() => {
		relationship !== '9' ? setOther('') : null;
	}, [relationship]);

	useEffect(() => {
		indexRadioButton === 2 ? setCIC_Type('S11A') : setCIC_Type('S10A');
	}, [indexRadioButton]);

	// useEffect(() => {
	// 	if (customerSelected !== undefined) {
	// 		setCustomerName(customerSelected?.LS_NM);
	// 	}
	// }, [customerSelected]);

	const validate = () => {
		const regexTextvalue = /[A-Za-z]/;
		const regexName = /[\[\]\^\$\|\?\*\+\(\)\\~`\!@#%&+={}'""<>:]/;
		const regexID = /[\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&_+={}'""<>:;, \/]/;
		const regexAddress = /[\[\]\^\$\|\?\*\\~\!@#%+={}'""<>:]/;
		if (
			name.match(regexTextvalue) === null ||
			name === null ||
			regexName.test(name.trim()) ||
			name.trim().length <= 2 ||
			name.trim() === customerSelected?.ADDR_V.trim() ||
			name.trim() === ' ' ||
			name.trim() === ''
		)
			return false;

		if (
			address.match(regexTextvalue) === null ||
			address === null ||
			regexAddress.test(address.trim()) ||
			address.trim() === ' ' ||
			address.trim() === ''
		)
			return false;

		if (indexRadioButton === 1) {
			if (
				taxCode === null ||
				regexID.test(taxCode.trim()) ||
				taxCode.trim().length < 7 ||
				taxCode.trim() === ' ' ||
				taxCode.trim() === ''
			)
				return false;
		} else {
			if (
				userID === null ||
				regexID.test(userID.trim()) ||
				userID.trim().length < 7 ||
				userID.trim() === ' ' ||
				userID.trim() === ''
			)
				return false;
		}

		return true;
	};

	const validate_24H = async (fromDate, toDate, action, loaiSP) => {
		const result: any = await validateCIC_24H(
			indexRadioButton === 2
				? {
						msThue: '',
						dkkd: '', //userID.trim(),
						soCMT: userID.trim(),
						fromDate,
						toDate,
						action,
						loaiSP,
				  }
				: {
						msThue: taxCode.trim(),
						dkkd: taxCode.trim(),
						soCMT: '',
						fromDate,
						toDate,
						action,
						loaiSP,
				  },
		);

		if (result?.result === 1) return true;
		else return false;
	};

	const getDateForValidate = () => {
		let toDate = new Date();
		let fromDate = new Date();
		toDate.setDate(10);
		fromDate.setDate(10);
		fromDate.setMonth(fromDate.getMonth() - 1);
		if (toDay >= toDate) {
			let temp = new Date(toDate);
			fromDate = temp;
			toDate.setMonth(toDay.getMonth() + 1);
		}
		return { fromDate, toDate };
	};

	const showConfirmDialog = () => {
		return Alert.alert(
			'Are your sure?',
			'Are you sure you want to check this CIC ???',
			[
				// The "Yes" button
				{
					text: 'Yes',
					onPress: () => {
						_onPre_CheckCIC();
					},
				},
				// The "No" button
				// Does nothing but dismiss the dialog when tapped
				{
					text: 'No',
				},
			],
		);
	};

	const _onPre_CheckCIC = async () => {
		//Validate ký tự
		if (await !validate()) {
			Alert.alert('Invalid name !!!');
			return;
		}

		//Validate check trong 24h
		if (await !validate_24H(toDay, toDay, 'CHECK_VALID_DAY', CIC_Type)) {
			Alert.alert("Can't check again in 24h !!!");
			return;
		}

		//Validate check từ ngày 10 và 30 ngày
		let date = getDateForValidate();
		if (await !validate_24H(date.fromDate, date.toDate, '', CIC_Type)) {
			Alert.alert("Can't check again in 30 day !!!");
			return;
		}

		//Validate check CIC Type
		if (CIC_Type === '') {
			Alert.alert('Please choose your CIC type !!!');
			return;
		}

		if (indexRadioButton === 2) {
			await checkCIC({
				lesE_ID: LESE_ID,
				loaiSP: CIC_Type,
				tenKH: name,
				diaChi: address,
				msThue: '',
				dkkd: '',
				soCMT: userID,
				User_ID: dataUserSystem.EMP_NO,
				relationship_ID: relationship,
				relationship_Other: other,
			});
		} else {
			checkCIC({
				lesE_ID: LESE_ID,
				loaiSP: CIC_Type,
				tenKH: name,
				diaChi: address,
				msThue: taxCode,
				dkkd: taxCode,
				soCMT: '',
				User_ID: dataUserSystem.EMP_NO,
				relationship_ID: relationship,
				relationship_Other: other,
			});
		}
		navigation.goBack();
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'CIC Request New'} />

			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, padding: 8 }}
			>
				<Card style={{ padding: 8, marginBottom: 8 }}>
					<TextInputCustomComponent
						label="Customer"
						placeholder="Customer"
						style={{ marginBottom: 8 }}
						// value={customerSelected?.LS_NM || cicRequest?.LESE_NAME}
						value={customerName}
						// onChangeText={text => {
						// 	setCustomerName(text);
						// }}
						iconRight={'search-outline'}
						onPress={() =>
							// navigation.navigate('ChooseCustomerModal', {
							// 	idCustomerExisted: customerSelected?.LESE_ID,
							// 	screenBack: 'CICRequestDetailScreen',
							// })
							null
						}
					/>

					<TextInputCustomComponent
						label="Name(VN)"
						placeholder=""
						style={{ marginBottom: 8 }}
						multiline
						value={name}
						onChangeText={text => setName(text)}
					/>
					<TextInputCustomComponent
						label="Address(VN)"
						placeholder=""
						style={{ marginBottom: 8 }}
						multiline
						value={address}
						onChangeText={text => setAddress(text)}
					/>

					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listRelationship}
							label="Relationship"
							value={relationship}
							style={{ flex: 1, marginRight: 8 }}
							onValueChange={text => {
								setRelationship(text);
							}}
						/>
						<TextInputCustomComponent
							label=""
							enable={relationship === '9' ? true : false}
							placeholder=""
							style={{ flex: 1, marginTop: 3 }}
							value={other}
							onChangeText={text => setOther(text)}
						/>
					</View>

					<View style={{ flex: 1, padding: 8 }}>
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
										onPress={() => getDataCIC_Type(obj.value)}
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
										onPress={() => getDataCIC_Type(obj.value)}
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

					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						{indexRadioButton === 1 ? (
							<TextInputCustomComponent
								label="Tax Code"
								placeholder=""
								keyboardType="number-pad"
								style={{ flex: 1, marginRight: 8 }}
								value={taxCode}
								onChangeText={text => setTaxCode(text)}
							/>
						) : (
							<TextInputCustomComponent
								label="ID.No./Passport.No."
								placeholder=""
								style={{ flex: 1, marginRight: 8 }}
								value={userID}
								onChangeText={text => setUserID(text)}
							/>
						)}

						<PickerCustomComponent
							showLabel={true}
							listData={List_CIC_Type}
							label="CIC Type"
							value={CIC_Type}
							style={{ flex: 1 }}
							onValueChange={text => setCIC_Type(text)}
						/>
					</View>

					{/* <View style={{ flexDirection: 'row' }}>
						<PickerCustomComponent
							listData={[
								{ label: 'Company', value: 1 },
								{ label: 'Individual', value: 2 },
							]}
							label="Type of Customer"
							value={customerType}
							style={{ flex: 1, marginRight: 8 }}
							onValueChange={text => setCustomerType(text)}
						/>
					</View> */}
				</Card>

				{/* <Card style={{ padding: 8 }}>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <PickerCustomComponent
              listData={[]}
              label="Organizer"
              value={'0'}
              style={{ flex: 1, marginRight: 8 }}
              onValueChange={(text) => null}
            />

            <PickerCustomComponent
              listData={[]}
              label="Province/ City"
              value={'0'}
              style={{ flex: 1 }}
              onValueChange={(text) => null}
            />
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <PickerCustomComponent
              listData={[]}
              label="District"
              value={'0'}
              style={{ flex: 1, marginRight: 8 }}
              onValueChange={(text) => null}
            />

            <PickerCustomComponent
              listData={[]}
              label="Ward"
              value={'0'}
              style={{ flex: 1 }}
              onValueChange={(text) => null}
            />
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <TextInputCustomComponent
              label="Distance"
              placeholder=""
              style={{ flex: 1, marginRight: 8 }}
              value={''}
            />

            <TextInputCustomComponent
              label="Destination"
              placeholder=""
              style={{ flex: 1 }}
              value={''}
            />
          </View>
        </Card> */}

				<View style={{ flexDirection: 'row', marginTop: 8 }}>
					<Button
						mode="contained"
						style={{ flex: 1, marginRight: 8 }}
						uppercase={false}
						onPress={() => showConfirmDialog()}
					>
						{'Check'}
					</Button>
				</View>
				<SafeAreaView style={{ height: 60 }} />
			</ScrollView>
		</View>
	);
}
