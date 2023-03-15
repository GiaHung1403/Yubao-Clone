import { Ionicons } from '@expo/vector-icons';
import ml from '@react-native-firebase/ml';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Image,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Button, Card, useTheme } from 'react-native-paper';

import Header from '@components/Header';
import ImageViewerCustom from '@components/ImageViewerCustom';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';
import styles from './styles';
import { removeVietnameseTones } from '@utils';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import moment from 'moment';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import PickerCustomComponent from '@components/PickerCustomComponent';
import { insertCustomerInfo, insertSellerInfo } from '@data/api';
import { IUserSystem } from '@models/types';
import { useSelector } from 'react-redux';
import { url_api_getListECoinReport } from '@data/Constants';

const optionsCamera = {
	cropping: true,
	compressImageQuality: 0.8,
	width: 1200,
	height: 1600,
	freeStyleCropEnabled: true,
	cropperAvoidEmptySpaceAroundImage: true,
	cropperChooseText: 'Choose',
	cropperCancelText: 'Cancel',
	includeBase64: true,
};

export function IDCardFormScreen(props: any) {
	const navigation: any = useNavigation();
	const imageViewerRef = useRef<any>();
	const {
		result,
		image,
		isFront,
		imageUpdateFront,
		imageUpdateBack,
		gptText,
		QRData,
	}: any = props.route.params;
	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [imageFrontUpdate, setImageFrontUpdate] = useState(() =>
		imageUpdateFront ? imageUpdateFront : false,
	);
	const [imageBackUpdate, setImageBackUpdate] = useState(() =>
		imageUpdateBack ? imageUpdateBack : false,
	);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	// const [phoneNumber, setPhoneNumber] = useState<any>('');

	const listType = [
		{ label: 'Choose', value: '0' },
		{ label: 'Customer', value: '1' },
		{ label: 'Guarantor', value: '2' },
		{ label: 'Saleman', value: '3' },
		{ label: 'Dealer', value: '4' },
		{ label: 'Contact person', value: '5' },
	];

	const [chooseType, setChooseType] = useState<any>('1');

	const [dataCardID, setDataCardID] = useState<any>({
		ID: '',
		Name: '',
		Name_VN: '',
		Birth_Day: new Date(),
		Sex: '',
		Nation: '',
		Country: '',
		Address: '',
		End_DateCreate: new Date(),
		Start_DateCreate: new Date(),
		Phone_Number: '',
		Valid_To: new Date(),
	});

	// console.log('====================================');
	// console.log('render');
	// console.log('====================================');

	useEffect(() => {
		setDoneLoadAnimated(true);
		if (image !== '') {
			if (isFront) {
				setImageFrontUpdate(image);
			} else {
				setImageBackUpdate(image);
			}
		}

		try {
			if (!gptText) throw new Error('NO GPT TEXT');
			let gptTextParse = JSON.parse(gptText);

			if (isFront) {
				console.log("$$$$$$$$$$$  ", gptTextParse.card_id_number);
				setDataCardID(i => {
					return {
						// ...i,
						ID: gptTextParse.card_id_number || '',
						Name: gptTextParse.full_name || '',
						Name_VN: gptTextParse.full_name || '',
						Birth_Day: convertDate(
							(gptTextParse.birth_day || gptTextParse.date_of_birth || Date.now()).toString()?.replaceAll(
								'-',
								'/',
							),
						),
						Sex: gptTextParse.sex || '',
						Nation: gptTextParse.nationality || 'Viet Nam',
						Phone_Number: gptTextParse.telephone_number || '',

						// Country: country,
						Address: gptTextParse.address || '',
						// End_DateCreate: convertDate((gptTextParse.birth_day || gptTextParse.date_of_birth)?.replaceAll("-", "/") || Date.now()),
						// Start_DateCreate: convertDate((gptTextParse.birth_day || gptTextParse.date_of_birth)?.replaceAll("-", "/") || Date.now()),

						Valid_To: convertDate(
							(gptTextParse.valid_until || gptTextParse.valid_untill || Date.now()).toString()?.replaceAll(
								'-',
								'/',
							),
						),
					}
				});
			} else {
				setDataCardID({
					...dataCardID,
					Phone_Number: gptTextParse.telephone_number || '',

					End_DateCreate: convertDate(
						(gptTextParse.Date || gptTextParse.date || Date.now()).toString()?.replaceAll(
							'-',
							'/',
						),
					),
					Start_DateCreate: convertDate(
						(gptTextParse.Date || gptTextParse.date || Date.now()).toString()?.replaceAll(
							'-',
							'/',
						),
					),
				});
			}
		} catch (e: any) {
			console.log(e)
			const textRemoveTones = removeVietnameseTones(result);
			const listTextFrontSplit: string[] = textRemoveTones.split(/[\n|]/);

			if (
				textRemoveTones.toLowerCase().includes('identity') ||
				textRemoveTones.toLowerCase().includes('identification')
			) {
				if (QRData.length === 0) {
					Alert.alert('Alert', `Can't analyzing, please scan again !!!`);
				} else handleResultCCCD_New(listTextFrontSplit);
			} else if (
				textRemoveTones.toUpperCase().includes('CAN CUOC CONG DAN') ||
				textRemoveTones.toLowerCase().includes('dac diem nhan dang')
			) {
				handleResultCCCD_Old(listTextFrontSplit);
			}
		}
	}, [result, imageUpdateFront, imageUpdateBack]);

	const handleResultCCCD_New = (listResult: string[]) => {
		console.log('====================================');
		console.log(listResult, 'Form moi');
		console.log('====================================');
		if (isFront) {
			const convertQRData = QRData[0]?.split('|');
			let id = convertQRData[0];
			let name = removeVietnameseTones(convertQRData[2]).toUpperCase();
			let name_vn = convertQRData[2];
			let birth_Day = new Date(
				convertQRData[3].slice(4, 8),
				convertQRData[3].slice(2, 4) - 1,
				convertQRData[3].slice(0, 2),
			);
			let sex = convertQRData[4];
			let nation = '';
			let country = '';
			let address = convertQRData[5];
			let end_DateCreate = '';
			let start_DateCreate = new Date(
				convertQRData[6].slice(4, 8),
				convertQRData[6].slice(2, 4) - 1,
				convertQRData[6].slice(0, 2),
			);
			const regexName = /[\[\]\!\(0-9)\(a-z)@#%&,.+={}'/""<>:]/g;
			const regexID = /[\(0-9)]/g;
			try {
				for (const [index, text] of listResult.entries()) {
					if (listResult[index].toLowerCase().includes('co gia tri den')) {
						end_DateCreate = listResult[index].split(':')[1].trim();
					}
				}
				setDataCardID({
					...dataCardID,
					ID: id,
					Name: name,
					Name_VN: name_vn,
					Birth_Day: birth_Day,
					Sex: sex,
					Nation: 'Viet Nam',
					// Country: country,
					Address: address,
					End_DateCreate: convertDate(end_DateCreate),
					Start_DateCreate: start_DateCreate,
				});
			} catch (error) {
				Alert.alert('Alert', 'Please Scan Again:', [
					{
						text: 'Ok',
					},
				]);
			}
		}
	};

	const handleResultCCCD_Old = (listResult: string[]) => {
		console.log('====================================');
		console.log(listResult, 'Form cu');
		console.log('====================================');
		if (isFront) {
			let id = '';
			let name = '';
			let name_vn = '';
			let birth_Day = '';
			let sex = '';
			let nation = '';
			let country = '';
			let address = '';
			let end_DateCreate = '';
			const regexName = /[\[\]\!\(0-9)\(a-z)@#%&,.+={}'/""<>:]/g;

			try {
				for (const [index, text] of listResult.entries()) {
					if (listResult[index].toLowerCase().includes('so')) {
						id = listResult[index].split(':')[1];
					} else if (!regexName.test(listResult[index])) {
						name = listResult[index];
					} else if (listResult[index].includes('Gioi tinh')) {
						sex = listResult[index].split(':')[1]?.trim();
					} else if (listResult[index].includes('Ngay, thang, nam sinh')) {
						birth_Day = listResult[index].split(':')[1]?.trim();
					} else if (listResult[index].includes('Que quan')) {
						country = listResult[index]?.split(':')[1]?.trim();
					} else if (listResult[index].includes('Quoc tich')) {
						nation = listResult[index].split(':')[1]?.trim();
					} else if (listResult[index].includes('Co gia tri den')) {
						end_DateCreate = listResult[index].split(':')[1]?.trim();
					} else if (listResult[index].includes('Noi thuong tru')) {
						const temp = listResult[index].split(':');
						address = temp[1];
					} else if (listResult[index].includes(',')) {
						address += listResult[index];
					}
				}
				setDataCardID({
					...dataCardID,
					ID: id,
					Name: name,
					Name_VN: name,
					Birth_Day: convertDate(birth_Day),
					Sex: sex,
					Nation: nation,
					Country: country,
					Address: address,
					End_DateCreate: convertDate(end_DateCreate),
				});
			} catch (error) {
				console.log(error);
				Alert.alert('Alert', 'Please Scan Again', [
					{
						text: 'Ok',
					},
				]);
			}
		} else {
			let start_DateCreate: any = '';
			const regexDate = /[\[\]\!@#%&,.+={}'""<>:]/;
			try {
				for (const [index, text] of listResult.entries()) {
					if (listResult[index].includes('thang')) {
						const temp: any = listResult[index].split(' ');
						start_DateCreate = `${temp[1]}/${temp[3]}/${temp[5]}`;
						setDataCardID({
							...dataCardID,
							Start_DateCreate: convertDate(start_DateCreate),
						});
					}
				}
			} catch (error) {
				Alert.alert('Alert', 'Please Scan Again :vvv', [
					{
						text: 'Ok',
					},
				]);
			}
		}
	};

	const convertDate = date => {
		const temp = date.split('/');
		return new Date(temp[2], temp[1] - 1, temp[0]);
	};

	const _onPressNextButton = async () => {
		if (!imageFrontUpdate && !imageBackUpdate) {
			Alert.alert('Alert', 'Please input image!!!');
			return;
		}

		setLoading(true);
		try {
			switch (chooseType) {
				case '1':
					await insertCustomerInfo({
						COMPANY_TAXCODE: '',
						CUSTOMER_NAME: dataCardID?.Name,
						COMPANY_ADDRESS: dataCardID?.Address,
						COMPANY_NAME_VN: dataCardID?.Name_VN,
						TNO: dataCardID?.Phone_Number,
						USER_ID: dataUserSystem.EMP_NO,
						PERSON_TNO: dataCardID?.Phone_Number,
						CCCD: dataCardID?.ID,
						BIRTHDAY: moment(dataCardID?.Birth_Day).format('DDMMYYYY'),
						CUSTOMER_TYPE: 2,
					});
					break;
				case '4':
					await insertSellerInfo({
						TAX_CODE: '',
						COMPANY_NAME: dataCardID.Name,
						COMPANY_NAME_VN: dataCardID?.Name_VN,
						COMPANY_ADDRESS_EN: removeVietnameseTones(dataCardID?.Address),
						COMPANY_ADDRESS_VN: dataCardID?.Address,
						Telephone_No: dataCardID?.Phone_Number,
						USER_ID: dataUserSystem.EMP_NO,
						Phone_NO_GD: '',
						nation: 'VN',
						typeOfSeller: 2,
						cicCode: '',
						OrganizationType: '',
						FROM_DATE: '31122049',
						TO_DATE: moment(dataCardID.Start_DateCreate).format('DDMMYYYY'),
						Passport_GD: '',
						TypeOfCompany: 0,
						Passport: dataCardID.ID,
						IssuedBy_VN: '',
						IssuedBy_EN: '',
					});
					break;
				default:
					break;
			}

			setLoading(false);
			setImageFrontUpdate(false);
			setImageBackUpdate(false);
			Alert.alert('Alert', `Create ${listType[chooseType].label} Successful `);
		} catch (e: any) {
			Alert.alert('Error', e.message);
			// console.log('====================================');
			// console.log(dataCardID);
			// console.log('====================================');
			setLoading(false);
		}
	};

	const ViewPicker = ({ title, data }) => {
		return (
			<View style={styles.pickerStyle}>
				<Text style={{ fontSize: 15, flex: 3 }}>{title}</Text>
				<View
					style={{
						flexDirection: 'row',
						flex: 3,
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}
				>
					<Text style={{ textAlign: 'right' }}>{data}</Text>
					<Icon
						as={Ionicons}
						name={'chevron-forward-outline'}
						size={6}
						color={colors.primary}
					/>
				</View>
			</View>
		);
	};

	useEffect(() => {
		switch (chooseType) {
			case '2':
				Alert.alert('Alert', 'Comming Soon!!!');
				setChooseType('1');
				break;
			case '3':
				Alert.alert('Alert', 'Comming Soon!!!');
				setChooseType('1');
				break;
			case '5':
				Alert.alert('Alert', 'Comming Soon!!!');
				setChooseType('1');
				break;

			default:
				break;
		}
	}, [chooseType]);

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Scan Card ID'} />
			{doneLoadAnimated ? (
				<ScrollView style={{}}>
					<View style={{}}>
						<Card
							elevation={2}
							style={{ padding: 8, marginBottom: 10, margin: 8 }}
						>
							<TouchableOpacity
								style={{
									width: '100%',
									position: 'relative',
									paddingBottom: 8,
								}}
								onPress={() => {
									console.log('print image front');
									imageFrontUpdate
										? imageViewerRef.current.onShowViewer(
											[{ url: imageFrontUpdate }],
											0,
										)
										: navigation.navigate('IDCardScanScreen', {
											isFront: true,
										});
									// ImagePicker.openCamera(optionsCamera).then((image: any) => {
									//      setImageFrontUpdate(image.path);
									//   });
								}}
							>
								<Image
									source={{
										uri: imageFrontUpdate
											? imageFrontUpdate
											: 'https://img.icons8.com/bubbles/344/business-contact.png',
									}}
									resizeMode={imageFrontUpdate ? 'cover' : 'contain'}
									style={{ width: '100%', height: 200 }}
								/>

								{imageFrontUpdate && (
									<TouchableOpacity
										style={{ position: 'absolute', top: -10, right: -10 }}
										onPress={() => {
											setImageFrontUpdate(false);

											setDataCardID({
												...dataCardID,
												ID: '',
												Name: '',
												Name_VN: '',
												Birth_Day: new Date(),
												Sex: '',
												Nation: '',
												Country: '',
												Address: '',
												End_DateCreate: new Date(),
												Start_DateCreate: new Date(),
												Phone_Number: '',
												Valid_To: new Date(),
											});
										}}
									>
										<View>
											<Icon
												as={Ionicons}
												name={'close-circle-outline'}
												size={7}
												color={'red.500'}
											/>
										</View>
									</TouchableOpacity>
								)}
							</TouchableOpacity>
							{imageFrontUpdate ? (
								<View>
									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInputCustomComponent
											label="Card ID"
											value={dataCardID.ID}
											style={{ flex: 1, marginRight: 8 }}
											onChangeText={text => {
												console.log(dataCardID.ID)
												setDataCardID({ ...dataCardID, ID: text })
											}
											}
											textColor="red"
										/>
										<TextInputCustomComponent
											label="Name"
											value={dataCardID.Name}
											style={{ flex: 1 }}
											onChangeText={text =>
												setDataCardID({ ...dataCardID, Name: text })
											}
											textColor="red"
										/>
									</View>
									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInputCustomComponent
											label="Sex"
											value={dataCardID.Sex}
											style={{ flex: 1, marginRight: 8 }}
											onChangeText={text =>
												setDataCardID({ ...dataCardID, Sex: text })
											}
										/>
										<ButtonChooseDateTime
											label={'Birth Day'}
											modalMode="date"
											valueDisplay={moment(
												dataCardID.Birth_Day || Date.now(),
											).format('DD/MM/YYYY')}
											value={dataCardID.Birth_Day}
											minuteInterval={30}
											onHandleConfirmDate={date =>
												setDataCardID({ ...dataCardID, Birth_Day: date })
											}
											containerStyle={{ flex: 1 }}
											textColor="red"
										/>
									</View>
									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInputCustomComponent
											label="Nationality"
											value={dataCardID.Nation}
											style={{ flex: 1, marginRight: 8 }}
											onChangeText={text =>
												setDataCardID({ ...dataCardID, Nation: text })
											}
										/>
										<ButtonChooseDateTime
											label={'Date of expiry'}
											modalMode="date"
											valueDisplay={moment(dataCardID.Valid_To).format(
												'DD/MM/YYYY',
											)}
											textColor="red"
											value={dataCardID.Valid_To}
											minuteInterval={30}
											onHandleConfirmDate={date =>
												setDataCardID({ ...dataCardID, Valid_To: date })
											}
											containerStyle={{ flex: 1 }}
										/>
									</View>

									<TextInputCustomComponent
										label="Address"
										value={dataCardID.Address}
										style={{ marginBottom: 8 }}
										onChangeText={text =>
											setDataCardID({ ...dataCardID, Address: text })
										}
										textColor="red"
									/>
									<TextInputCustomComponent
										label="Telephone No."
										value={dataCardID?.Phone_Number}
										style={{ marginBottom: 8 }}
										onChangeText={text =>
											setDataCardID({ ...dataCardID, Phone_Number: text })
										}
									/>
								</View>
							) : null}
							<Text
								style={{
									fontWeight: '500',
									color: '#333',
									alignSelf: 'center',
									paddingBottom: 8,
								}}
							>
								Front Side
							</Text>
						</Card>

						<Card
							elevation={2}
							style={{ padding: 8, marginBottom: 10, margin: 8 }}
						>
							<View
								style={{
									padding: 8,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<TouchableOpacity
									style={{
										width: '100%',
										position: 'relative',
										paddingBottom: 8,
									}}
									onPress={() => {
										imageBackUpdate
											? imageViewerRef.current.onShowViewer(
												[{ url: imageBackUpdate }],
												0,
											)
											: navigation.navigate('IDCardScanScreen', {
												isFront: false,
											});
										// ImagePicker.openCamera(optionsCamera).then((image: any) => {
										//      setImageBackUpdate(image.path);
										//   });
									}}
								>
									<Image
										source={{
											uri: imageBackUpdate
												? imageBackUpdate
												: 'https://img.icons8.com/bubbles/344/bank-card-back-side.png',
										}}
										resizeMode={imageBackUpdate ? 'cover' : 'contain'}
										style={{ width: '100%', height: 200 }}
									/>

									{imageBackUpdate && (
										<TouchableOpacity
											style={{ position: 'absolute', top: -10, right: -10 }}
											onPress={() => setImageBackUpdate(undefined)}
										>
											<View>
												<Icon
													as={Ionicons}
													name={'close-circle-outline'}
													size={7}
													color={'red.500'}
												/>
											</View>
										</TouchableOpacity>
									)}
								</TouchableOpacity>
								{imageBackUpdate ? (
									<View style={{ flex: 1 }}>
										<TextInputCustomComponent
											label="Noi Cap"
											value={
												'CUC TRUONG CUC CANH SAT QUAN LY HANH CHINH VE TRAT TU XA HOI'
											}
											style={{ marginBottom: 8, flex: 1 }}
										// onChangeText={text =>
										//  setDataCardID({ ...dataCardID, Name: text })
										// }
										/>
										<ButtonChooseDateTime
											label={'Create Date'}
											modalMode="date"
											valueDisplay={moment(dataCardID.End_DateCreate).format(
												'DD/MM/YYYY',
											)}
											value={dataCardID.End_DateCreate}
											minuteInterval={30}
											onHandleConfirmDate={date =>
												setDataCardID({ ...dataCardID, End_DateCreate: date })
											}
											containerStyle={{ flex: 1, marginBottom: 8 }}
											textColor="red"
										/>
									</View>
								) : null}

								<Text
									style={{
										fontWeight: '500',
										color: '#333',
										alignSelf: 'center',
										paddingBottom: 8,
									}}
								>
									Back Side
								</Text>
							</View>
						</Card>
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
						}}
					>
						<PickerCustomComponent
							showLabel={false}
							listData={listType}
							label=""
							value={chooseType}
							style={{ flex: 1, marginHorizontal: 8 }}
							onValueChange={text => setChooseType(text)}
						/>

						<Button
							disabled={!imageFrontUpdate && !imageBackUpdate ? true : false}
							mode={'contained'}
							uppercase={false}
							loading={loading}
							style={{
								flex: 1,
								marginTop: 5,
								marginBottom: 50,
								alignSelf: 'center',
								marginRight: 8,
								backgroundColor:
									!imageFrontUpdate && !imageBackUpdate
										? '#d3d3d3'
										: colors.primary,
								// backgroundColor : colors.primary
							}}
							onPress={() => _onPressNextButton()}
						>
							{loading ? 'Loading...' : 'Next'}
						</Button>
					</View>
				</ScrollView>
			) : (
				<LoadingFullScreen />
			)}

			<ImageViewerCustom
				ref={ref => {
					imageViewerRef.current = ref;
				}}
			/>
		</View>
	);
}
