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
	TouchableOpacity,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListCarBooking } from '@actions/car_booking_action';
import { getListContact } from '@actions/contact_action';
import AvatarBorder from '@components/AvatarBorder';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import {
	getListBookingType,
	getListCity,
	getListDistrict,
	getListWard,
	updateCarBooking,
	getListCity_old,
	getListDistrict_old,
	getListWard_old,
} from '@data/api';
import { ICarBooking, IContact, ICustomer, IUserSystem } from '@models/types';
import { removeVietnameseTones } from '@utils';
import moment from 'moment';

interface IPropsRouteParams {
	carBookingItem: ICarBooking;
	listContactPersonSelected: string[];
	customerSelected: ICustomer;
}

interface IPropsItemChip {
	userID: string;
	name: string;
	index: number;
	onPress?: () => void;
}

const formatUserID = ({ userID, name }) =>
	`${userID}.${name
		?.replace(/ /g, '.')
		.substr(0, name.indexOf('(') > -1 ? name.indexOf('(') - 1 : undefined)}`;

const renderItemChip = ({ userID, name, index, onPress }: IPropsItemChip) => (
	<TouchableOpacity
		key={index.toString()}
		style={{
			marginRight: 8,
			flexDirection: 'row',
			alignItems: 'center',
		}}
		onPress={onPress}
	>
		<View
			style={{
				backgroundColor: '#d5d5d5',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 50,
				flexDirection: 'row',
				paddingVertical: 4,
				paddingHorizontal: 16,
			}}
		>
			<AvatarBorder username={formatUserID({ userID, name })} size={25} />
			<Text
				style={{
					color: '#000',
					marginLeft: 8,
				}}
			>
				{name}
			</Text>
		</View>
	</TouchableOpacity>
);

export function CarBookingDetailScreen(props: any) {
	const timeNow = new Date();
	const timeFrom = new Date(
		new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() - 7),
	);
	const timeTo = new Date(
		new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() + 7),
	);

	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const {
		carBookingItem,
		listContactPersonSelected,
		customerSelected,
	}: IPropsRouteParams = props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [fromDate, setFromDate] = useState(
		carBookingItem ? new Date(carBookingItem?.start_date) : timeNow,
	);

	const [valueItem, setValueItem] = useState<ICarBooking>(carBookingItem);

	const [toDate, setToDate] = useState(
		carBookingItem
			? new Date(carBookingItem?.end_date)
			: moment().add(30, 'minutes').toDate(),
	);
	const [listCity, setListCity] = useState<any>([]);
	const [citySelected, setCitySelected] = useState<any>(
		carBookingItem?.CITY_ID || '01',
	);
	const [listDistrict, setListDistrict] = useState<any>([]);
	const [districtSelected, setDistrictSelected] = useState<any>(
		carBookingItem?.DISTRICT_ID || '0',
	);
	const [listWard, setListWard] = useState<any>([]);
	const [wardSelected, setWardSelected] = useState<any>(
		carBookingItem?.WARD_ID || '',
	);
	const [listBookingType, setListBookingType] = useState<any>([]);
	const [bookingTypeSelected, setBookingTypeSelected] = useState<any>(
		carBookingItem?.BOOKING_TP.trim() || '',
	);
	const [distance, setDistance] = useState<string>(
		carBookingItem?.DISTANCE.toString() || '',
	);
	const [destination, setDestination] = useState<string>(
		carBookingItem?.DESTINATION || '',
	);
	const [optionDestination, setOptionDestination] = useState<string>(
		carBookingItem?.OPTIONAL_ADDRESS || '',
	);
	const [listContactSelectedConvert, setListContactSelectedConvert] = useState<
		IContact[]
	>([]);
	const [customerName, setCustomerName] = useState(carBookingItem?.LS_NM || '');
	const [remark, setRemark] = useState<string>(carBookingItem?.RMKS || '');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			getCityResponse().then();
			getBookingTypeResponse().then();

			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: '',
					Dept_Code: dataUserSystem.DEPT_CODE || '0',
					Branch: '-1',
					subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
				}),
			);

			setDoneLoadAnimated(true);
		});
	}, []);

	/* Get District */
	useEffect(() => {
		if (citySelected) {
			(async function getData() {
				const credentials: any = await Keychain.getGenericPassword();
				// const responseDistrict: any = await getListDistrict({
				// 	cityCode: citySelected,
				// });

				// const districtConvert = responseDistrict?.map(item => ({
				// 	label: item.distNm,
				// 	value: item.distID,
				// }));

				const responseDistrict: any = await getListDistrict_old({
					User_ID: credentials.username,
					Password: credentials.password,
					cityCode: citySelected,
				});

				const districtConvert = responseDistrict?.map(item => ({
					label: item.STND_C_NM,
					value: item.C_NO,
				}));

				setListDistrict(districtConvert);
			})();
		}
	}, [citySelected]);

	/* Get Ward */
	useEffect(() => {
		if (districtSelected) {
			(async function getData() {
				const credentials: any = await Keychain.getGenericPassword();
				const responseWard: any = await getListWard({
					User_ID: credentials.username,
					Password: credentials.password,
					districtCode: districtSelected,
				});

				const wardConvert = responseWard?.map(item => ({
					label: item.STND_C_NM || item.STND_C_NM_V,
					value: item.C_NO,
					name: item.STND_C_NM,
				}));

				setListWard(wardConvert);
			})();
		}
	}, [districtSelected]);

	/* Check list contact selected */
	useEffect(() => {
		console.log(listContactPersonSelected);

		if (listContactPersonSelected) {
			const listConvert: IContact[] = listContactPersonSelected.map(
				contactPersonID => {
					return listContact?.find(
						contactPerson => contactPerson?.emp_no === contactPersonID,
					);
				},
			) as IContact[];

			setListContactSelectedConvert(listConvert);
		} else if (listContactSelectedConvert.length === 0) {
			const listConvert: IContact[] = valueItem?.OPTIONAL_EMP_NO?.trim()
				? (valueItem.OPTIONAL_EMP_NO.trim()
						.split(',')
						.map(
							optionEmpId =>
								listContact?.find(
									contactPerson => contactPerson?.emp_no === optionEmpId,
								) || null,
						) as IContact[])
				: [];

			setListContactSelectedConvert(listConvert.filter(item => item));
		}
	}, [listContactPersonSelected, listContact]);

	useEffect(() => {
		if (customerSelected) {
			setCustomerName(customerSelected.ls_nm);
		}
	}, [customerSelected]);

	const getCityResponse = async () => {
		// const responseCity: any = await getListCity({
		// 	action: 'city',
		// });

		// const cityConvert = responseCity.map(item => ({
		// 	label: `${item.city_code && `${item.city_code} -`} ${
		// 		item.city_nm || item.city_nm
		// 	}`,
		// 	value: item.city_code,
		// 	name: item.city_nm,
		// }));
		const credentials: any = await Keychain.getGenericPassword();
		const responseCity: any = await getListCity_old({
			User_ID: credentials.username,
			Password: credentials.password,
		});
		console.log('====================================');
		console.log(responseCity);
		console.log('====================================');
		const cityConvert = responseCity.map(item => ({
			label: `${item.C_NO && `${item.C_NO} -`} ${
				item.STND_C_NM || item.STND_C_NM
			}`,
			value: item.C_NO,
			name: item.STND_C_NM,
		}));

		setListCity(cityConvert);
	};

	const getBookingTypeResponse = async () => {
		const responseBookingType: any = await getListBookingType({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		});

		const bookingTypeConvert = responseBookingType.map(item => ({
			label: item.STND_C_NM || item.STND_C_NM,
			value: item.C_NO,
		}));

		setListBookingType(bookingTypeConvert);
	};

	const _onPressOpenContactPersonModal = () => {
		const convertListContactSelected = listContactSelectedConvert?.map(
			item => item.emp_no,
		);
		navigation.navigate('ChooseUserModal', {
			listContactPersonExisted: convertListContactSelected || [],
			deptCode: '0',
			screenBack: 'CarBookingDetailScreen',
		});
	};

	const _onPressButtonSave = async ({ flag }) => {
		let destinationFinal = destination;
		if (!destinationFinal) {
			const cityName = listCity.find(item => item.value === citySelected).name;
			const districtName = listDistrict.find(
				item => item.value === districtSelected,
			).name;

			const wardName = listWard.find(item => item.value === wardSelected).name;
			destinationFinal = `${wardName},${districtName},${cityName}`;
		}
		if (!bookingTypeSelected) {
			Alert.alert('Alert', 'Please choose booking type!');
			return;
		}
		const checkDate = new Date();
		if (diff_minutes(fromDate, toDate) < 30) {
			Alert.alert(
				'Alert',
				`From/to date can't equal and need to more than 30m`,
			);
			return;
		}

		if (!valueItem && Object.keys(customerSelected).length === 0) {
			Alert.alert('Warning', `Please choose customer!`);
			return;
		}

		const checkFromDateBack = fromDate.getTime() - checkDate.getTime();
		const checkToDateBack = toDate.getTime() - checkDate.getTime();

		if (checkFromDateBack < 0 || checkToDateBack < 0) {
			Alert.alert(
				'Alert',
				`This time you chose is in the past, do you want to continue?`,
				[
					{
						text: 'OK',
						onPress: () => insertCarBooking({ flag, destinationFinal }),
					},
					{ text: 'Cancel' },
				],
			);
		} else {
			insertCarBooking({ flag, destinationFinal });
		}
	};

	const insertCarBooking = async ({ flag, destinationFinal }) => {
		try {
			await updateCarBooking({
				flag,
				bookingId: valueItem?.BOOKING_ID,
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				CustomerID:
					customerSelected?.LESE_ID != null
						? customerSelected?.LESE_ID
						: valueItem?.LESE_ID,
				fromDate: moment(fromDate).format('YYYY-MM-DD HH:mm'),
				toDate: moment(toDate).format('YYYY-MM-DD HH:mm'),
				distance,
				destination: destination || removeVietnameseTones(destinationFinal),
				optionDestination,
				bookingType: bookingTypeSelected,
				leseName: customerName,
				rmks: remark,
				optionEmp: listContactSelectedConvert.reduce(
					(result, optionEmp) => result + `${optionEmp.emp_no},`,
					'',
				),
				cityId: citySelected,
				districtId: districtSelected,
				wardId: wardSelected,
			});

			dispatch(
				getListCarBooking({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					fromDate: moment(timeFrom).format('DDMMYYYY'),
					toDate: moment(timeTo).format('DDMMYYYY'),
					branchID: '',
					carID: '0',
					bookingID: '',
					subTeam: '',
					opEmpNO: dataUserSystem.EMP_NO,
					lsName: '',
					status: '0',
				}),
			);
			navigation.goBack();
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	function diff_minutes(dt2, dt1) {
		var diff = (dt2.getTime() - dt1.getTime()) / 1000;
		diff /= 60;
		return Math.abs(Math.round(diff));
	}

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Car Booking New'} />

			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<ScrollView style={{ flex: 1, padding: 8 }}>
						<Card style={{ padding: 8 }}>
							<View
								style={{
									flexDirection: 'row',
									marginBottom: 12,
								}}
							>
								<ButtonChooseDateTime
									label={'From date'}
									valueDisplay={moment(fromDate).format('DD/MM/YYYY HH:mm')}
									modalMode={'datetime'}
									value={fromDate}
									onHandleConfirmDate={date => {
										if (date.getTime() > toDate.getTime()) {
											setFromDate(date);
											setToDate(moment(date).add(30, 'minutes').toDate());
										} else {
											setFromDate(date);
										}
									}}
									containerStyle={{ flex: 1 }}
								/>

								<ButtonChooseDateTime
									label={'To date'}
									valueDisplay={moment(toDate).format('DD/MM/YYYY HH:mm')}
									value={toDate}
									modalMode={'datetime'}
									onHandleConfirmDate={date => {
										if (date.getTime() < fromDate.getTime()) {
											setFromDate(
												moment(date).subtract(30, 'minutes').toDate(),
											);
											setToDate(date);
										} else {
											setToDate(date);
										}
									}}
									containerStyle={{ flex: 1, marginLeft: 8 }}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<TextInputCustomComponent
									label="Organizer"
									enable={!valueItem}
									placeholder=""
									style={{ flex: 1, marginRight: 8 }}
									value={`${dataUserSystem.EMP_NO} - ${dataUserSystem.FST_NM} ${dataUserSystem.LST_NM}`}
								/>

								<PickerCustomComponent
									showLabel={true}
									listData={listCity}
									label="Province/ City"
									value={citySelected}
									style={{ flex: 1 }}
									textStyle={{ maxWidth: 110 }}
									onValueChange={text => setCitySelected(text)}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<PickerCustomComponent
									showLabel={true}
									listData={listDistrict}
									label="District"
									value={districtSelected}
									style={{ flex: 1, marginRight: 8 }}
									textStyle={{ maxWidth: 110 }}
									onValueChange={text => setDistrictSelected(text)}
								/>

								<PickerCustomComponent
									showLabel={true}
									listData={listWard}
									label="Ward"
									value={wardSelected}
									style={{ flex: 1 }}
									textStyle={{ maxWidth: 110 }}
									onValueChange={text => setWardSelected(text)}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<PickerCustomComponent
									showLabel={true}
									listData={listBookingType}
									label="Booking type"
									value={bookingTypeSelected}
									style={{ flex: 1, marginRight: 8 }}
									textStyle={{ maxWidth: 110 }}
									onValueChange={text => setBookingTypeSelected(text)}
								/>

								<TextInputCustomComponent
									label="Distance (km)"
									placeholder=""
									keyboardType={'numeric'}
									style={{ flex: 1 }}
									value={distance}
									onChangeText={text => setDistance(text)}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<TextInputCustomComponent
									label="Destination"
									placeholder=""
									multiline={true}
									style={{ flex: 1 }}
									value={destination}
									onChangeText={text => setDestination(text)}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 12 }}>
								<TextInputCustomComponent
									label="Option Destination"
									placeholder=""
									multiline={true}
									style={{ flex: 1 }}
									value={optionDestination}
									onChangeText={text => setOptionDestination(text)}
								/>
							</View>

							<View style={{ marginVertical: 8 }}>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
								>
									Optional Person
								</Text>
								<ScrollView
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									{listContactSelectedConvert?.map((contactPerson, index) =>
										renderItemChip({
											userID: contactPerson?.emp_no,
											name: contactPerson?.emp_nm,
											index,
											onPress: () => _onPressOpenContactPersonModal(),
										}),
									)}
									<TouchableOpacity
										style={{
											width: 40,
											height: 40,
											borderRadius: 25,
											backgroundColor: '#dfdfdf',
											justifyContent: 'center',
											alignItems: 'center',
										}}
										onPress={() => _onPressOpenContactPersonModal()}
									>
										<Text>+</Text>
									</TouchableOpacity>
								</ScrollView>
							</View>
						</Card>

						<Card style={{ padding: 8, marginTop: 8 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<TextInputCustomComponent
									label="Customer Name"
									placeholder="Customer Name"
									style={{ marginBottom: 12, flex: 1 }}
									value={customerName}
									iconRight={'search-outline'}
									onChangeText={text => setCustomerName(text)}
									onPress={() =>
										navigation.navigate('ChooseCustomerModal', {
											idCustomerExisted:
												customerSelected?.LESE_ID || valueItem?.LESE_ID,
											screenBack: 'CarBookingDetailScreen',
										})
									}
								/>
							</View>

							<TextInputCustomComponent
								label="Remark"
								placeholder=""
								multiline
								inputStyle={{
									height: Platform.OS === 'android' ? 50 : 'auto',
									textAlignVertical: 'top',
								}}
								value={remark}
								onChangeText={text => setRemark(text)}
							/>
						</Card>

						<View style={{ flexDirection: 'row', marginTop: 16 }}>
							{(!valueItem || valueItem?.ST_C === '03') && (
								<Button
									mode="contained"
									style={{ flex: 1, marginRight: 8 }}
									uppercase={false}
									onPress={() =>
										_onPressButtonSave({ flag: valueItem ? 'U' : 'I' })
									}
								>
									{'Save'}
								</Button>
							)}

							{valueItem?.ST_C === '03' && (
								<Button
									mode="contained"
									style={{ flex: 1, marginRight: 8, backgroundColor: 'red' }}
									uppercase={false}
									onPress={() => _onPressButtonSave({ flag: 'D' })}
								>
									{'Delete'}
								</Button>
							)}
						</View>
						<SafeAreaView style={{ height: 60 }} />
					</ScrollView>
				</KeyboardAvoidingView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
