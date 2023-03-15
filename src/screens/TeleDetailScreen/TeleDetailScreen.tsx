import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Button, Card } from 'react-native-paper';
import { useSelector } from 'react-redux';

import DateTimePickerModalCustom from '@components/DateTimePickerModalCustom';
import Header from '@components/Header';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import {
	getListCity,
	getListDistrict,
	getListTiming,
	saveAndDeleteTele,
} from '@data/api';
import { ICustomer, ITele, IUserSystem } from '@models/types';
import { convertUnixTimeNoSpaceYYYYMMDD, convertUnixTimeSolid } from '@utils';

interface IRouteParams {
	teleInfo: ITele;
	isCreateNewTele: boolean;
	customerSelected: ICustomer;
}

export function TeleDetailScreen(props: any) {
	const navigation: any = useNavigation();
	const dateTimePickerRef = useRef<any>(null);
	const { teleInfo, isCreateNewTele, customerSelected }: IRouteParams =
		props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [isNewTele, setNewTele] = useState(isCreateNewTele);
	const [listCity, setListCity] = useState<any>([]);
	const [citySelected, setCitySelected] = useState<any>('0');
	const [listDistrict, setListDistrict] = useState<any[]>([]);
	const [districtSelected, setDistrictSelected] = useState<any>(null);
	const [listTiming, setListTiming] = useState<any[]>([]);
	const [timingSelected, setTimingSelected] = useState<any>(null);
	const [idModalDate, setIdModalDate] = useState<any>('Call date');

	const [callDate, setCallDate] = useState(
		teleInfo ? new Date(teleInfo?.callDate) : new Date(),
	);
	const [recallDate, setRecallDate] = useState<any>(
		teleInfo?.recall_Date ? new Date(teleInfo.recall_Date) : null,
	);
	const [contactPerson, setContactPerson] = useState(teleInfo?.contact_Nm);
	const [TNO, setTNO] = useState(teleInfo?.lese_Tno || customerSelected?.TNO);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const responseCity: any = await getListCity({
				action: 'city',
			});

			const cityConvert = responseCity.map(item => ({
				label: item.city_nm,
				value: item.city_code,
			}));

			setListCity(cityConvert);
			setCitySelected(teleInfo?.city || cityConvert[0]?.value);

			const responseTiming: any = await getListTiming({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			});

			const timingConvert = responseTiming?.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));

			const timingSelect = timingConvert.find(
				item => item.label.includes(teleInfo?.grade_NM) > 0,
			);

			setListTiming(timingConvert);
			setTimingSelected(timingSelect?.value);

			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (citySelected) {
			(async function getData() {
				const credentials: any = await Keychain.getGenericPassword();
				const responseDistrict: any = await getListDistrict({
					cityCode: citySelected,
				});

				const districtConvert = responseDistrict?.map(item => ({
					label: item.distNm,
					value: item.distID,
				}));

				setListDistrict(districtConvert);
				setDistrictSelected(teleInfo?.district || districtConvert[0]?.value);
			})();
		}
	}, [citySelected]);

	const _onPressSave = async ({ flag }) => {
		if (!customerSelected && !teleInfo) {
			Alert.alert('Warning', 'Please choose customer!');
			return;
		}

		try {
			await saveAndDeleteTele({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				flag,
				teleID: flag === 'I' ? '0' : teleInfo.tele_ID.trim(),
				date: new Date().toISOString().toString(),
				leseName: teleInfo?.lese_Name || customerSelected?.LS_NM,
				TNO,
				address: teleInfo?.lese_Addr || customerSelected?.ADDR,
				grade: timingSelected,
				recallDate: recallDate?.toISOString()?.toString() || '',
				contactName: contactPerson,
				mobile: TNO,
				city: citySelected,
				district: districtSelected,
				pur: '',
				leseID: customerSelected?.LESE_ID || '',
				taxCode: teleInfo?.tax_Code.trim() || customerSelected?.TAX_CODE.trim(),
			});

			navigation.goBack();
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	const _onPressDelete = () => {
		Alert.alert('Alert', 'Do you want to delete this?', [
			{ text: 'Cancel' },
			{
				text: 'OK',
				onPress: async () => {
					await _onPressSave({ flag: 'D' });
				},
			},
		]);
	};

	const _onHandleConfirmDate = (date: Date) => {
		if (idModalDate === 'Call date') {
			setCallDate(date);
		} else {
			setRecallDate(date);
		}
	};

	const _onPressShowModalDate = (idModal: string) => {
		setIdModalDate(idModal);
		dateTimePickerRef.current.onShowModal();
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ flex: 1 }}
		>
			<View style={{ zIndex: 2 }}>
				<Header title="Telemarketing Information" />
			</View>

			{doneLoadAnimated && (
				<ScrollView style={{ flex: 1, padding: 8 }}>
					<Card style={{ padding: 8 }}>
						<TextInputCustomComponent
							label="Customer Name"
							placeholder="Customer Name"
							iconRight={'search-outline'}
							style={{ marginBottom: 12 }}
							value={customerSelected?.LS_NM || teleInfo?.lese_Name}
							enable={false}
							onPress={() =>
								navigation.navigate('ChooseCustomerModal', {
									idCustomerExisted: customerSelected?.LESE_ID,
									screenBack: 'TeleDetailScreen',
								})
							}
						/>
						<TextInputCustomComponent
							label="Tax Code"
							placeholder=""
							style={{ marginBottom: 12 }}
							multiline
							enable={false}
							value={customerSelected?.TAX_CODE || teleInfo?.tax_Code}
						/>
						<TextInputCustomComponent
							label="Address"
							placeholder=""
							keyboardType="number-pad"
							multiline
							enable={false}
							inputStyle={{
								height: Platform.OS === 'android' ? 50 : 'auto',
								textAlignVertical: 'top',
							}}
							value={
								customerSelected?.ADDR.trim() || teleInfo?.lese_Addr.trim()
							}
						/>
					</Card>

					<Card style={{ marginTop: 8, padding: 8 }}>
						<TextInputCustomComponent
							label="PIC"
							placeholder=""
							keyboardType="number-pad"
							enable={false}
							style={{ marginBottom: 12 }}
							value={teleInfo?.emp_Nm || dataUserSystem.EMP_NM}
						/>

						<View style={{ flexDirection: 'row', marginBottom: 12 }}>
							<TextInputCustomComponent
								label="Tele Date"
								placeholder=""
								keyboardType="number-pad"
								style={{ flex: 1, marginRight: 8 }}
								enable={false}
								onPress={() => _onPressShowModalDate('Call date')}
								value={convertUnixTimeSolid(callDate.getTime() / 1000)}
							/>

							<TextInputCustomComponent
								label="Recall"
								placeholder=""
								keyboardType="number-pad"
								style={{ flex: 1 }}
								enable={false}
								onPress={() => _onPressShowModalDate('Recall date')}
								value={
									recallDate
										? convertUnixTimeSolid(recallDate.getTime() / 1000)
										: ''
								}
							/>
						</View>

						<View style={{ flexDirection: 'row', marginBottom: 12 }}>
							<TextInputCustomComponent
								label="Contact Person"
								placeholder=""
								autoCapitalize="words"
								style={{ flex: 1, marginRight: 8 }}
								value={contactPerson}
								onChangeText={text => setContactPerson(text)}
							/>

							<TextInputCustomComponent
								label="Phone No."
								placeholder=""
								keyboardType="phone-pad"
								style={{ flex: 1 }}
								value={TNO}
								onChangeText={text => setTNO(text)}
							/>
						</View>

						<View style={{ flexDirection: 'row', marginBottom: 12 }}>
							<PickerCustomComponent
								showLabel={true}
								listData={listCity}
								label="Province"
								value={citySelected}
								style={{ flex: 1, marginRight: 8 }}
								textStyle={{ maxWidth: 150 }}
								onValueChange={text => setCitySelected(text)}
							/>
							<PickerCustomComponent
								showLabel={true}
								listData={listDistrict}
								label="District"
								value={districtSelected}
								style={{ flex: 1 }}
								textStyle={{ maxWidth: 150 }}
								onValueChange={text => setDistrictSelected(text)}
							/>
						</View>

						<PickerCustomComponent
							showLabel={true}
							listData={listTiming}
							label="Timing Of Demand"
							value={timingSelected}
							onValueChange={text => setTimingSelected(text)}
						/>
					</Card>

					<View style={{ flexDirection: 'row', marginTop: 8 }}>
						<Button
							mode="contained"
							style={{ flex: 1, marginRight: 8 }}
							uppercase={false}
							onPress={() => _onPressSave({ flag: isNewTele ? 'I' : 'U' })}
						>
							{isNewTele ? 'Save' : 'Update'}
						</Button>
						{!isNewTele && (
							<Button
								mode="contained"
								style={{ flex: 1, backgroundColor: 'red' }}
								uppercase={false}
								onPress={() => _onPressDelete()}
							>
								Delete
							</Button>
						)}
					</View>
					<SafeAreaView style={{ height: 60 }} />
				</ScrollView>
			)}

			<DateTimePickerModalCustom
				ref={dateTimePickerRef}
				date={idModalDate === 'Call date' ? callDate : recallDate || new Date()}
				onConfirm={_onHandleConfirmDate}
			/>
		</KeyboardAvoidingView>
	);
}
