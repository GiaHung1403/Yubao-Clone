import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
	Text,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Color from '@config/Color';
import TextInfoRow from '@components/TextInfoRow';
import CheckBoxCustomComponent from '@components/CheckBoxCustomComponent/CheckBoxCustomComponent';
import { generate_APNO, upDate_Valid_Aprv } from 'data/api';
import { IUserSystem, IValidAprv } from '@models/types';
import { useAtom } from 'jotai';
import { textDataConfirm, typeValidAprvAtom } from 'atoms/valid_aprv.atom';

const listProgress = [
	{ label: 'Processing', value: 'Processing' },
	{ label: 'Pending', value: 'Pending' },
	{ label: 'Cancel', value: 'Cancel' },
];

interface IProps {
	dataItem: IValidAprv;
	onFilter: any;
}

function HightLightTextComponent({ label, value, colorValue }) {
	return (
		<View
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				flex: 1,
			}}
		>
			<Text
				style={{
					color: '#666666',
					fontSize: 12,
					marginBottom: 4,
				}}
			>
				{label}
			</Text>
			<Text
				style={{
					fontWeight: '600',
					color: colorValue,
				}}
			>
				{value}
			</Text>
		</View>
	);
}

export function ValidApprovalItem(props: IProps) {
	const { dataItem, onFilter } = props;
	const [chooseType, setChooseType] = useState<any>(dataItem?.contTime_Act);
	const [loading, setLoading] = useState(false);
	const [filterSelected] = useAtom(typeValidAprvAtom);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [, setDataConfirm] = useAtom(textDataConfirm);

	const right = (str, chr) => {
		return str.slice(str.length - chr, str.length);
	};

	const left = (str, chr) => {
		return str.slice(0, chr - str.length);
	};

	const onPress_Save = async ({ CNID, APNO }) => {
		if (APNO === null) {
			setLoading(true);
			const data: any = await generate_APNO({
				User_ID: dataUserSystem.EMP_NO,
				CNID,
			});

			const selectedValue = left(data?.apNo, 1);
			const txtYYMM = data?.apNo.toString().trim().substring(1, 5);
			const txtSeq = data?.apNo.toString().trim().substring(5, 8);
			const cboBranchModal = data?.apNo.toString().trim().substring(8, 9);
			const cboAstsTp = right(data?.apNo, 1);
			// console.log('====================================');
			// console.log(
			// 	data,
			// 	selectedValue,
			// 	txtYYMM,
			// 	txtSeq,
			// 	cboBranchModal,
			// 	cboAstsTp,
			// );
			// console.log('====================================');

			setDataConfirm([
				{
					APNO: data.apNo.trim(),
					value: selectedValue,
					YYMM: txtYYMM,
					seq: txtSeq,
					branchModal: cboBranchModal,
					astsTp: cboAstsTp,
					CNID,
					Progress: chooseType,
				},
			]);
			setLoading(false);
			return;
		} else {
			setLoading(true);
			await upDate_Valid_Aprv({
				User_ID: dataUserSystem.EMP_NO,
				CNID,
				APNO,
				Progress: chooseType,
				Action: 'SAVE_VALID_APRV_LIST',
			});
			setLoading(false);
		}
	};
	return (
		<Card
			elevation={1}
			style={{
				flex: 1,
				marginBottom: 8,
				marginHorizontal: 8,
				padding: 8,
			}}
		>
			<Text
				style={{
					marginBottom: 8,
					color: Color.approved,
					fontWeight: '600',
				}}
			>
				{dataItem?.ls_nm}
			</Text>

			<View style={{ flex: 1, marginBottom: 8, flexDirection: 'row' }}>
				<TextInfoRow
					icon={'barcode-outline'}
					value={`${dataItem?.cnid}`}
					styleValue={{}}
				/>
				<TextInfoRow
					isIconRight
					icon={'person-outline'}
					value={`${dataItem?.fs_Emp_NM}`}
					styleValue={{}}
				/>
			</View>

			<View style={{ flex: 1, marginBottom: 8, flexDirection: 'row' }}>
				<TextInfoRow
					icon={'document-text-outline'}
					value={`${dataItem?.apNo}`}
					styleValue={{}}
					containerStyle={{
						flex: 1,
					}}
				/>

				<TextInfoRow
					icon={'cash-outline'}
					isIconRight
					// value={`${formatVND(contract.INSR_AMT)} ${contract.CUR_C}`}
					value={dataItem?.r_Dsbt_Amt}
					styleValue={{ color: Color.main, fontWeight: '600' }}
					containerStyle={{
						flex: 1,
					}}
				/>
			</View>

			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					backgroundColor: `${Color.main}30`,
					padding: 8,
					borderRadius: 4,
					marginBottom: 12,
				}}
			>
				<HightLightTextComponent
					label="Approval Date"
					// value={moment(contract.INSR_DATE).format('DD/MM/YYYY')}
					value={dataItem?.aprvDate}
					colorValue={Color.approved}
				/>

				<HightLightTextComponent
					label="Expired Date"
					// value={moment(contract.INSR_MTRT).format('DD/MM/YYYY')}
					value={dataItem?.expDate}
					colorValue={'orange'}
				/>
			</View>

			<View
				style={{
					flex: 1,
					alignSelf: 'center',
					justifyContent: 'center',
					flexDirection: 'row',
				}}
			>
				<View
					style={{
						flex: 1,
						paddingTop: 5,
					}}
				>
					<CheckBoxCustomComponent
						listData={listProgress}
						value={chooseType}
						setValue={value => setChooseType(value)}
						showTitle={false}
					/>
				</View>
				<View
					style={{
						justifyContent: 'center',
					}}
				>
					<Button
						mode="contained"
						style={{ alignSelf: 'flex-end' }}
						uppercase={false}
						disabled={loading}
						onPress={() => {
							onPress_Save({ CNID: dataItem?.cnid, APNO: dataItem?.apNo });
							onFilter(filterSelected);
						}}
						loading={loading}
					>
						{'Save'}
					</Button>
				</View>
			</View>
		</Card>
	);
}
