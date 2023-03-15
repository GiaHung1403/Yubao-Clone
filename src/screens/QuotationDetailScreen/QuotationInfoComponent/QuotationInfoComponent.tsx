import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
	calculationQuotation,
	getListTenor,
	getQuotationDetail,
} from '@actions/quotation_action';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Colors from '@config/Color';
import {
	confirmQuotation,
	getListBranch,
	getListQuotationInterestRate,
	getQuotationPerType,
	insertTenorQuotation,
	insertUpdateQuotation,
	getLisOtherFee,
	getDiscountRate,
} from '@data/api';
import {
	IBranch,
	ICustomer,
	IQuotation,
	IQuotationCalculation,
	IQuotationDetail,
	IQuotationTenor,
	IUserSystem,
} from '@models/types';
import { convertUnixTimeDDMMYYYY, formatVND, parseFloatUtil } from '@utils';
import moment from 'moment';
import TextInputCustomComponentForTenor from '@components/TextInputCustomComponentForTenor';
import openLink from '@utils/openLink';
import { flex } from 'styled-system';
import ChooseFontModal from './ChooseFontModal';

import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from 'react-native-simple-radio-button';

interface IProps {
	QUO_ID: string;
	customerSelected: ICustomer;
	jumpTo: any;
	quO_RPT: any;
}

interface IDataPicker {
	value: number | string;
	label: string;
}

const listTypeOfCalculation: any = [
	{ label: 'PMT', value: '1' },
	{ label: 'Equal Principle', value: '3' },
];

const listIRRMethod: any = [{ label: 'Cost down', value: 1 }];

const listPaymentMethod: any = [
	{ label: 'Arrears', value: '1' },
	{ label: 'Advance', value: '2' },
];

const listCreditGrantingFeeRatio: any = [
	{ label: 'Whole Period', value: '01' },
	{ label: 'Annual', value: '02' },
];

const listResidualValueType: any = [
	{ label: 'Choose', value: '0' },
	{ label: 'End of expiry date', value: '01' },
];

const listCurrencyType: any = [
	{ label: 'USD', value: 'USD' },
	{ label: 'VND', value: 'VND' },
];
let listKindOfFee: any = [{}];

interface IQuotationReducer {
	quotationDetail: IQuotationDetail;
	quotationCalculation: IQuotationCalculation;
}

export default function QuotationInfoComponent(props: IProps) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { QUO_ID, customerSelected, jumpTo, quO_RPT } = props;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { quotationDetail, quotationCalculation }: IQuotationReducer =
		useSelector((state: any) => state.quotation_reducer);

	const { colors } = useTheme();
	const listTenor: IQuotationTenor[] = useSelector(
		(state: any) => state.quotation_reducer.listTenorQuotation,
	);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [listBranch, setListBranch] = useState<IDataPicker[]>([]);
	const [branchSelected, setBranchSelected] = useState<string>('-1');
	// const [typeOfCalculation, setTypeOfCalculation] = useState<any>(
	// 	listTypeOfCalculation[0].value,
	// );

	console.log('====================================');
	console.log(listTenor);
	console.log('====================================');

	const modalFontRef = useRef<any>();
	const [typeOfCalculation, setTypeOfCalculation] = useState<any>('1');

	const [IRRMethod, setIRRMethod] = useState<any>(listIRRMethod[0].value);
	// const [paymentMethod, setPaymentMethod] = useState<any>(
	// 	listPaymentMethod[0].value,
	// );
	const [paymentMethod, setPaymentMethod] = useState<any>('1');

	const [discountRate, setDiscountRate] = useState<string>('');
	const [creditGrantingFeeType, setCreditGrantingFeeType] = useState<any>(
		listCreditGrantingFeeRatio[0].value,
	);
	const [creditGrantingFeeRatio, setCreditGrantingFeeRatio] =
		useState<any>('0');
	const [leaseAssetValue, setLeaseAssetValue] = useState<number>(0);
	const [leasedAssetValueFormat, setLeasedAssetValueFormat] = useState('');
	const [currencySelected, setCurrencySelected] = useState<string>('VND');
	const [listInterestRate, setListInterestRate] = useState<any>([]);
	const [interestRateSelected, setInterestRateSelected] = useState<string>('0');
	const [residualValueType, setResidualValueType] = useState<any>(
		listResidualValueType[1].value,
	);
	const [residualValueRatio, setResidualValueRatio] = useState<string>('');
	const [financingRatio, setFinancingRatio] = useState<string>('');
	const [depositRatio, setDepositRatio] = useState<string>('');
	const [riskPremium, setRiskPremium] = useState<string>('');
	const [baseRate, setBaseRate] = useState<string>('');
	const [otherFeeAmount, setOtherFeeAmount] = useState<string>('0');
	const [markupRate, setMarkupRate] = useState<string>('0');
	const [markupRate2, setMarkupRate2] = useState<string>('0');
	const [VAT, setVAT] = useState<string>('');
	const [tenor, setTenor] = useState<string>('');
	const [RMKS, setRMKS] = useState<string>(quotationDetail?.rmks || '');
	const [showAllTenor, setShowAllTenor] = useState<boolean>(false);
	const [listTenorLocal, setListTenorLocal] = useState<IQuotationTenor[]>([]);
	const [perType, setPerType] = useState<number>(0);
	const [kindOfFee, setkindOfFee] = useState('0');
	const [loadingSave, setLoadingSave] = useState<boolean>(false);
	const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);

	const [listChoose, setNewChoose] = useState<any>([
		{ From: '', To: '', Tenor: '', id: 1 },
	]);


	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);

			if (QUO_ID) {
				setLoading(true);
				dispatch(
					getQuotationDetail({
						QUO_ID,
					}),
				);
			}

			const responseBranch: IBranch[] = (await getListBranch({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			})) as IBranch[];

			const listFee: any = await getLisOtherFee({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			});
			listKindOfFee = listFee
				.filter(item => item.C_NO != '')
				.map(item => ({
					label: item?.STND_C_NM,
					value: item?.C_NO,
				}));

			const listBranchConvert: IDataPicker[] = responseBranch.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));

			setListBranch(listBranchConvert);
		});
	}, []);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const date = new Date();
			const disCount: any = await getDiscountRate({
				CUR_C: currencySelected,
				YEAR: date.getFullYear(),
				MONTH: date.getMonth() + 1,
			});
			setDiscountRate(disCount?.rate.toString());
		});
	}, [currencySelected]);

	useEffect(() => {
		if (quotationDetail) {
			setTypeOfCalculation(quotationDetail.calc_TP);
			setPaymentMethod(quotationDetail.paY_MOD);
			setDiscountRate(quotationDetail.diS_R);
			setCreditGrantingFeeType(quotationDetail.mR_TP);
			setCreditGrantingFeeRatio(quotationDetail.maN_FEE_R);
			setLeaseAssetValue(
				parseFloat(quotationDetail?.leasE_VALUE?.split(',').join('')),
			);
			setLeasedAssetValueFormat(
				formatVND(quotationDetail.leasE_VALUE?.split(',').join('').toString()),
			);
			setCurrencySelected(quotationDetail.cuR_C);
			setInterestRateSelected(quotationDetail.inT_R_TP);
			setResidualValueType(quotationDetail.rV_TP);
			setFinancingRatio(quotationDetail.fiN_R);
			setDepositRatio(quotationDetail.deP_R);
			setTenor(quotationDetail.leasE_P?.toString());
			setRiskPremium(quotationDetail.irR_NOT_FEE?.toString());
			setVAT(quotationDetail?.vat);
			setResidualValueRatio(quotationDetail?.reS_VAL_R);
			setMarkupRate(quotationDetail?.m_RATE?.toString());
			setMarkupRate2(quotationDetail?.m_RATE2?.toString());
			setPerType(quotationDetail.perType);
			setOtherFeeAmount(quotationDetail.otheR_FEE.toString());
			setkindOfFee(quotationDetail?.otherFeeKind.toString());
		}
	}, [quotationDetail]);

	useEffect(() => {
		(async function getPerType() {
			if (interestRateSelected) {
				const perTypeResponse: any = await getQuotationPerType({
					interestRateCode: interestRateSelected,
				});
				setPerType(perTypeResponse.c_Value);
			}
		})();
		if (interestRateSelected === '0909' || interestRateSelected === '0') {
			setMarkupRate('0');
		}

		if (interestRateSelected !== '2306' && interestRateSelected !== '2303') {
			setMarkupRate2('0');
		}
	}, [interestRateSelected]);

	useEffect(() => {
		(async function getListInterestRate() {
			const responseInterestRate: any = await getListQuotationInterestRate({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				QUO_ID,
				CUR_C: currencySelected,
			});

			const interestRateConvert = responseInterestRate.map(interest => ({
				label: interest.stnd_c_nm,
				value: interest.c_no,
				baseRate: interest.intr,
			}));

			setListInterestRate(interestRateConvert);
			setInterestRateSelected('0');

			dispatch(
				getListTenor({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					QUO_ID,
				}),
			);
		})();
	}, [currencySelected]);

	useEffect(() => {
		if (!interestRateSelected || listInterestRate.length === 0) return;
		const interestRateFind = listInterestRate.find(
			item => item.value === interestRateSelected,
		);
		// console.log(listInterestRate, interestRateSelected);
		setBaseRate(
			interestRateFind?.baseRate !== null
				? interestRateFind?.baseRate?.toString()
				: '0',
		);
	}, [interestRateSelected]);

	const missingValue =
		100 * parseInt(tenor, 10) -
		listTenorLocal?.reduce(
			(total, currentItem) =>
				parseInt(total.toString(), 10) +
				parseInt(currentItem?.percentage.toString(), 10),
			0,
		);

	// const sumTenor = sum(...listTenorLocal?.Percentage);

	const _onPressCalculation = () => {
		setListTenor();
	};

	const _onPressInsertUpdate = async flag => {
		if (!customerSelected && !quotationDetail) {
			Alert.alert('Warning', 'Please choose customer!');
			return;
		}

		if (!quotationDetail && !quotationCalculation) {
			Alert.alert('Warning', 'PLease calculation again!');
			return;
		}

		setLoadingSave(true);
		try {
			const response = (await insertUpdateQuotation({
				isInsert: flag === 'I',
				QUO_ID: QUO_ID || '',
				QUO_DATE: moment().format('MM/DD/YYYY'),
				CNID: flag === 'I' ? '' : quotationDetail?.cnid,
				PAY_MOD: paymentMethod,
				CUR_C: currencySelected,
				ACQT_AMT: (parseFloatUtil(financingRatio) / 100) * leaseAssetValue,
				FIN_R: financingRatio,
				MAN_FEE_R: creditGrantingFeeRatio,
				DEP_R: depositRatio,
				RES_VAL_R: residualValueRatio,
				MAN_FEE_AMT:
					(leaseAssetValue * parseFloatUtil(creditGrantingFeeRatio)) / 100,
				DEP_AMT: (leaseAssetValue * parseFloatUtil(depositRatio)) / 100,
				RES_VAL_AMT:
					(leaseAssetValue * parseFloatUtil(residualValueRatio)) / 100,
				LEASE_P: tenor,
				LESE_ID: customerSelected?.lese_ID || quotationDetail?.lesE_ID,
				LEASE_COST: (
					leaseAssetValue / (1 + parseFloat(VAT) / 100) || 0
				).toFixed(0),
				LEASE_VALUE: leaseAssetValue,
				VAT,
				B_RATE: parseFloatUtil(baseRate),
				M_RATE: parseFloatUtil(markupRate),
				M_RATE2: parseFloatUtil(markupRate2),
				DIS_R: parseFloatUtil(discountRate),
				IRR: quotationCalculation.lblIRR.replace('%', ''),
				NPV: quotationCalculation.lblNPV.replace('$', '').replace(/,/g, ''),
				IRR_TP: 2,
				PMT: quotationCalculation.lblPMT.replace('$', '').replace(/,/g, ''),
				CALC_TP: typeOfCalculation,
				OP_EMP_NO: dataUserSystem.EMP_NO,
				INT_R_TP: interestRateSelected,
				D_RATE: 0,
				SetOff: 0,
				RMKS,
				RV_TP: residualValueType,
				EXP_DELAY: 0,
				ASTS_TP: 0,
				ADV_SD: 0,
				OTHER_FEE: otherFeeAmount,
				IRR_NOT_FEE: 0,
				DEP_PMT_TP: 0,
				RES_PMT_TP: 0,
				MR_TP: creditGrantingFeeType,
				PerType: perType,
				USER_LOGIN: dataUserSystem.EMP_NO,
				IRR_TYPE: IRRMethod,
				Downpament_R: 100 - parseFloatUtil(financingRatio),
				Downpament_A:
					leaseAssetValue -
					(parseFloatUtil(financingRatio) / 100) * leaseAssetValue,
				TotalEx_R:
					100 -
					parseFloatUtil(depositRatio) -
					(100 - parseFloatUtil(financingRatio)),
				TotalEx_A:
					(leaseAssetValue *
						(100 -
							parseFloatUtil(depositRatio) -
							(100 - parseFloatUtil(financingRatio)))) /
					100,
				otherFeeKind: kindOfFee,
			})) as any;

			await insertTenorQuotation({
				QUO_ID: response.quo_ID,
				listTenor: quotationCalculation.quoSteps.map(item => ({
					beginBlance: item.beginBlance,
					cashFlow: item.cashFlow,
					interest: item.interest,
					interestVAT: item.interestVAT,
					percentage: item.percentage,
					principle: item.principle,
					principleVAT: item.principleVAT,
					quO_ID: response.quo_ID,
					rental: item.rental,
					tenor: item.tenor,
					action: 'AddNew',
				})),
			});

			// setLoadingSave(false);
			navigation.goBack();
			Alert.alert('Success!', 'Update data quotation success!');
		} catch (e: any) {
			setLoadingSave(false);
			Alert.alert('Error', 'Something wrong! Please try again!');
		}
	};

	const _onPressConfirm = () => {
		Alert.alert('Alert', 'Do you want to comfirm this?', [
			{ text: 'Cancel' },
			{
				text: 'OK',
				onPress: async () => {
					if (branchSelected === '-1') {
						Alert.alert('Alert', 'You need to choose Branch', [{ text: 'Ok' }]);
					} else {
						setLoadingConfirm(true);
						try {
							await confirmQuotation({
								QUO_ID,
								CNID: quotationDetail?.cnid,
								lese_ID: customerSelected?.lese_ID || quotationDetail.lesE_ID,
								brand_Code: branchSelected,
								userID: dataUserSystem.EMP_NO,
							});
							navigation.goBack();
						} catch (error) {
							setLoadingConfirm(false);
							console.log(error);
						}
					}
				},
			},
		]);
	};

	const _onPressDelete = () => {
		Alert.alert('Alert', 'Do you want to delete this?', [
			{ text: 'Cancel' },
			{
				text: 'OK',
				onPress: async () => {
					navigation.goBack();
				},
			},
		]);
	};

	const _onPressNewChoose = (item: any) => {
		if (listChoose.length > 5) {
			Alert.alert('Alert', 'Can only get 6 row', [
				{
					text: 'OK',
				},
			]);
		} else {
			setNewChoose(value => [...value, item]);
		}
	};

	const _onPressX = index => {
		if (index < 2) {
			if (listChoose.length > 1) {
				listChoose.splice(listChoose.length - 1, 1);
				setNewChoose([...listChoose]);
			} else {
				Alert.alert('Alert', 'Need to have more than 1 choose!!!');
			}
		} else {
			listChoose.splice(index, 1);

			let newData = [...listChoose];
			listChoose.forEach((item, index) => {
				newData[index] = { ...newData[index], value: index + 1 };
			});
			setNewChoose([...newData]);
		}
	};

	const _onTextInPutChangce = (text, index, from, id) => {
		if (from === 1) {
			let newData = [...listChoose];
			newData[index] = { ...newData[index], From: text };
			setNewChoose(newData);
		}
		if (from === 2) {
			let newData = [...listChoose];
			newData[index] = { ...newData[index], To: text };
			setNewChoose(newData);
		}
		if (from === 3) {
			let newData = [...listChoose];
			newData[index] = { ...newData[index], Tenor: text };
			setNewChoose(newData);
		}
	};

	const setListTenor = () => {
		let listTemp: any = [];
		let i;
		if (paymentMethod === '1' && typeOfCalculation !== '3')
			listTemp.push({
				Tenor: 0,
				Percentage: 0,
			});

		listChoose.forEach(item => {
			for (i = item?.From; i <= item?.To; i++) {
				listTemp.push({
					Tenor: i,
					Percentage: item?.Tenor,
				});
			}
		});
		if (paymentMethod === '2')
			listTemp.push({
				Tenor: listTemp.length,
				Percentage: 0,
			});

		setListTenorLocal(listTemp);
	};

	const _onPressViewFileItem = () => {
		// openLink(quO_RPT).then();
		// navigation.navigate('WebviewScreen', {
		// 	title: `Print`,
		// 	url: quO_RPT.replace('type=1', 'type=4'),
		// 	isShowButton: true,
		// });
		modalFontRef.current.onShowModal(true);
	};

	const _onPress_Share = type => {
		console.log(quO_RPT);

		navigation.navigate('WebviewScreen', {
			title: `Print`,
			url: quO_RPT.replace('type=1', `type=${type}`),
			isShowButton: true,
		});
	};


	useEffect(() => {
		// calculation();
		if (listTenorLocal?.length != 0 && listTenorLocal) {
			if (missingValue !== 0) {
				Alert.alert('Warning', 'You missing some value!');
				return;
			}
			dispatch(
				calculationQuotation({
					QuoDate: convertUnixTimeDDMMYYYY(new Date().getTime() / 1000),
					LEASE_P: tenor,
					PAY_MOD: paymentMethod,
					DIS_R: parseFloatUtil(discountRate),
					PerType: perType,
					ACQT_AMT: (parseFloatUtil(financingRatio) / 100) * leaseAssetValue,
					CALC_TP: typeOfCalculation,
					DEP_AMT: (leaseAssetValue * parseFloatUtil(depositRatio)) / 100,
					B_RATE: parseFloatUtil(baseRate),
					M_RATE: parseFloatUtil(markupRate),
					M_RATE2: parseFloatUtil(markupRate2),
					RV_TP: residualValueType,
					IRR_TYPE: IRRMethod,
					MAN_FEE_AMT:
						(leaseAssetValue * parseFloatUtil(creditGrantingFeeRatio)) / 100,
					RES_VAL_AMT:
						(leaseAssetValue * parseFloatUtil(residualValueRatio)) / 100,
					CUR_C: currencySelected,
					LIST_TENOR: listTenorLocal.map(item => ({
						Tenor: item.tenor,
						Percentage: item.percentage,
					})),
					OTHER_FEE: kindOfFee,
					txtOtherFee: parseFloatUtil(otherFeeAmount),
				}),
			);

			jumpTo('result');
		}
	}, [listTenorLocal]);

	useEffect(() => {
		let From = 1;
		const temp = listTenor?.map(item => ({
			Tenor: item.tenor,
			Percentage: item.percentage,
		}));

		if (paymentMethod === '1' && temp) {
			temp.splice(0, 1);
			From = 1;
		} else if (temp) {
			From = 0;
			temp.splice(temp.length - 1, 1);
		}

		let index = 0;
		let newData = [...listChoose];
		if (temp != null && listTenor.length != 0) {
			for (let i = 0; i < temp?.length - 1; i++) {
				if (temp[i]?.Percentage != temp[i + 1]?.Percentage) {
					newData[index] = {
						...newData[index],
						From: From.toString(),
						To: i.toString(),
						Tenor: temp[i]?.Percentage.toString(),
					};

					index++;
					From = i + 1;
				}
			}
			newData[index] = {
				...newData[index],
				From: From.toString(),
				To:
					paymentMethod === '1'
						? (temp?.length).toString()
						: (temp?.length - 1).toString(),
				Tenor: temp[temp?.length - 2]?.Percentage.toString(),
			};
			setNewChoose(newData);
		}
	}, [listTenor]);

	const calculation = () => {
		// const Financing_Amount: any =
		// 	(parseFloatUtil(financingRatio) / 100) * leaseAssetValue

		const Down_Payment_Ratio = 100 - parseFloatUtil(financingRatio);
		const down_payment_AMT =
			leaseAssetValue -
			(parseFloatUtil(financingRatio) / 100) * leaseAssetValue;

		const Total_Exposure_Ratio =
			100 - parseFloatUtil(depositRatio) - Down_Payment_Ratio;

		const Total_Exposure_AMT = (leaseAssetValue * Total_Exposure_Ratio) / 100;
	};

	// useEffect(() => {
	// 	let newData = [...listChoose];
	// 	if (paymentMethod === '1' && tenor != '0') {
	// 		newData[0] = {
	// 			...newData[0],
	// 			From: '1',
	// 			To: tenor,
	// 			Tenor: '100',
	// 		};
	// 		setNewChoose(newData);
	// 	} else if (paymentMethod === '2' && tenor != '0') {
	// 		newData[0] = {
	// 			...newData[0],
	// 			From: '0',
	// 			To: (Number(tenor) - 1).toString(),
	// 			Tenor: '100',
	// 		};
	// 		setNewChoose(newData);
	// 	}
	// }, [paymentMethod]);

	// const [indexRadioButton, setIndexRadioButton] = useState<number>(0);

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<ScrollView style={{ flex: 1 }}>
						{/* View Customer Name */}
						<TextInputCustomComponent
							label="Customer Name"
							placeholder="Customer Name"
							enable={false}
							iconRight={'search-outline'}
							value={customerSelected?.ls_nm || quotationDetail?.lS_NM}
							style={{ marginHorizontal: 8, marginTop: 8 }}
							onPress={() =>
								navigation.navigate('ChooseCustomerModal', {
									idCustomerExisted:
										customerSelected?.lese_ID || quotationDetail?.lesE_ID,
									screenBack: 'QuotationDetailScreen',
								})
							}
						/>
						{/* View Type of Calculation and IRR Method */}
						{/* <View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<PickerCustomComponent
								listData={listTypeOfCalculation}
								label="Type of Calculation"
								value={typeOfCalculation}
								style={{ flex: 1, marginRight: 8 }}
								textStyle={{ maxWidth: 150 }}
								onValueChange={text => setTypeOfCalculation(text)}
							/> */}
						{/* <PickerCustomComponent
								listData={listIRRMethod}
								label="IRR Method"
								value={IRRMethod}
								style={{ flex: 1 }}
								textStyle={{ maxWidth: 150 }}
								onValueChange={text => setIRRMethod(text)}
							/> */}
						{/* <PickerCustomComponent
								listData={listPaymentMethod}
								label="Payment Method"
								value={paymentMethod}
								style={{ flex: 1 }}
								textStyle={{ maxWidth: 150 }}
								onValueChange={text => setPaymentMethod(text)}
							/>
						</View> */}

						<View
							style={{
								flex: 1,
								padding: 8,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<View style={{ flex: 1 }}>
								<Text style={{ fontWeight: '500', color: '#555' }}>
									Type of Calculation
								</Text>
								<RadioForm formHorizontal={true} animation={true}>
									{listTypeOfCalculation.map((obj, index) => (
										<RadioButton labelHorizontal={true} key={index}>
											<RadioButtonInput
												obj={obj}
												index={index}
												isSelected={typeOfCalculation === obj.value}
												onPress={() => setTypeOfCalculation(obj.value)}
												borderWidth={1}
												buttonInnerColor={colors.primary}
												buttonOuterColor={
													setTypeOfCalculation === obj.value
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
												onPress={() => setTypeOfCalculation(obj.value)}
												labelStyle={{
													color:
														typeOfCalculation === obj.value
															? colors.primary
															: '#5a5a5a',
													fontWeight: '500',
													marginLeft: -4,
													marginRight: 5,
												}}
											/>
										</RadioButton>
									))}
								</RadioForm>
							</View>
							<View style={{ flex: 1, marginLeft: 15 }}>
								<Text style={{ fontWeight: '500', color: '#555' }}>
									Payment Method
								</Text>
								<RadioForm formHorizontal={true} animation={true}>
									{listPaymentMethod.map((obj, index) => (
										<RadioButton labelHorizontal={true} key={index}>
											<RadioButtonInput
												obj={obj}
												index={index}
												isSelected={paymentMethod === obj.value}
												onPress={() => setPaymentMethod(obj.value)}
												borderWidth={1}
												buttonInnerColor={colors.primary}
												buttonOuterColor={
													paymentMethod === obj.value ? '#2196f3' : '#5a5a5a'
												}
												buttonSize={14}
												buttonOuterSize={20}
												buttonWrapStyle={{ paddingVertical: 12 }}
											/>
											<RadioButtonLabel
												obj={obj}
												index={index}
												labelHorizontal={true}
												onPress={() => setPaymentMethod(obj.value)}
												labelStyle={{
													color:
														paymentMethod === obj.value
															? colors.primary
															: '#5a5a5a',
													fontWeight: '500',
													marginLeft: -4,
													marginRight: 5,
												}}
											/>
										</RadioButton>
									))}
								</RadioForm>
							</View>
						</View>

						{/* View Payment Method */}
						{/* <View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<PickerCustomComponent
								listData={listPaymentMethod}
								label="Payment Method"
								value={paymentMethod}
								style={{ flex: 1, marginRight: 8 }}
								textStyle={{ maxWidth: 150 }}
								onValueChange={text => setPaymentMethod(text)}
							/>

							<TextInputCustomComponent
								label="Discount Rate(%)"
								enable={true}
								placeholder=""
								keyboardType="numeric"
								style={{ flex: 1 }}
								value={discountRate}
								onChangeText={text => setDiscountRate(text)}
							/>
						</View> */}

						{/* View Lease Asset Value and Discount Rate */}
						<View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<TextInputCustomComponent
								label="Lease Asset Value"
								placeholder="0"
								inputStyle={{ textAlign: 'right' }}
								keyboardType="numeric"
								style={{ flex: 1, marginRight: 8 }}
								value={leasedAssetValueFormat}
								onChangeText={text => {
									setLeaseAssetValue(parseFloat(text.split(',').join('')));
									setLeasedAssetValueFormat(
										formatVND(text.split(',').join('')),
									);
								}}
							/>
							<PickerCustomComponent
								showLabel={true}
								listData={listCurrencyType}
								label="Currency"
								value={currencySelected}
								style={{ flex: 1 }}
								textStyle={{ maxWidth: 150 }}
								onValueChange={text => setCurrencySelected(text)}
							/>
						</View>

						{/* View VAT and Lease Asset Cost */}
						<View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<TextInputCustomComponent
								label="VAT (%)"
								placeholder="0"
								keyboardType="numeric"
								style={{ flex: 1, marginRight: 8 }}
								value={VAT}
								inputStyle={{ textAlign: 'right' }}
								clearTextOnFocus={true}
								onChangeText={text => setVAT(text)}
							/>
							{/* <TextInputCustomComponent
								label="Lease Asset Cost"
								placeholder=""
								enable={false}
								keyboardType="numeric"
								style={{ flex: 1 }}
								value={formatVND(
									(leaseAssetValue / (1 + parseFloat(VAT) / 100) || 0)
										.toFixed(0)
										.toString(),
								)}
							/> */}
							<TextInputCustomComponent
								label="Financing (%)"
								placeholder="0"
								inputStyle={{ textAlign: 'right' }}
								clearTextOnFocus={true}
								keyboardType="numeric"
								style={{ flex: 1 }}
								value={financingRatio}
								onChangeText={text => setFinancingRatio(text)}
							/>
						</View>

						{/* View Financing Ratio and Financing Amount */}
						{/* <View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<TextInputCustomComponent
								label="Financing Ratio (%)"
								placeholder=""
								clearTextOnFocus={true}
								keyboardType="numeric"
								style={{ flex: 1, marginRight: 8 }}
								value={financingRatio}
								onChangeText={text => setFinancingRatio(text)}
							/>
							<TextInputCustomComponent
								label="Financing Amount"
								placeholder=""
								keyboardType="numeric"
								enable={false}
								style={{ flex: 1 }}
								value={formatVND(
									(parseFloatUtil(financingRatio) / 100) * leaseAssetValue,
								).toString()}
							/>
						</View> */}

						{/* View Deposit Ratio and Deposit Amount */}
						<View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<TextInputCustomComponent
								label="Deposit (%)"
								placeholder="0"
								keyboardType="numeric"
								clearTextOnFocus={true}
								inputStyle={{ textAlign: 'right' }}
								style={{ flex: 1, marginRight: 8 }}
								value={depositRatio}
								onChangeText={text => setDepositRatio(text)}
							/>
							{/* <TextInputCustomComponent
								label="Deposit Amount"
								placeholder=""
								keyboardType="numeric"
								enable={false}
								style={{ flex: 1 }}
								value={formatVND(
									(leaseAssetValue * parseFloatUtil(depositRatio)) / 100,
								).toString()}
							/> */}
							<TextInputCustomComponent
								label="Residual Value (%)"
								placeholder="0"
								inputStyle={{ textAlign: 'right' }}
								keyboardType="numeric"
								clearTextOnFocus={true}
								style={{ flex: 1 }}
								value={residualValueRatio}
								onChangeText={text => setResidualValueRatio(text)}
							/>
						</View>

						{/* View Credit Granting Fee Type */}
						{/*<View style={{ flexDirection: 'row', marginTop: 12 }}>*/}
						{/*  <PickerCustomComponent*/}
						{/*    listData={listCreditGrantingFeeRatio}*/}
						{/*    label="Credit Granting Fee Type"*/}
						{/*    value={creditGrantingFeeType}*/}
						{/*    style={{ flex: 1 }}*/}
						{/*    textStyle={{ maxWidth: '100%' }}*/}
						{/*    onValueChange={(text) => setCreditGrantingFeeType(text)}*/}
						{/*  />*/}
						{/*</View>*/}

						{/* View Credit Granting Fee an Credit Grating Fee Amount */}
						{/*<View style={{ flexDirection: 'row', marginTop: 12 }}>*/}
						{/*  <TextInputCustomComponent*/}
						{/*    label="Credit Granting Fee Ratio (%)"*/}
						{/*    placeholder=""*/}
						{/*    keyboardType="numeric"*/}
						{/*    clearTextOnFocus={true}*/}
						{/*    style={{ flex: 1, marginRight: 8 }}*/}
						{/*    value={creditGrantingFeeRatio}*/}
						{/*    onChangeText={(text) => setCreditGrantingFeeRatio(text)}*/}
						{/*  />*/}

						{/*  <TextInputCustomComponent*/}
						{/*    label="Credit Granting Fee Amount"*/}
						{/*    placeholder=""*/}
						{/*    keyboardType="numeric"*/}
						{/*    enable={false}*/}
						{/*    style={{ flex: 1 }}*/}
						{/*    value={formatVND(*/}
						{/*      (leaseAssetValue * parseFloatUtil(creditGrantingFeeRatio)) /*/}
						{/*      100,*/}
						{/*    )}*/}
						{/*  />*/}
						{/*</View>*/}

						{/* View Residual Value Type */}
						{/*<View style={{ flexDirection: 'row', marginTop: 12 }}>*/}
						{/*  <PickerCustomComponent*/}
						{/*    listData={listResidualValueType}*/}
						{/*    label="Residual Value Type"*/}
						{/*    value={residualValueType}*/}
						{/*    style={{ flex: 1 }}*/}
						{/*    textStyle={{ maxWidth: '100%' }}*/}
						{/*    onValueChange={(text) => setResidualValueType(text)}*/}
						{/*  />*/}
						{/*</View>*/}

						{/* View Residual Value Ratio and Residual Value Amount */}
						{/* <View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<TextInputCustomComponent
								label="Residual Value Ratio (%)"
								placeholder=""
								keyboardType="numeric"
								clearTextOnFocus={true}
								style={{ flex: 1, marginRight: 8 }}
								value={residualValueRatio}
								onChangeText={text => setResidualValueRatio(text)}
							/>

							<TextInputCustomComponent
								label="Residual Value Amount"
								placeholder=""
								keyboardType="numeric"
								enable={false}
								style={{ flex: 1 }}
								value={formatVND(
									(leaseAssetValue * parseFloatUtil(residualValueRatio)) / 100,
								)}
							/>
						</View> */}

						{/* View Risk Premium and Lease Period */}
						{/*<View*/}
						{/*  style={{*/}
						{/*    flexDirection: 'row',*/}
						{/*    marginTop: 12,*/}
						{/*    alignItems: 'flex-end',*/}
						{/*  }}*/}
						{/*>*/}
						{/*  <TextInputCustomComponent*/}
						{/*    label="Risk Premium (not incl. Other fee)"*/}
						{/*    placeholder=""*/}
						{/*    keyboardType="numeric"*/}
						{/*    clearTextOnFocus={true}*/}
						{/*    style={{ flex: 1 }}*/}
						{/*    value={quotationDetail?.IRR_NOT_FEE.toString() || riskPremium}*/}
						{/*    onChangeText={(text) => setRiskPremium(text)}*/}
						{/*  />*/}
						{/*</View>*/}

						{/* View Interest Rate */}
						<View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<PickerCustomComponent
								showLabel={true}
								listData={listInterestRate}
								label="Interest Rate"
								value={interestRateSelected}
								style={{ flex: 1 }}
								textStyle={{ maxWidth: '85%' }}
								onValueChange={text => setInterestRateSelected(text)}
							/>
						</View>

						{/* View Base Rate and Markup Rate */}
						<View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								alignItems: 'center',
								marginHorizontal: 8,
							}}
						>
							{/* <TextInputCustomComponent
									label="Other fee amount"
									placeholder=""
									keyboardType="numeric"
									clearTextOnFocus={true}
									value={otherFeeAmount}
									onChangeText={text => setOtherFeeAmount(text)}
								/> */}
							<TextInputCustomComponent
								label="Base (%)"
								placeholder=""
								enable={false}
								keyboardType="numeric"
								clearTextOnFocus={true}
								style={{ flex: 1, marginRight: 5 }}
								inputStyle={{ textAlign: 'right' }}
								value={quotationDetail?.b_RATE?.toString() || baseRate}
								onChangeText={text => setBaseRate(text)}
							/>
							<TextInputCustomComponent
								label="1st Markup (%)"
								placeholder="0"
								keyboardType="numeric"
								clearTextOnFocus={true}
								style={{ flex: 1, marginRight: 5 }}
								value={markupRate}
								inputStyle={{ textAlign: 'right' }}
								onChangeText={text => setMarkupRate(text)}
								enable={
									interestRateSelected === '0909' ||
									interestRateSelected === '0'
										? false
										: true
								}
							/>
							<TextInputCustomComponent
								label="2nd Markup (%)"
								placeholder="0"
								keyboardType="numeric"
								clearTextOnFocus={true}
								style={{ flex: 1 }}
								value={markupRate2}
								enable={
									interestRateSelected == '2303' ||
									interestRateSelected === '2306'
										? true
										: false
								}
								inputStyle={{ textAlign: 'right' }}
								onChangeText={text => setMarkupRate2(text)}
							/>

							{/* <View style={{ flex: 1 }}>
								<TextInputCustomComponent
									label="1st Markup (%)"
									placeholder=""
									keyboardType="numeric"
									clearTextOnFocus={true}
									value={markupRate}
									onChangeText={text => setMarkupRate(text)}
								/>
								<TextInputCustomComponent
									label="2st Markup (%)"
									placeholder=""
									keyboardType="numeric"
									clearTextOnFocus={true}
									style={{ marginTop: 8 }}
									value={markupRate2}
									onChangeText={text => setMarkupRate2(text)}
								/>
							</View> */}
						</View>

						<View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<PickerCustomComponent
								showLabel={true}
								listData={listKindOfFee}
								label="Other fee amount"
								value={kindOfFee}
								style={{ flex: 1, marginRight: 8 }}
								textStyle={{ maxWidth: 150 }}
								onValueChange={text => setkindOfFee(text)}
							/>
							<TextInputCustomComponent
								// label="Other fee amount"
								inputStyle={{ textAlign: 'right' }}
								placeholder="0"
								keyboardType="numeric"
								clearTextOnFocus={true}
								value={otherFeeAmount}
								style={{ flex: 1, marginTop: 3 }}
								onChangeText={text => setOtherFeeAmount(text)}
							/>
						</View>

						{/* View Tenor */}
						<View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<TextInputCustomComponent
								label="Lease Period"
								placeholder=""
								keyboardType="numeric"
								clearTextOnFocus={true}
								style={{ flex: 1 }}
								inputStyle={{ textAlign: 'right' }}
								value={tenor}
								onChangeText={text => {
									if (text !== '0' && text) {
										const listCreate: any = Array.from(
											Array(parseInt(text, 10)).keys(),
										).map((item, index) => ({
											Tenor: (index + 1).toString(),
											Percentage: 100,
										}));
										// setListTenorLocal(listCreate);
										let newData = [...listChoose];
										paymentMethod === '1'
											? (newData[0] = {
													...newData[0],
													From: '1',
													To: text,
													Tenor: '100',
											  })
											: (newData[0] = {
													...newData[0],
													From: '0',
													To: (Number(text) - 1).toString(),
													Tenor: '100',
											  });

										setNewChoose(newData);
										setTenor(text);
									} else if (text == '') {
										// setListTenorLocal([]);
										setTenor(text);
									}
								}}
							/>
						</View>

						{/* {tenor !== '0' && (
							<View style={{ flexDirection: 'row', marginTop: 8 }}>
								<Card elevation={2} style={{ flex: 1, margin: 8 }}>
									{missingValue !== 0 ? (
										<Text
											style={{ fontWeight: '600', color: 'red', margin: 8 }}
										>
											Miss {missingValue}
										</Text>
									) : null}
									<View
										style={{
											padding: 8,
											flex: 1,
											flexDirection: 'row',
											flexWrap: 'wrap',
										}}
									>
										{listTenorLocal
											?.slice(0, showAllTenor ? listTenorLocal.length : 4)
											.map((item, index) => (
												<TextInputCustomComponent
													key={index.toString()}
													label={`Tenor ${index + 1}`}
													placeholder=""
													keyboardType="numeric"
													clearTextOnFocus={true}
													style={{
														width: '48%',
														marginRight: index % 2 === 0 ? 8 : 0,
														marginTop: 8,
													}}
													value={item.Percentage.toString()}
													onChangeText={text => {
														if (text == '' || text == 'NaN') {
															setListTenorLocal(listTenorLocalOld => {
																listTenorLocalOld[index].Percentage =
																	parseFloat('1');
																return [...listTenorLocalOld];
															});
														} else {
															setListTenorLocal(listTenorLocalOld => {
																listTenorLocalOld[index].Percentage =
																	parseFloat(text);
																return [...listTenorLocalOld];
															});
														}
													}}
												/>
											))}
									</View>

									<TouchableOpacity
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											paddingVertical: 8,
										}}
										onPress={() => setShowAllTenor(oldStatus => !oldStatus)}
									>
										<Icon
											as={Ionicons}
											name={
												showAllTenor
													? 'chevron-up-outline'
													: 'chevron-down-outline'
											}
											size={7}
											color={colors.primary}
										/>
									</TouchableOpacity>
								</Card>
							</View>
						)} */}

						{typeOfCalculation === '3' ? (
							<Card elevation={2} style={{ flex: 1, margin: 8 }}>
								<View>
									{listChoose?.map((item, index) => {
										return (
											<View
												style={{
													padding: 8,
													flexDirection: 'row',
													flexWrap: 'wrap',
												}}
											>
												<TextInputCustomComponentForTenor
													label="Title"
													placeholder="Form"
													keyboardType="numeric"
													style={{ marginTop: 8, flex: 1, marginRight: 30 }}
													value={item.From}
													multiline={true}
													onChangeText={text =>
														_onTextInPutChangce(text, index, 1, item?.id)
													}
													inputStyle={{ fontSize: 16 }}
													viewHeight={60}
													inputTextHeight={20}
												/>
												<TextInputCustomComponentForTenor
													label="Title"
													placeholder="To"
													keyboardType="numeric"
													style={{ marginTop: 8, flex: 1, marginRight: 30 }}
													value={item.To}
													multiline={true}
													onChangeText={text =>
														_onTextInPutChangce(text, index, 2, item?.id)
													}
													inputStyle={{ fontSize: 16 }}
													viewHeight={60}
													inputTextHeight={20}
												/>
												<TextInputCustomComponentForTenor
													label="Title"
													placeholder="Ratio"
													style={{ marginTop: 8, flex: 1 }}
													value={item.Tenor}
													multiline={true}
													onChangeText={text =>
														_onTextInPutChangce(text, index, 3, item?.id)
													}
													inputStyle={{ fontSize: 16 }}
													viewHeight={60}
													inputTextHeight={20}
													showX={index > 0 ? true : false}
													onPressX={() => {
														_onPressX(index);
													}}
												/>
											</View>
										);
									})}
									<TouchableOpacity
										style={{ padding: 8, paddingTop: 25 }}
										onPress={() =>
											_onPressNewChoose({
												From: '',
												To: '',
												Tenor: '',
												id: listChoose.length + 1,
											})
										}
									>
										{listChoose.length <= 5 ? (
											<View style={{ flexDirection: 'row' }}>
												<Icon
													as={Feather}
													name="plus"
													size={7}
													color={colors.primary}
													marginRight={5}
												/>
												<Text
													style={{ color: colors.primary, alignSelf: 'center' }}
												>
													New Tenor
												</Text>
											</View>
										) : null}
									</TouchableOpacity>
								</View>
							</Card>
						) : null}

						{/* View Remark */}
						{/* <View
							style={{
								flexDirection: 'row',
								marginTop: 12,
								marginHorizontal: 8,
							}}
						>
							<TextInputCustomComponent
								label="Remark"
								placeholder=""
								style={{ flex: 1 }}
								inputStyle={{ maxWidth: '100%' }}
								value={RMKS}
								multiline
								onChangeText={text => setRMKS(text)}
							/>
						</View> */}

						{quotationDetail && !quotationDetail.confirM_YN && (
							<View
								style={{
									flexDirection: 'row',
									marginTop: 12,
									alignItems: 'flex-end',
									marginHorizontal: 8,
								}}
							>
								<PickerCustomComponent
									showLabel={true}
									listData={listBranch}
									label="Branch"
									value={branchSelected}
									style={{ flex: 1, marginRight: 8 }}
									textStyle={{ maxWidth: '85%' }}
									onValueChange={text => setBranchSelected(text)}
								/>
								<View style={{ flex: 1 }}>
									<Button
										disabled={loadingConfirm}
										loading={loadingConfirm}
										mode="contained"
										style={{
											backgroundColor: Colors.approved,
										}}
										uppercase={false}
										onPress={() => _onPressConfirm()}
									>
										Confirm
									</Button>
								</View>
							</View>
						)}

						<View
							style={{
								flexDirection: 'row',
								marginTop: 20,
								marginHorizontal: 8,
							}}
						>
							<Button
								mode="contained"
								style={{ flex: 1, marginRight: 8 }}
								uppercase={false}
								onPress={() => _onPressCalculation()}
							>
								Calculation
							</Button>
							<Button
								disabled={loadingSave}
								loading={loadingSave}
								mode="contained"
								style={{ flex: 1, backgroundColor: Colors.approved }}
								uppercase={false}
								onPress={() => _onPressInsertUpdate(QUO_ID ? 'U' : 'I')}
							>
								{quotationDetail ? 'Update' : 'Save'}
							</Button>
						</View>
						{quotationDetail && (
							<View
								style={{
									flexDirection: 'row',
									marginTop: 20,
									marginHorizontal: 8,
								}}
							>
								<Button
									mode="contained"
									style={{ flex: 1, backgroundColor: Colors.approved }}
									uppercase={false}
									labelStyle={{ color: 'black' }}
									onPress={() => _onPressViewFileItem()}
								>
									Print
								</Button>
							</View>
						)}
						<SafeAreaView style={{ height: 60 }} />
					</ScrollView>
					<ChooseFontModal
						ref={modalFontRef}
						onPress_EN={() => _onPress_Share(1)}
						onPress_CH={() => _onPress_Share(3)}
						onPress_VN={() => _onPress_Share(4)}
					/>
				</KeyboardAvoidingView>
			) : (
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<ActivityIndicator />
				</View>
			)}
		</View>
	);
}
