import { Icon } from 'native-base';
import React, { useState, useRef, useEffect } from 'react';
import { InteractionManager, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Modal, useTheme } from 'react-native-paper';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Color from '@config/Color';
import { AntDesign } from '@expo/vector-icons';
import { convertUnixTimeSolid } from '@utils/index';
import { ModalDate } from '@models/ModalDateEnum';
import DateTimePickerModalCustom from '@components/DateTimePickerModalCustom';
import { useAtom } from 'jotai';
import { textDataConfirm } from 'atoms/valid_aprv.atom';
import * as Keychain from 'react-native-keychain';
import {
	getList_Asset_Code,
	getList_Branch,
	getList_Credit_Type,
} from '@data/api';
import { IUserSystem } from '@models/types';
import { useSelector } from 'react-redux';

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()),
);

export default function ModalAndroid(props: any) {
	const { hideModal, onClose, _onPressFilter, onOpen, _onPressSave } = props;
	const [idModalDate, setIdModalDate] = useState(0);
	const dateTimePickerRef = useRef<any>(null);
	const { colors } = useTheme();
	const [fromDate, setFromDate] = useState<any>(timeFrom);
	const [toDate, setToDate] = useState<any>(timeNow);
	const [CNID, setCNID] = useState<string>('');
	const [APNO, setAPNO] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [dataConfirm, setDataConfirm] = useAtom(textDataConfirm);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [dataView, setDataView] = useState<any>({});

	const _onPressShowModalDate = (idModal: number) => {
		setIdModalDate(idModal);
		dateTimePickerRef.current.onShowModal();
	};

	const _onHandleConfirmDate = (date: Date) => {
		if (idModalDate === ModalDate.FROM_DATE) {
			setFromDate(date);
		} else {
			setToDate(date);
		}
	};

	useEffect(() => {
		if (dataConfirm.length > 0) {
			InteractionManager.runAfterInteractions(async () => {
				const credentials: any = await Keychain.getGenericPassword();
				const { password } = credentials;

				const data: any = await getList_Credit_Type({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
				});
				const data2: any = await getList_Branch({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
				});
				const data3: any = await getList_Asset_Code({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
				});

				setDataView({
					value: data?.filter(item => item.C_NO === dataConfirm[0]?.value)[0]
						.STND_C_NM,
					branchModal: data2
						.splice(1, data2.length)
						.filter(item => item.C_NO === dataConfirm[0]?.branchModal)[0]
						.STND_C_NM,

					astsTp: data3?.filter(item => item.C_NO === dataConfirm[0]?.astsTp)[0]
						.STND_C_NM,
				});
			});
			onOpen();
		}
	}, [dataConfirm]);

	const onDismissModal = () => {
		onClose();
		setDataConfirm([]);
	};

	const viewInfor = () => {
		return (
			<Card
				style={{
					padding: 10,
					marginTop: 10,
					borderRadius: 15,
					paddingVertical: 20,
					borderWidth: 1,
				}}
				elevation={0}
			>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Text style={{}}>Contract No. </Text>
					<Text style={{ flex: 1, fontWeight: '600', color: colors.primary }}>
						{dataConfirm[0]?.APNO}
					</Text>
				</View>
				<View
					style={{
						justifyContent: 'center',
						paddingTop: 10,
						flexDirection: 'row',
					}}
				>
					<Text style={{ marginRight: 10 }}>Contract Detail </Text>
					<View style={{ flex: 1 }}>
						<View style={{ flexDirection: 'row' }}>
							<Text
								style={{
									flex: 2,
									marginRight: 10,
									fontWeight: '600',
									color: colors.primary,
								}}
							>
								{dataConfirm[0].value}-{dataView?.value}
							</Text>
							<Text
								style={{
									flex: 1,
									marginRight: 10,
									fontWeight: '600',
									color: colors.primary,
								}}
							>
								{dataConfirm[0]?.YYMM}
							</Text>
							<Text
								style={{
									flex: 1,
									marginRight: 10,
									fontWeight: '600',
									color: colors.primary,
								}}
							>
								{dataConfirm[0]?.seq}
							</Text>
						</View>

						<View
							style={{
								flexDirection: 'row',
								paddingTop: 10,
							}}
						>
							<Text
								style={{
									flex: 1,
									fontWeight: '600',
									color: colors.primary,
									marginRight: 10,
								}}
							>
								{dataConfirm[0].branchModal}-{dataView?.branchModal}
							</Text>
							<Text
								style={{ flex: 2, fontWeight: '600', color: colors.primary }}
							>
								{dataConfirm[0].astsTp}-{dataView?.astsTp}
							</Text>
						</View>
					</View>
				</View>
			</Card>
		);
	};

	const renderConfirm = () => {
		return (
			<Card elevation={0}>
				<View style={{ padding: 15 }}>
					<Text
						style={{
							fontSize: 14,
							fontWeight: '600',
							color: colors.error,
						}}
					>
						Are you sure want to generate Contract number with detail ?
					</Text>
					<View>{viewInfor()}</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							paddingTop: 10,
						}}
					>
						<Button
							mode="contained"
							style={{
								alignSelf: 'flex-end',
								flex: 1,
								margin: 8,
								elevation: 0,
							}}
							uppercase={false}
							onPress={() => {
								_onPressSave({
									CNID: dataConfirm[0].CNID,
									APNO: dataConfirm[0].APNO,
									chooseType: dataConfirm[0].Progress,
								});
								_onPressFilter({
									CNID,
									APNO,
									fromDate,
									toDate,
								});
								onDismissModal();
							}}
						>
							{'Save'}
						</Button>
						<Button
							color="red"
							mode="contained"
							style={{
								alignSelf: 'flex-end',
								flex: 1,
								margin: 8,
								elevation: 0,
							}}
							uppercase={false}
							onPress={() => onDismissModal()}
						>
							{'Cancel'}
						</Button>
					</View>
				</View>
			</Card>
		);
	};

	const renderFilter = () => {
		return (
			<Card elevation={0}>
				<View style={{ padding: 8 }}>
					<View style={{}}>
						<View
							style={{
								flexDirection: 'row',
								marginTop: 8,
							}}
						>
							<TouchableOpacity
								style={{ padding: 8, flex: 1 }}
								onPress={() => _onPressShowModalDate(ModalDate.FROM_DATE)}
							>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
								>
									From date
								</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										borderWidth: 0.5,
										borderColor: '#666',
										padding: 8,
										borderRadius: 4,
										height: 43,
									}}
								>
									<Icon
										as={AntDesign}
										name={'calendar'}
										size={7}
										color={colors.primary}
										style={{ flex: 1 }}
									/>
									<Text style={{ fontWeight: '600', color: '#666' }}>
										{convertUnixTimeSolid(fromDate.getTime() / 1000)}
									</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								style={{ padding: 8, flex: 1 }}
								onPress={() => _onPressShowModalDate(ModalDate.TO_DATE)}
							>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
								>
									To date
								</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										borderWidth: 0.5,
										borderColor: '#666',
										padding: 8,
										borderRadius: 4,
										height: 43,
									}}
								>
									<Icon
										as={AntDesign}
										name={'calendar'}
										size={7}
										color={colors.primary}
										style={{ flex: 1 }}
									/>
									<Text style={{ fontWeight: '600', color: '#666' }}>
										{convertUnixTimeSolid(toDate.getTime() / 1000)}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<TextInputCustomComponent
						label="CA No"
						placeholder=""
						multiline={true}
						value={CNID}
						onChangeText={(text: string) => {
							setCNID(text);
						}}
						style={{ padding: 8 }}
					/>

					<TextInputCustomComponent
						label=" APNO"
						placeholder=""
						multiline={true}
						value={APNO}
						onChangeText={(text: string) => {
							setAPNO(text);
						}}
						style={{ padding: 8 }}
					/>

					<View
						style={{
							flexDirection: 'row',
							padding: 8,
							justifyContent: 'flex-end',
						}}
					>
						<Button
							mode="contained"
							style={{ flex: 1, elevation: 0 }}
							uppercase={false}
							disabled={loading}
							onPress={() => {
								_onPressFilter({
									CNID,
									APNO,
									fromDate,
									toDate,
								}),
									onClose();
							}}
							loading={loading}
						>
							{'Filter'}
						</Button>
					</View>
				</View>
				<DateTimePickerModalCustom
					ref={dateTimePickerRef}
					date={idModalDate === ModalDate.FROM_DATE ? fromDate : toDate}
					onConfirm={_onHandleConfirmDate}
				/>
			</Card>
		);
	};

	return (
		<Modal
			visible={hideModal}
			onDismiss={() => onDismissModal()}
			contentContainerStyle={{ padding: 20, margin: 20 }}
		>
			{dataConfirm.length > 0 ? renderConfirm() : renderFilter()}
		</Modal>
	);
}
