import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, InteractionManager, View } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInfoRow from '@components/TextInfoRow';

import EventEmitter from '@utils/events';
import moment from 'moment';
import createFormCF from '../createFormCF';
import {
	getListProgramCF,
	getListCustomerSourceCF,
	getListGuarantorByCustomerID,
} from '@data/api';

import {
	IConsultationDetail,
	ICreditProgressCF,
	ICustomer,
	IGuarantor,
	IUserSystem,
	IValidCFSentMailResult,
} from '@models/types';

import {
	getConsultationDetail,
	sentMailConsultation,
	updateConsultation,
} from '@data/api/api_consultation';

interface IPropsRouteParams {
	consultationID: string;
	customerSelected: ICustomer;
	consultationItem: IConsultationDetail;
}

const listFundingPurposeData = [
	{ label: 'Choose', value: 'Choose' },
	{ label: 'New Orders', value: 'New Orders' },
	{ label: 'Replace the old vehicles', value: 'Replace the old vehicles' },
	{ label: 'Working Capital', value: 'Working Capital' },
	{ label: 'Other', value: 'Please keying the other Funding Purpose...' },
];

export default function ViewButton_Consultation(props: any) {
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
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
		listValueCreditProgress,
		visitDate,
	}: any = useSelector((state: any) => state.consultation_reducer);

	const { consultationItem, listGuarantor }: any = props;
	const navigation: any = useNavigation();
	const [listProgram, setListProgram] = useState<any>([]);
	const [listCustomerSource, setListCustomerSource] = useState<any>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			getProgramData().then();
			getCustomerSource().then();
		});
	}, []);

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

	const _onPressButtonSave = async ({ flag }) => {
		// const cityValue = listCity.find(item => item.value === citySelected).value;
		try {
			const paramUpdate = {
				cons_UPD: {
					lS_NM: customerName, // customerSelected?.LS_NM ||
					lS_NM_V: customerName, // customerSelected?.LS_NM_V ||
					masteR_CNID: '', //masterCF
					citY_ID: citySelected,
					conS_TP: programSelected,
					v_CASE: vehicleYN,
					conS_CR_TP: creditTypeSelected,
					comM_PRM_YN: underCommissionProgram,
					src: customerSourceSelected,
					srC_NM: listCustomerSource.find(
						item => item.value === customerSourceSelected,
					)?.label,
					dealeR_NM: dealerName,
					dealeR_ID: consultationItem?.dealeR_ID,
					purpose: fundingPurposeSelected, //fundingPurposeText,
					lS_PUR_NM: listFundingPurposeData.find(
						item => item.value === fundingPurposeSelected,
					)?.label,
					astS_NOTE: leasedAssets,
					condition: otherConditions,
					opI_SALES: opinionsOfSalesDept,

					cuR_C: '', // currencySelected
					paiD_CAP: '0', //paidUpCapital
					legL_CAP: '', //registeredCapital,
					saL_LST_YR: '', //salesLastYear,
					neT_LST_YR: '', //networthLastYear,
					toT_ASTS: '', //totalAsset,
					prO_LOSS: '', //profitLoss,
					debT_RATIO: '', //deptRatio,
					lesE_ID: consultationItem?.lesE_ID, //customerSelected?.LESE_ID ||
					cnid: consultationItem?.cnid,
					defR_TRM: consultationItem?.defR_TRM,
					trm: consultationItem?.trm,
					acqT_AMT: consultationItem?.acqT_AMT,
					inT_TP: consultationItem?.baS_INT_TP,
					sprd: consultationItem?.sprd,
					inT_R: consultationItem?.inT_R,
					paY_DATE: consultationItem?.paY_DATE,
					paY_MOD: consultationItem?.paY_MOD,
					paY_CYCL: consultationItem?.paY_CYCL,
					pmT_YN: consultationItem?.pmT_YN,
					cR_TP: consultationItem?.cR_TP,
					lS_PUR: consultationItem?.lS_PUR,
					nxT_MV: consultationItem?.nxT_MV,
					sT_C: consultationItem?.sT_C,
					oP_EMP_NO: consultationItem?.oP_EMP_NO,
					rmks: consultationItem?.rmks,
					cN_DATE: consultationItem?.cN_DATE,
					confirm: listValueCreditProgress
						.reduce((result, value) => result + `${value} `, '')
						?.trim(),
					sd: consultationItem?.deP_R,
					rv: consultationItem?.rV_R,
					irr: consultationItem?.irr,
					fiN_R: consultationItem?.fiN_R,
					maN_R: consultationItem?.maN_R,
					leasE_PUR: consultationItem?.leasE_PUR,
					quO_ID: consultationItem?.quO_ID,
					astS_P: consultationItem?.astS_P,
					vat: consultationItem?.vat,
					conditioN_VN: consultationItem?.conditioN_VN,
					uP_YN: consultationItem?.uP_YN,
					ratE_TP: consultationItem?.ratE_TP,
					dealer: consultationItem?.dealer,
					rV_TP: consultationItem?.rV_TP,
					exP_DELAY: consultationItem?.exP_DELAY,
					adV_SD: consultationItem?.adV_SD,
					otheR_FEE: consultationItem?.otheR_FEE,
					irR_NOT_FEE: consultationItem?.irR_NOT_FEE,
					visiT_DATE: consultationItem?.visiT_DATE,
					morT_ASTS: consultationItem?.morT_ASTS,
					morT_NOTE: consultationItem?.morT_NOTE,
					man_amt: consultationItem?.maN_AMT,
					rv_rpay_inpt_amt: consultationItem?.rV_RPAY_INPT_AMT,
					dep_inpt_amt: consultationItem?.deP_INPT_AMT,
					master_CNID: consultationItem?.masteR_CNID,
					bB_RATIO: consultationItem?.bB_RATIO,
					cuR_C_REMAIN: consultationItem?.cuR_C_REMAIN,
					remaiN_CREDIT_LINE_AMT: consultationItem?.remaiN_CREDIT_LINE_AMT,
					steP_PMT: consultationItem?.steP_PMT,
					m_RATE2: consultationItem?.m_RATE2,
					perType: consultationItem?.perType,
					visiT_YN: creditVisitDateSelected ? 1 : 0,
					visiT_TYPE: creditVisitDateSelected,
					visiT_DATE_EXP: consultationItem?.visiT_DATE_EXP,
					downpament_R: consultationItem?.downpaY_R,
					downpament_A: consultationItem?.downpaY_AMT,
					totalEx_R: consultationItem?.totaL_EXPOSURE_R,
					totalEx_A: consultationItem?.totaL_EXPOSURE_AMT,
					adJ_CR_CHECKING: consultationItem?.adJ_CR_CHECKING,
					adJ_CREDIT_RPT_FINISH: consultationItem?.adJ_CREDIT_RPT_FINISH,
				},
				lese_Capital: {
					lesE_ID: consultationItem?.lesE_ID,
					cnid: consultationItem?.cnid,
					cur_C: '', // currencySelected
					tot_Asts: '', //totalAsset,
					paid_Cap: '0', //paidUpCapital
					sal_lst_yr: '', //salesLastYear,
					net_lst_yr: '', //networthLastYear,
					legl_cap: '', //registeredCapital,
					pro_loss: '', //profitLoss,
					debt_ratio: '', //deptRatio.toString(),
					flag,
				},
			};

			await updateConsultation(paramUpdate);
			navigation.goBack();
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	const IncorrectKeys = (key: string) => {
		if (
			key?.trim().toUpperCase().includes('.') ||
			key?.trim().toUpperCase().includes('N/A')
		) {
			return true;
		}
		return false;
	};

	const verifyData = (validCF: IValidCFSentMailResult) => {
		if (validCF.man_Fee_r > 0) {
			Alert.alert(
				'Warning!',
				'Please check your CREDIT GRANTING FEE (Stop collecting CREDIT GRANTING FEE!',
			);
			return;
		}

		if (validCF.irr_Type === 0) {
			Alert.alert(
				'Warning!',
				'Please choose another Quotation with IRR method is Cost down!',
			);
			return;
		}
		if (!programSelected) {
			Alert.alert('Warning!', 'Please choose Program.');
			return;
		}

		let strError = '';
		if (validCF.ls_tp === '1') {
			if (!validCF.tax_code?.toString().trim()) {
				strError += 'Tax Code; Telephone No.; ';
			}
			if (!validCF.fax?.toString().trim()) {
				strError += 'Fax; ';
			}
			if (
				!validCF.tc_Issue_date?.toString().trim() ||
				moment(validCF.tc_Issue_date).format('DDMMYYYY') === '31122049'
			) {
				strError += 'Issued Date (TaxCode); ';
			}
			if (!validCF.tc_Issue_by?.toString().trim()) {
				strError += 'Issued By (TaxCode); ';
			}
			if (!validCF.person?.toString().trim()) {
				strError += 'GD information - Representation; ';
			}
			if (!validCF.tit?.toString().trim()) {
				strError += 'GD information - Position; ';
			}
			if (!validCF.idno_person?.toString().trim()) {
				strError += 'GD information - Phone No; ';
			}
			if (!validCF.estb_Org_nm?.toString().trim()) {
				strError += 'By Organization; ';
			}
			if (
				// !validCF.tno?.toString().trim() ||
				!validCF.iddate_Person?.toString().trim() ||
				moment(validCF.iddate_Person).format('DDMMYYYY') === '31122049'
			) {
				strError +=
					'GD information - Representation/ID No./Passport No./ Dated (GD; ';
			}
			if (
				!validCF.idby_Person?.toString().trim() ||
				!validCF.idby_Person_V?.toString().trim()
			) {
				strError += 'GD information - Issue By; ';
			}

			if (
				!validCF.estb_Org_nm?.toString().trim() ||
				!validCF.reg_id?.toString().trim() ||
				!validCF.reg_date?.toString().trim() ||
				moment(validCF.reg_date).format('DDMMYYYY') === '31122049'
			) {
				strError += 'Establish information; ';
			}

			if (!validCF.biz_field?.toString().trim()) {
				strError += 'Business field; ';
			}
			if (!validCF.main_prd?.toString().trim()) {
				strError += 'Main Product; ';
			}
			if (IncorrectKeys(validCF.reg_id)) {
				strError += 'Registered No. is not valid!; ';
			}
			if (IncorrectKeys(validCF.idno_person)) {
				strError += 'ID No./Passport No./ Dated (GD) is not valid!; ';
			}
			if (
				!validCF.city_code?.toString() ||
				validCF.city_code?.toString() === '0'
			) {
				strError += 'Province; ';
			}
			if (
				!validCF.sbv_Inds_Detail_TP?.toString() ||
				validCF.sbv_Inds_Detail_TP?.toString() === '0'
			) {
				strError += 'SBV Industry Type Detail; ';
			}
			if (
				!validCF.sbv_Inds_TP?.toString() ||
				validCF.sbv_Inds_TP?.toString() === '0'
			) {
				strError += 'CILC.Industry.Type; ';
			}
		} else {
			if (IncorrectKeys(validCF.reg_id)) {
				strError += 'Registered No. is not valid!; ';
			}
			if (!validCF.sex?.toString() || validCF.sex?.toString() === '0') {
				strError += 'Sex; ';
			}
			if (
				!validCF.birthday?.toString() ||
				moment(validCF.birthday).format('DDMMYYYY') === '31122049'
			) {
				strError += 'Date of birth; ';
			}
			if (
				!validCF.reg_date?.toString().trim() ||
				moment(validCF.reg_date).format('DDMMYYYY') === '31122049'
			) {
				strError += 'Issued Date; ';
			}
			if (!validCF.reg_by?.toString().trim()) {
				strError += 'Issued By; ';
			}
			if (IncorrectKeys(validCF.reg_id)) {
				strError += 'ID No./Passport No. is not valid!; ';
			}
			if (
				!validCF.sbv_Inds_Detail_TP?.toString() ||
				validCF.sbv_Inds_Detail_TP?.toString() === '0'
			) {
				strError += 'SBV Industry Type Detail; ';
			}
			if (
				!validCF.sbv_Inds_TP?.toString() ||
				validCF.sbv_Inds_TP?.toString() === '0'
			) {
				strError += 'CILC.Industry.Type; ';
			}
		}

		if (
			!validCF.no_emp_code?.toString().trim() ||
			(validCF.no_emp_code?.toString().trim() === '0' &&
				validCF.ls_tp?.toString().trim() === '1')
		) {
			strError += 'No. of employee; ';
		}

		return strError;
	};

	const _onPressMail = () => {
		Alert.alert(
			'Warning!',
			`Ensure that:\n  All information provided from sending Consultation Form is accurate, adequate and consistent with your all awareness of this customer;\n  Any abnormal information during the period of approaching and processing will be noticed immediately to Credit officer and other related Authorities in CILC.`,
			[
				{ text: 'Cancel', style: 'cancel', onPress: () => null },
				{ text: 'OK', style: 'destructive', onPress: () => sentMail() },
			],
		);
	};

	const sentMail = async () => {
		const validCF = consultationItem!.validCFSentMailResult;
		const strError = verifyData(validCF);

		if (strError) {
			Alert.alert(
				'Warning!',
				`Please check your Customer information. See it below: ${strError}`,
			);
			return;
		}

		try {
			await sentMailConsultation({
				User_ID: dataUserSystem.EMP_NO,
				cnid: consultationItem?.cnid,
			});

			Alert.alert('Success!', 'Sent mail success!', [
				{ text: 'OK', onPress: () => navigation.goBack() },
			]);
		} catch (error) {
			Alert.alert('Error', 'Something wrong! Please try again!');
		}
	};

	const _onPressPrint = async () => {
		const validCF = consultationItem!.validCFSentMailResult;
		const strError = verifyData(validCF);

		if (strError) {
			Alert.alert(
				'Warning!',
				`Please check your Customer information. See it below: ${strError}`,
			);
			return;
		}

		navigation.navigate('WebviewScreen', {
			url: createFormCF({
				...consultationItem,
				listGuarantor: listGuarantor.reduce(
					(str, item) =>
						str + `${item.CP_NM_V || item.CP_NM} (${item.TIT_NM});`,
					'',
				),
				program: listProgram.find(item => item.value === programSelected).label,
				customeSrc: `${
					listCustomerSource.find(item => item.value === customerSourceSelected)
						?.label
				} (${dealerName})`,
			}),
			isHTML: true,
		});
	};

	return (
		<View style={{ padding: 5, paddingHorizontal: 10, paddingBottom: 25 }}>
			<View style={{ flexDirection: 'row', marginTop: 16 }}>
				<Button
					mode="contained"
					style={{ flex: 1, marginRight: 8 }}
					uppercase={false}
					onPress={() => {
						// _onPressButtonSave({ flag: consultationItem ? 'U' : 'I' });
						Alert.alert('Alert', 'Function is under maintenance !!!!');
					}}
				>
					{'Save'}
				</Button>

				<Button
					mode="contained"
					style={{ flex: 1, backgroundColor: 'red' }}
					uppercase={false}
					onPress={() => {
						Alert.alert('Alert', 'Function is under maintenance !!!!');
						// _onPressButtonSave({ flag: 'D' });
					}}
				>
					{'Delete'}
				</Button>
			</View>
			<View style={{ flexDirection: 'row', marginTop: 8 }}>
				<Button
					mode="contained"
					style={{ flex: 1, marginRight: 8 }}
					uppercase={false}
					onPress={() => {
						Alert.alert('Alert', 'Function is under maintenance !!!!');
						// _onPressPrint;
					}}
				>
					{'Print'}
				</Button>

				<Button
					mode="contained"
					style={{ flex: 1 }}
					uppercase={false}
					onPress={() => {
						Alert.alert('Alert', 'Function is under maintenance !!!!');
						// _onPressMail;
					}}
				>
					{'Mail'}
				</Button>
			</View>
		</View>
	);
}
