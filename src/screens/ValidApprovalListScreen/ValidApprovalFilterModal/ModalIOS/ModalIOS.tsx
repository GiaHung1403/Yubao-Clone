import { Icon } from 'native-base';
import React, {
	useEffect,
	useState,
	useRef,
	useMemo,
	useCallback,
} from 'react';
import { InteractionManager, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, FAB, Modal, useTheme } from 'react-native-paper';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Color from '@config/Color';
import { AntDesign } from '@expo/vector-icons';
import { convertUnixTimeSolid } from '@utils/index';
import { ModalDate } from '@models/ModalDateEnum';
import DateTimePickerModalCustom from '@components/DateTimePickerModalCustom';

import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';
import { useAtom } from 'jotai';
import { textDataConfirm } from 'atoms/valid_aprv.atom';
import {
	getList_Credit_Type,
	getList_Branch,
	getList_Asset_Code,
} from '@data/api';
import { IUserSystem } from '@models/types';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()),
);

export default function ModalISO(props: any) {
	const sheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['1%', '50%'], []);
	const { hideModal, onClose, _onPressFilter, onOpen, _onPressSave } = props;
	const [idModalDate, setIdModalDate] = useState(0);
	const dateTimePickerRef = useRef<any>(null);
	const [fromDate, setFromDate] = useState<any>(timeFrom);
	const [toDate, setToDate] = useState<any>(timeNow);
	const [CNID, setCNID] = useState<string>('');
	const [APNO, setAPNO] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const { colors } = useTheme();
	const [dataConfirm, setDataConfirm] = useAtom(textDataConfirm);
	const [dataView, setDataView] = useState<any>({});
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	// callbacks
	const handleSheetChange = useCallback(index => {
		index !== 1 ? onClose() : null;
		// console.log('handleSheetChange', index);
	}, []);

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

	const renderBackdrop = useCallback(
		props => (
			<BottomSheetBackdrop
				{...props}
				opacity={0.7}
				disappearsOnIndex={-1}
				appearsOnIndex={1}
				BackdropPressBehavior={async () => {
					handleClosePress();
				}}
			/>
		),
		[],
	);

	useEffect(() => {
		setTimeout(() => {
			handleClosePress();
		}, 100);
	}, []);

	const handleSnapPress = useCallback(index => {
		sheetRef.current?.snapToIndex(index);
	}, []);
	const handleClosePress = useCallback(() => {
		setDataConfirm([]);
		sheetRef.current?.close();
	}, []);

	useEffect(() => {
		!hideModal ? handleClosePress() : handleSnapPress(1);
	}, [hideModal]);

	const viewInfor = () => {
		return (
			<Card
				style={{
					padding: 10,
					marginTop: 10,
					borderRadius: 15,
					paddingVertical: 20,
				}}
				elevation={2}
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
						<View style={{ flex: 1, flexDirection: 'row' }}>
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

	const renderConfrim = () => {
		return (
			<View>
				<View style={{ flex: 1, padding: 15 }}>
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
							flex: 1,
							flexDirection: 'row',
							justifyContent: 'center',
							paddingTop: 10,
						}}
					>
						<Button
							mode="contained"
							style={{ alignSelf: 'flex-end', flex: 1, margin: 8 }}
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
								handleClosePress();
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
							}}
							uppercase={false}
							onPress={() => handleClosePress()}
						>
							{'Cancel'}
						</Button>
					</View>
				</View>
			</View>
		);
	};

	const renderFilter = () => {
		return (
			<View>
				<View style={{ flex: 1, padding: 8 }}>
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
									style={{
										fontWeight: '600',
										color: '#555',
										marginBottom: 8,
									}}
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
									style={{
										fontWeight: '600',
										color: '#555',
										marginBottom: 8,
									}}
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
							style={{ flex: 1 }}
							uppercase={false}
							disabled={loading}
							onPress={() => {
								_onPressFilter({
									CNID,
									APNO,
									fromDate,
									toDate,
								});
								// handleClosePress();
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
			</View>
		);
	};

	return (
		<BottomSheet
			ref={sheetRef}
			snapPoints={snapPoints}
			onChange={handleSheetChange}
			backdropComponent={renderBackdrop}
			index={-1}
		>
			<BottomSheetVirtualizedList
				data={null}
				//@ts-ignore
				keyExtractor={i => i}
				getItemCount={data => 1}
				getItem={(data, index) => 1}
				style={{
					flex: 1,
					borderTopStartRadius: 24,
					borderTopEndRadius: 24,
				}}
				renderItem={dataConfirm.length > 0 ? renderConfrim : renderFilter}
				contentContainerStyle={{ backgroundColor: 'white' }}
			/>
		</BottomSheet>
	);
}
