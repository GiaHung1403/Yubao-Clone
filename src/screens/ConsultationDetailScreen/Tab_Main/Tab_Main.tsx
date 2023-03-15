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
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';

import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInfoRow from '@components/TextInfoRow';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Colors from '@config/Color';
import Color from '@config/Color';
import {
	getListCity_old,
	getListCreditVisitCF,
	getListCustomerSourceCF,
} from '@data/api';
import { getListCreditTypeCF, getListProgramCF } from '@data/api';
import {
	IConsultationDetail,
	ICreditProgressCF,
	ICustomer,
	IGuarantor,
	IUserSystem,
	IValidCFSentMailResult,
} from '@models/types';
import { formatVND, removeEmptyField } from '@utils';
import moment from 'moment';
import styles from './styles';
import EventEmitter from '@utils/events';
import { updateConsultation } from '@data/api/api_consultation';

import * as stateConsultation from '@actions/consultation_action';

interface IPropsRouteParams {
	consultationID: string;
	customerSelected: ICustomer;
	consultationItem: IConsultationDetail;
	listContactPersonSelected: string[];
	listGuarantor: IGuarantor;
}

const listVehicleCaseYN = [
	{ label: 'Choose', value: '-1' },
	{ label: 'Yes', value: '1' },
	{ label: 'No', value: '0' },
];

const listCurrency = [
	{ label: 'VND', value: 'VND' },
	{ label: 'USD', value: 'USD' },
];

const listUnderCommissionProgram = [
	{ label: 'Choose', value: '2' },
	{ label: 'No', value: '0' },
	{ label: 'Vehicle Commission', value: '1' },
];

const listFundingPurposeData = [
	{ label: 'Choose', value: 'Choose' },
	{ label: 'New Orders', value: 'New Orders' },
	{ label: 'Replace the old vehicles', value: 'Replace the old vehicles' },
	{ label: 'Working Capital', value: 'Working Capital' },
	{ label: 'Other', value: 'Please keying the other Funding Purpose...' },
];

const listCreditProgressRadio = [
	{ label: 'Yes', value: 'Y' },
	{ label: 'No', value: 'N' },
	{ label: 'Not set', value: '-' },
];

export default function Tab_Main(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const dispatch = useDispatch();
	let {
		consultationID,
		customerSelected,
		consultationItem,
		listContactPersonSelected,
		listGuarantor,
	}: IPropsRouteParams = props;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	// const [customerName, setCustomerName] = useState('');
	// const [masterCF, setMasterCF] = useState('');
	const [listCity, setListCity] = useState<any>([]);
	// const [citySelected, setCitySelected] = useState<any>('01');
	const [listProgram, setListProgram] = useState<any>([]);
	// const [programSelected, setProgramSelected] = useState<any>();
	// const [vehicleYN, setVehicleYN] = useState<any>('0');
	// const [underCommissionProgram, setUnderCommissionProgram] =
	// 	useState<any>('0');
	const [listCreditType, setListCreditType] = useState<any>([]);
	// const [creditTypeSelected, setCreditTypeSelected] = useState<any>('');
	const [listVisitDate, setListVisitDate] = useState<any[]>([]);
	// const [creditVisitDateSelected, setCreditVisitDateSelected] =
	// 	useState<any>('');
	// const [visitDate, setVisitDate] = useState<any>(new Date());
	const [listCustomerSource, setListCustomerSource] = useState<any>([]);
	// const [customerSourceSelected, setCustomerSourceSelected] = useState<any>('');
	// const [dealerName, setDealerName] = useState<string>('');
	// const [leasedAssets, setLeasedAssets] = useState('');
	// const [otherConditions, setOtherConditions] = useState('');
	// const [opinionsOfSalesDept, setOpinionsOfSalesDept] = useState('');
	// const [currencySelected, setCurrencySelected] = useState('');
	// const [paidUpCapital, setPaidUpCapital] = useState('0');
	// const [paidUpCapitalFormat, setPaidUpCapitalFormat] = useState('0');
	// const [registeredCapital, setRegisteredCapital] = useState('');
	// const [registeredCapitalFormat, setRegisteredCapitalFormat] = useState('');
	// const [salesLastYear, setSalesLastYear] = useState<string>('');
	// const [salesLastYearFormat, setSalesLastYearFormat] = useState<string>('');
	// const [networthLastYear, setNetworthLastYear] = useState('');
	// const [networthLastYearFormat, setNetworthLastYearFormat] = useState('');
	// const [totalAsset, setTotalAsset] = useState('');
	// const [totalAssetFormat, setTotalAssetFormat] = useState('');
	// const [profitLoss, setProfitLoss] = useState('');
	// const [profitLossFormat, setProfitLossFormat] = useState('');
	// const [deptRatio, setDeptRatio] = useState('');
	// const [fundingPurposeSelected, setFundingPurposeSelected] =
	// 	useState<any>('Choose');
	const [fundingPurposeText, setFundingPurposeText] = useState<any>('');
	// const [listCreditProgress, setListCreditProgress] = useState<
	// 	ICreditProgressCF[] | undefined
	// >([]);
	// const [listValueCreditProgress, setListValueCreditProgress] = useState<
	// 	string[]
	// >([]);
	// const [showAllCreditProgress, setShowAllCreditProgress] =
	// 	useState<boolean>(false);

	const {
		customerName,
		// masterCF: '',
		citySelected,
		programSelected,
		vehicleYN,
		creditTypeSelected,
		underCommissionProgram,
		customerSourceSelected,
		dealerName,
		// fundingPurposeText,
		fundingPurposeSelected,
		leasedAssets,
		otherConditions,
		opinionsOfSalesDept,
		// currencySelected,
		// paidUpCapital,
		// registeredCapital,
		// salesLastYear,
		// networthLastYear,
		// totalAsset,
		// profitLoss,
		// deptRatio,
		creditVisitDateSelected,
		visitDate,
	}: any = useSelector((state: any) => state.consultation_reducer);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			getCityResponse().then();
			getProgramData().then();
			getCreditTypeData().then();
			getCustomerSource().then();
			getCreditVisitData().then();
			getConsultationItemData();
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (customerSelected) {
			dispatch(
				stateConsultation.setCustomerName({
					customerName: customerSelected.LS_NM,
				}),
			);
		}
	}, [customerSelected]);

	const getConsultationItemData = async () => {
		dispatch(
			stateConsultation.setCustomerName({
				customerName: consultationItem.lS_NM,
			}),
		);
		dispatch(
			stateConsultation.setCitySelected({
				citySelected: consultationItem.citY_ID,
			}),
		);

		dispatch(
			stateConsultation.setProgramSelected({
				programSelected: consultationItem.conS_TP,
			}),
		);

		dispatch(
			stateConsultation.setCreditTypeSelected({
				creditTypeSelected: consultationItem.conS_CR_TP?.trim(),
			}),
		);
		dispatch(
			stateConsultation.setVehicleYN({ vehicleYN: consultationItem.v_CASE }),
		);

		dispatch(
			stateConsultation.setUnderCommissionProgram({
				underCommissionProgram: consultationItem.comM_PRM_YN,
			}),
		);
		dispatch(
			stateConsultation.setCustomerSourceSelected({
				customerSourceSelected: consultationItem.src,
			}),
		);

		dispatch(
			stateConsultation.setDealerName({
				dealerName: consultationItem.dealeR_NM,
			}),
		);
		// setMasterCF(consultationItem.masteR_CNID);
		// stateConsultation.setLeasedAssets(consultationItem.rmks?.replace(regex, ''))
		dispatch(
			stateConsultation.setOpinionsOfSalesDept({
				opinionsOfSalesDept: consultationItem.opI_SALES,
			}),
		);
		// setCurrencySelected(consultationItem.cuR_C);
		// setPaidUpCapital(consultationItem.paiD_CAP);
		// setPaidUpCapitalFormat(formatVND(consultationItem.paiD_CAP));
		// setRegisteredCapital(consultationItem.legL_CAP);
		// setRegisteredCapitalFormat(formatVND(consultationItem.legL_CAP));
		// setSalesLastYear(consultationItem.saL_LST_YR);
		// setSalesLastYearFormat(formatVND(consultationItem.saL_LST_YR));
		// setNetworthLastYear(consultationItem.neT_LST_YR);
		// setNetworthLastYearFormat(formatVND(consultationItem.neT_LST_YR));
		// setTotalAsset(consultationItem.toT_ASTS);
		// setTotalAssetFormat(formatVND(consultationItem.toT_ASTS));
		// setProfitLoss(consultationItem.prO_LOSS);
		// setProfitLossFormat(formatVND(consultationItem.prO_LOSS));
		// setDeptRatio(consultationItem.deP_R);
		dispatch(
			stateConsultation.setCreditVisitDateSelected({
				creditVisitDateSelected: consultationItem.visiT_TYPE,
			}),
		);

		dispatch(
			stateConsultation.setFundingPurposeSelected({
				fundingPurposeSelected: consultationItem.lS_PUR_NM || 'Choose',
			}),
		);
		setFundingPurposeText(consultationItem.purpose || 'Choose');

		dispatch(
			stateConsultation.setLeasedAssets({
				leasedAssets: consultationItem?.rmks,
			}),
		);

		dispatch(
			stateConsultation.setOtherConditions({
				otherConditions: consultationItem?.condition,
			}),
		);

		dispatch(
			stateConsultation.setOpinionsOfSalesDept({
				opinionsOfSalesDept: consultationItem?.opI_SALES,
			}),
		);
		// setCurrencySelected(consultationItem?.cuR_C);
		// setPaidUpCapital(consultationItem?.paiD_CAP);
		// setPaidUpCapitalFormat(formatVND(consultationItem?.paiD_CAP));
		// setRegisteredCapital(consultationItem?.legL_CAP);
		// setRegisteredCapitalFormat(formatVND(consultationItem?.legL_CAP));
		// setSalesLastYear(consultationItem?.saL_LST_YR);
		// setSalesLastYearFormat(formatVND(consultationItem?.saL_LST_YR));
		// setNetworthLastYear(consultationItem?.neT_LST_YR);
		// setNetworthLastYearFormat(formatVND(consultationItem?.neT_LST_YR));
		// setTotalAsset(consultationItem?.toT_ASTS);
		// setTotalAssetFormat(formatVND(consultationItem?.toT_ASTS));
		// setProfitLoss(consultationItem?.prO_LOSS);
		// setProfitLossFormat(formatVND(consultationItem?.prO_LOSS));
		// setDeptRatio(consultationItem?.debT_RATIO);
		// setListCreditProgress(consultationItem.lstCFConsIns);

		// const valueCreditProgress =
		// 	consultationItem?.crE_PRO_2?.trim().split(' ') ||
		// 	Array.from(Array(26).keys()).map((item, index) => '-');
		// stateConsultation.setListValueCreditProgress(valueCreditProgress);
	};

	const getProgramData = async () => {
		const listProgramResponse = (await getListProgramCF({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		})) as any;

		const convertListProgram = listProgramResponse.map(item => ({
			label: item.STND_C_NM,
			value: item.C_NO,
		}));

		setListProgram(convertListProgram);
	};

	const getCustomerSource = async () => {
		const listCustomerSourceData = (await getListCustomerSourceCF({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		})) as any;

		const convertListCustomerSource = listCustomerSourceData.map(item => ({
			label: item.STND_C_NM,
			value: item.C_NO,
		}));
		setListCustomerSource(convertListCustomerSource);
	};

	const getCreditTypeData = async () => {
		const listCreditTypeResponse = (await getListCreditTypeCF({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		})) as any;

		const convertListCreditType = listCreditTypeResponse
			.filter(
				item =>
					!['AA', 'CC', 'DD', 'HH', 'MM', 'NN', 'OO', 'PP'].includes(item.C_NO),
			)
			.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));

		setListCreditType(convertListCreditType);
	};

	const getCreditVisitData = async () => {
		const listCreditVisitResponse = (await getListCreditVisitCF({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		})) as any;

		const convertListCreditVisit: any[] = listCreditVisitResponse.map(item => ({
			label: item.STND_C_NM,
			value: item.C_NO,
		}));

		convertListCreditVisit.unshift({
			label: 'No visit',
			value: null,
		});
		setListVisitDate(convertListCreditVisit);
	};

	const getCityResponse = async () => {
		const responseCity: any = await getListCity_old({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		});

		const cityConvert = responseCity.map(item => ({
			label: `${item.C_NO && `${item.C_NO} -`} ${
				item.STND_C_NM || item.STND_C_NM_V
			}`,
			value: item.C_NO,
			name: item.STND_C_NM,
		}));

		setListCity(cityConvert);
	};

	// const _onPressButtonSave = async ({
	// 	flag,
	// 	customerName,
	// 	// masterCF,
	// 	citySelected,
	// 	programSelected,
	// 	vehicleYN,
	// 	creditTypeSelected,
	// 	underCommissionProgram,
	// 	customerSourceSelected,
	// 	listCustomerSource,
	// 	dealerName,
	// 	fundingPurposeText,
	// 	fundingPurposeSelected,
	// 	leasedAssets,
	// 	otherConditions,
	// 	opinionsOfSalesDept,
	// 	// currencySelected,
	// 	// paidUpCapital,
	// 	// registeredCapital,
	// 	// salesLastYear,
	// 	// networthLastYear,
	// 	// totalAsset,
	// 	// profitLoss,
	// 	// deptRatio,
	// 	listValueCreditProgress,
	// 	creditVisitDateSelected,
	// }) => {
	// 	// const cityValue = listCity.find(item => item.value === citySelected).value;
	// 	try {
	// 		const paramUpdate = {
	// 			cons_UPD: {
	// 				lS_NM: customerSelected?.LS_NM || customerName,
	// 				lS_NM_V: customerSelected?.LS_NM_V || customerName,
	// 				masteR_CNID: '', //masterCF
	// 				citY_ID: citySelected,
	// 				conS_TP: programSelected,
	// 				v_CASE: vehicleYN,
	// 				conS_CR_TP: creditTypeSelected,
	// 				comM_PRM_YN: underCommissionProgram,
	// 				src: customerSourceSelected,
	// 				srC_NM: listCustomerSource.find(
	// 					item => item.value === customerSourceSelected,
	// 				)?.label,
	// 				dealeR_NM: dealerName,
	// 				dealeR_ID: consultationItem?.dealeR_ID,
	// 				purpose: fundingPurposeText,
	// 				lS_PUR_NM: listFundingPurposeData.find(
	// 					item => item.value === fundingPurposeSelected,
	// 				)?.label,
	// 				astS_NOTE: leasedAssets,
	// 				condition: otherConditions,
	// 				opI_SALES: opinionsOfSalesDept,

	// 				cuR_C: '', // currencySelected
	// 				paiD_CAP: '0', //paidUpCapital
	// 				legL_CAP: '', //registeredCapital,
	// 				saL_LST_YR: '', //salesLastYear,
	// 				neT_LST_YR: '', //networthLastYear,
	// 				toT_ASTS: '', //totalAsset,
	// 				prO_LOSS: '', //profitLoss,
	// 				debT_RATIO: '', //deptRatio,
	// 				lesE_ID: customerSelected?.LESE_ID || consultationItem?.lesE_ID,
	// 				cnid: consultationItem?.cnid,
	// 				defR_TRM: consultationItem?.defR_TRM,
	// 				trm: consultationItem?.trm,
	// 				acqT_AMT: consultationItem?.acqT_AMT,
	// 				inT_TP: consultationItem?.baS_INT_TP,
	// 				sprd: consultationItem?.sprd,
	// 				inT_R: consultationItem?.inT_R,
	// 				paY_DATE: consultationItem?.paY_DATE,
	// 				paY_MOD: consultationItem?.paY_MOD,
	// 				paY_CYCL: consultationItem?.paY_CYCL,
	// 				pmT_YN: consultationItem?.pmT_YN,
	// 				cR_TP: consultationItem?.cR_TP,
	// 				lS_PUR: consultationItem?.lS_PUR,
	// 				nxT_MV: consultationItem?.nxT_MV,
	// 				sT_C: consultationItem?.sT_C,
	// 				oP_EMP_NO: consultationItem?.oP_EMP_NO,
	// 				rmks: consultationItem?.rmks,
	// 				cN_DATE: consultationItem?.cN_DATE,
	// 				confirm: listValueCreditProgress
	// 					.reduce((result, value) => result + `${value} `, '')
	// 					?.trim(),
	// 				sd: consultationItem?.deP_R,
	// 				rv: consultationItem?.rV_R,
	// 				irr: consultationItem?.irr,
	// 				fiN_R: consultationItem?.fiN_R,
	// 				maN_R: consultationItem?.maN_R,
	// 				leasE_PUR: consultationItem?.leasE_PUR,
	// 				quO_ID: consultationItem?.quO_ID,
	// 				astS_P: consultationItem?.astS_P,
	// 				vat: consultationItem?.vat,
	// 				conditioN_VN: consultationItem?.conditioN_VN,
	// 				uP_YN: consultationItem?.uP_YN,
	// 				ratE_TP: consultationItem?.ratE_TP,
	// 				dealer: consultationItem?.dealer,
	// 				rV_TP: consultationItem?.rV_TP,
	// 				exP_DELAY: consultationItem?.exP_DELAY,
	// 				adV_SD: consultationItem?.adV_SD,
	// 				otheR_FEE: consultationItem?.otheR_FEE,
	// 				irR_NOT_FEE: consultationItem?.irR_NOT_FEE,
	// 				visiT_DATE: consultationItem?.visiT_DATE,
	// 				morT_ASTS: consultationItem?.morT_ASTS,
	// 				morT_NOTE: consultationItem?.morT_NOTE,
	// 				man_amt: consultationItem?.maN_AMT,
	// 				rv_rpay_inpt_amt: consultationItem?.rV_RPAY_INPT_AMT,
	// 				dep_inpt_amt: consultationItem?.deP_INPT_AMT,
	// 				master_CNID: consultationItem?.masteR_CNID,
	// 				bB_RATIO: consultationItem?.bB_RATIO,
	// 				cuR_C_REMAIN: consultationItem?.cuR_C_REMAIN,
	// 				remaiN_CREDIT_LINE_AMT: consultationItem?.remaiN_CREDIT_LINE_AMT,
	// 				steP_PMT: consultationItem?.steP_PMT,
	// 				m_RATE2: consultationItem?.m_RATE2,
	// 				perType: consultationItem?.perType,
	// 				visiT_YN: creditVisitDateSelected ? 1 : 0,
	// 				visiT_TYPE: creditVisitDateSelected,
	// 				visiT_DATE_EXP: consultationItem?.visiT_DATE_EXP,
	// 				downpament_R: consultationItem?.downpaY_R,
	// 				downpament_A: consultationItem?.downpaY_AMT,
	// 				totalEx_R: consultationItem?.totaL_EXPOSURE_R,
	// 				totalEx_A: consultationItem?.totaL_EXPOSURE_AMT,
	// 				adJ_CR_CHECKING: consultationItem?.adJ_CR_CHECKING,
	// 				adJ_CREDIT_RPT_FINISH: consultationItem?.adJ_CREDIT_RPT_FINISH,
	// 			},
	// 			lese_Capital: {
	// 				lesE_ID: consultationItem?.lesE_ID,
	// 				cnid: consultationItem?.cnid,
	// 				cur_C: '', // currencySelected
	// 				tot_Asts: '', //totalAsset,
	// 				paid_Cap: '0', //paidUpCapital
	// 				sal_lst_yr: '', //salesLastYear,
	// 				net_lst_yr: '', //networthLastYear,
	// 				legl_cap: '', //registeredCapital,
	// 				pro_loss: '', //profitLoss,
	// 				debt_ratio: '', //deptRatio.toString(),
	// 				flag,
	// 			},
	// 		};

	// 		await updateConsultation(paramUpdate);
	// 		navigation.goBack();
	// 	} catch (e: any) {
	// 		Alert.alert('Error', e.message);
	// 	}
	// };

	return doneLoadAnimated ? (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ flex: 1 }}
		>
			<ScrollView style={{ flex: 1, padding: 8 }}>
				<Card style={{ padding: 8 }}>
					<TextInputCustomComponent
						enable={consultationID ? false : true}
						enableButton={consultationID ? true : false}
						label="Customer Name"
						placeholder="Customer Name"
						style={{ marginBottom: 12, flex: 1 }}
						value={customerName}
						iconRight={'search-outline'}
						onChangeText={text =>
							dispatch(
								stateConsultation.setCustomerName({ customerName: text }),
							)
						}
						onPress={() =>
							navigation.navigate('ChooseCustomerModal', {
								idCustomerExisted:
									customerSelected?.LESE_ID || consultationItem?.lesE_ID,
								screenBack: 'CarBookingDetailScreen',
							})
						}
					/>

					{/* <TextInputCustomComponent
								label="Master CF"
								placeholder="Master CF"
								style={{ marginBottom: 12, flex: 1 }}
								value={masterCF}
								enable={false}
								iconRight={'search-outline'}
								onChangeText={text => setMasterCF(text)}
								onPress={() => null}
							/> */}
				</Card>
				<Card style={{ padding: 8, marginTop: 8 }}>
					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listCity}
							label="Province/ City"
							value={citySelected}
							style={{ flex: 1, marginRight: 8 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text =>
								setTimeout(() => {
									dispatch(
										stateConsultation.setCitySelected({ citySelected: text }),
									);
								}, 300)
							}
						/>

						<PickerCustomComponent
							showLabel={true}
							listData={listProgram}
							label="Program"
							value={programSelected}
							style={{ flex: 1 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text =>
								dispatch(
									stateConsultation.setProgramSelected({
										programSelected: text,
									}),
								)
							}
						/>
					</View>

					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listVehicleCaseYN}
							label="Vehicle Case Y/N"
							value={vehicleYN}
							style={{ flex: 1, marginRight: 8 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text =>
								dispatch(stateConsultation.setVehicleYN({ vehicleYN: text }))
							}
						/>

						<PickerCustomComponent
							showLabel={true}
							listData={listCreditType}
							label="Credit Type"
							value={creditTypeSelected}
							style={{ flex: 1 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text =>
								dispatch(
									stateConsultation.setCreditTypeSelected({
										creditTypeSelected: text,
									}),
								)
							}
						/>
					</View>

					<PickerCustomComponent
						showLabel={true}
						listData={listUnderCommissionProgram}
						label="Under Commission Program"
						value={underCommissionProgram}
						style={{ flex: 1, marginBottom: 12 }}
						textStyle={{ maxWidth: 110 }}
						onValueChange={text =>
							dispatch(
								stateConsultation.setUnderCommissionProgram({
									underCommissionProgram: text,
								}),
							)
						}
					/>

					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listVisitDate}
							label="Credit Visit Date"
							value={creditVisitDateSelected}
							style={{ flex: 1, marginRight: 8 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text =>
								dispatch(
									stateConsultation.setCreditVisitDateSelected({
										creditVisitDateSelected: text,
									}),
								)
							}
						/>

						<ButtonChooseDateTime
							label={'Visit date'}
							disabled={!creditVisitDateSelected}
							valueDisplay={moment(visitDate).format('DD/MM/YYYY')}
							modalMode={'datetime'}
							value={visitDate}
							onHandleConfirmDate={item =>
								dispatch(stateConsultation.setVisitDate({ visitDate: item }))
							}
							containerStyle={{ flex: 1 }}
						/>
					</View>

					<PickerCustomComponent
						showLabel={true}
						listData={listCustomerSource}
						label="Customer Source"
						value={customerSourceSelected}
						style={{ flex: 1, marginBottom: 12 }}
						textStyle={{ maxWidth: 110 }}
						onValueChange={text =>
							dispatch(
								stateConsultation.setCustomerSourceSelected({
									customerSourceSelected: text,
								}),
							)
						}
					/>

					<TextInputCustomComponent
						label="Dealer Name"
						placeholder="Dealer Name"
						style={{ flex: 1 }}
						value={dealerName}
						iconRight={'search-outline'}
						onChangeText={text =>
							dispatch(stateConsultation.setDealerName({ dealerName: text }))
						}
						onPress={() =>
							navigation.navigate('ChooseCustomerModal', {
								idCustomerExisted:
									customerSelected?.LESE_ID || consultationItem?.lesE_ID,
								screenBack: 'ConsultationDetailScreen',
							})
						}
					/>
				</Card>
				<Card style={{ padding: 8, marginTop: 8 }}>
					<View style={{ flexDirection: 'row', marginBottom: 12 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listFundingPurposeData}
							label="Funding purpose"
							value={fundingPurposeSelected}
							style={{ flex: 1, marginRight: 8 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text => {
								dispatch(
									stateConsultation.setFundingPurposeSelected({
										fundingPurposeSelected: text,
									}),
								);
								setFundingPurposeText(text);
							}}
						/>

						<TextInputCustomComponent
							label="Funding purpose"
							placeholder=""
							style={{ flex: 1 }}
							value={fundingPurposeText}
							onChangeText={text => setFundingPurposeText(text)}
						/>
					</View>

					<TextInputCustomComponent
						label="Leased Assets"
						placeholder=""
						multiline
						inputStyle={{
							height: Platform.OS === 'android' ? 50 : 50,
							textAlignVertical: 'top',
						}}
						style={{ marginBottom: 12 }}
						value={leasedAssets}
						onChangeText={text =>
							dispatch(
								stateConsultation.setLeasedAssets({ leasedAssets: text }),
							)
						}
					/>

					<TextInputCustomComponent
						label="Other conditions"
						placeholder=""
						multiline
						inputStyle={{
							height: Platform.OS === 'android' ? 50 : 50,
							textAlignVertical: 'top',
						}}
						style={{ marginBottom: 12 }}
						value={otherConditions}
						onChangeText={text =>
							dispatch(
								stateConsultation.setOtherConditions({ otherConditions: text }),
							)
						}
					/>

					<TextInputCustomComponent
						label="Opinions of Sales Dept."
						placeholder=""
						multiline
						inputStyle={{
							height: Platform.OS === 'android' ? 50 : 50,
							textAlignVertical: 'top',
						}}
						style={{ marginBottom: 12 }}
						value={opinionsOfSalesDept}
						onChangeText={text =>
							dispatch(
								stateConsultation.setOpinionsOfSalesDept({
									opinionsOfSalesDept: text,
								}),
							)
						}
					/>
				</Card>
				<Card style={{ padding: 8, marginTop: 8 }}>
					<Text style={{ marginBottom: 12, fontWeight: '600', fontSize: 16 }}>
						Guarantor{' '}
					</Text>
					{listGuarantor.map((guarantor, index) => (
						<View key={index.toString()} style={{ marginBottom: 12 }}>
							{guarantor?.IDNO ? (
								<TextInfoRow
									icon={'barcode-outline'}
									value={guarantor.IDNO}
									styleValue={{ fontWeight: '600', color: colors.primary }}
								/>
							) : null}

							<TextInfoRow
								icon={'person-outline'}
								styleValue={{ fontWeight: '600', color: Color.approved }}
								containerStyle={{ marginBottom: 4 }}
								value={guarantor.CP_NM}
							/>

							<View style={{ flexDirection: 'row', marginBottom: 4 }}>
								<TextInfoRow
									icon={'briefcase-outline'}
									containerStyle={{ marginRight: 8 }}
									value={guarantor.TIT_NM}
								/>

								<TextInfoRow
									icon={'call-outline'}
									isIconRight
									value={guarantor.TNO}
								/>
							</View>
						</View>
					))}
				</Card>

				{/* Card Business Situation */}
				{/* <Card style={{ padding: 8, marginTop: 8 }}>
							<Text
								style={{ marginBottom: 12, fontWeight: '600', fontSize: 16 }}
							>
								Business Situation
							</Text>
							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<PickerCustomComponent
									listData={listCurrency}
									label="Currency"
									value={currencySelected}
									style={{ flex: 1, marginRight: 8 }}
									textStyle={{ maxWidth: 110 }}
									onValueChange={text => setCurrencySelected(text)}
								/>

								<TextInputCustomComponent
									label="Paid-up Capital"
									placeholder="10,000,000,000"
									keyboardType={'numeric'}
									style={{ flex: 1 }}
									value={paidUpCapitalFormat}
									onChangeText={text => {
										setPaidUpCapital(text.split(',').join(''));
										setPaidUpCapitalFormat(formatVND(text.split(',').join('')));
									}}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<TextInputCustomComponent
									label="Registered Capital"
									placeholder="10,000,000,000"
									keyboardType={'numeric'}
									style={{ flex: 1, marginRight: 12 }}
									value={registeredCapitalFormat}
									onChangeText={text => {
										setRegisteredCapital(text.split(',').join(''));
										setRegisteredCapitalFormat(
											formatVND(text.split(',').join('')),
										);
									}}
								/>

								<TextInputCustomComponent
									label="Sales Last Year"
									placeholder="10,000,000,000"
									keyboardType={'numeric'}
									style={{ flex: 1 }}
									value={salesLastYearFormat}
									onChangeText={text => {
										setSalesLastYear(text.split(',').join(''));
										setSalesLastYearFormat(formatVND(text.split(',').join('')));
									}}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<TextInputCustomComponent
									label="Networth Last Year"
									placeholder="10,000,000,000"
									keyboardType={'numeric'}
									style={{ flex: 1, marginRight: 12 }}
									value={networthLastYearFormat}
									onChangeText={text => {
										setNetworthLastYear(text.split(',').join(''));
										setNetworthLastYearFormat(
											formatVND(text.split(',').join('')),
										);
									}}
								/>

								<TextInputCustomComponent
									label="Total Asset"
									placeholder="10,000,000,000"
									keyboardType={'numeric'}
									style={{ flex: 1 }}
									value={totalAssetFormat}
									onChangeText={text => {
										setTotalAsset(text.split(',').join(''));
										setTotalAssetFormat(formatVND(text.split(',').join('')));
									}}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<TextInputCustomComponent
									label="Profit/Loss"
									placeholder="10,000,000,000"
									keyboardType={'numeric'}
									style={{ flex: 1, marginRight: 12 }}
									value={profitLossFormat}
									onChangeText={text => {
										setProfitLoss(text.split(',').join(''));
										setProfitLossFormat(formatVND(text.split(',').join('')));
									}}
								/>

								<TextInputCustomComponent
									label="Debt Ratio"
									placeholder="10%"
									keyboardType={'numeric'}
									style={{ flex: 1 }}
									value={deptRatio}
									onChangeText={text => setDeptRatio(text)}
								/>
							</View>
						</Card> */}
				{/* <Card style={{ padding: 8, marginTop: 8 }}>
					<View
						style={{
							padding: 8,
							flex: 1,
						}}
					>
						{listCreditProgress
							?.slice(0, showAllCreditProgress ? listCreditProgress.length : 4)
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
										{listCreditProgressRadio.map((itemRadio, indexRadio) => (
											<RadioButton labelHorizontal={true} key={indexRadio}>
												<RadioButtonInput
													obj={itemRadio}
													index={index}
													isSelected={
														listValueCreditProgress[index] === itemRadio.value
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
														listValueCreditProgress[index] === itemRadio.value
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
															listValueCreditProgress[index] === itemRadio.value
																? colors.primary
																: '#5a5a5a',
														fontWeight: '500',
														marginRight: 20,
													}}
												/>
											</RadioButton>
										))}
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
						onPress={() => setShowAllCreditProgress(oldStatus => !oldStatus)}
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
				</Card> */}
				<SafeAreaView style={{ height: 60 }} />
			</ScrollView>
		</KeyboardAvoidingView>
	) : (
		<LoadingFullScreen />
	);
}
