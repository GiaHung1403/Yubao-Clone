/* eslint-disable react-native/no-inline-styles */
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import Header from '@components/Header';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { removeVietnameseTones } from '@utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	Image,
	KeyboardAvoidingView,
	PermissionsAndroid,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { Button, Card, Checkbox, useTheme } from 'react-native-paper';
import { insertTaxiData } from '@data/api';
import { useNavigation } from '@react-navigation/native';
import { IUserLoginRC } from '@models/types';
import { useSelector } from 'react-redux';

export function TaxiBillResultScreen(props) {
	const { result, image, gptText } = props.route.params;
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	const [isCheckedSaveImage, setCheckedSaveImage] = useState(false);
	const [isCheckedShowLog, setCheckedShowLog] = useState(false);
	const [supplierName, setSupplierName] = useState('');
	const [receiptSerialNo, setReceiptSerialNo] = useState('');
	const [bookingID, setBookingID] = useState('');
	const [cardNumber, setCardNumber] = useState('');
	const [totalAmount, setTotalAmount] = useState('');
	const [usingPerson, setUsingPerson] = useState('Get from Database');
	const [invoiceNo, setInvoiceNo] = useState('');
	const [driverID, setDriverID] = useState('');
	const [numberPlate, setNumberPlate] = useState('');
	const [usingDateTime, setUsingDateTime] = useState(new Date());

	const [loading, setLoading] = useState(false);

	useEffect(() => {

		try {
			if (!gptText) throw new Error("No GPT Data")

			let gptTextParse = JSON.parse(gptText);

			setBookingID(gptTextParse.id || gptTextParse.Id || '');
			setTotalAmount(`${gptTextParse.total_amount}` || '');

			setSupplierName(
				gptTextParse.supplier_name || gptTextParse.supllier_name || '',
			);

			setReceiptSerialNo(
				gptTextParse.recipt_serial_number ||
				gptTextParse.receipt_serial_number ||
				gptTextParse.receipt_serial_number ||
				'',
			);
			setCardNumber(gptTextParse.card_number || '');
			setUsingPerson(gptTextParse.using_person || '');
			setInvoiceNo(gptTextParse.invoice_no || '');
			setDriverID(gptTextParse.driver_id || '');
			setNumberPlate(gptTextParse.plate_number || '');

			const dateString =
				(gptTextParse.used_time || ' ') +
				' ' +
				(gptTextParse.used_date || '');
			const [time, date] = dateString.split(' ');

			const [day, month, year] = date.split('/');
			const [hour, minute] = time.split(':');

			const dateObject = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
			setUsingDateTime(dateObject);
		}
		catch (e: any) {
			console.log(e.message)
			const textRemoveTones = removeVietnameseTones(result);

			const listTextFrontSplit: string[] = textRemoveTones.split(/[\n|]+/);

			if (
				textRemoveTones.toUpperCase().includes('VNPAY') ||
				textRemoveTones.toUpperCase().includes('MAI LINH')
			) {
				handleResultVNPAY(listTextFrontSplit);
			} else if (textRemoveTones.toUpperCase().includes('VIETINBANK')) {
				handleResultVietinBank(listTextFrontSplit);
			}

		}
	}, [result]);

	const handleResultVNPAY = (listResult: string[]) => {
		console.log('====================================');
		console.log(listResult);
		console.log('====================================');
		setSupplierName('MAILINH');
		const bookingIDResult = listResult[0];

		const indexBookingIDLabel = bookingIDResult.toLowerCase().indexOf('id:');
		setBookingID(bookingIDResult);
		// if (indexBookingIDLabel > -1) {
		// 	// const resultBookingID = bookingIDResult.substring(
		// 	// 	indexBookingIDLabel + 4,
		// 	// );
		// 	const resultBookingID = bookingIDResult[0]
		// 	setBookingID(resultBookingID);
		// }
		for (const [index, text] of listResult.entries()) {
			// if (text.toLowerCase().includes('invoice')) {
			// 	let resultInvoice = listResult[index + 1];
			// 	if (resultInvoice.toLowerCase().includes('tham chieu')) {
			// 		resultInvoice = listResult[index + 2];
			// 	}
			// 	setInvoiceNo(resultInvoice);
			// }
			if (!isNaN(text as any) && (text.length == 4 || text.length == 3)) {
				let resultInvoice = listResult[index];
				setInvoiceNo(resultInvoice);

				let textSplitLabelDate = listResult[index - 1]?.split(' ') || '';

				const resultDate =
					textSplitLabelDate[textSplitLabelDate?.length - 1] || '';
				const listResultDate: any = resultDate?.split('/');
				const resultTime =
					textSplitLabelDate[textSplitLabelDate?.length - 2] || '';
				const listResultTime: any = resultTime?.split(':');

				setUsingDateTime(
					new Date(
						listResultDate[2],
						listResultDate[1] - 1,
						listResultDate[0],
						listResultTime[0],
						listResultTime[1],
						0,
						0,
					),
				);
			}

			// if (text.toLowerCase().includes('time/')) {
			// 	let textSplitLabelDate = text.split(' ');

			// 	if (textSplitLabelDate.length === 3) {
			// 		textSplitLabelDate = listResult[index + 1].split(' ');
			// 	}
			// 	const resultDate = textSplitLabelDate[textSplitLabelDate.length - 1];
			// 	const listResultDate: any = resultDate?.split('/');
			// 	const resultTime = textSplitLabelDate[textSplitLabelDate.length - 2];
			// 	const listResultTime: any = resultTime?.split(':');

			// 	setUsingDateTime(
			// 		new Date(
			// 			listResultDate[2],
			// 			listResultDate[1] - 1,
			// 			listResultDate[0],
			// 			listResultTime[0],
			// 			listResultTime[1],
			// 			0,
			// 			0,
			// 		),
			// 	);
			// }

			// if (text.toLowerCase().includes('total')) {
			// 	let result = listResult[index + 1];
			// 	if (!result.toLowerCase().includes('vnd')) {
			// 		const indexTotal = text.toLowerCase().indexOf('tien');
			// 		result = text.substring(indexTotal + 5);
			// 	}
			// 	setTotalAmount(result.replace(/[^0-9-]+/g, ''));
			// }

			if (text.includes('VND')) {
				let result = listResult[index];
				setTotalAmount(result?.replace(/[^0-9-]+/g, ''));
			}
			if (text.toLowerCase().includes('****')) {
				setCardNumber(text.substring(text?.length - 4));
			}

			// if (text.toLowerCase().includes('tham chieu')) {
			// 	let result: any = listResult[index + 1];
			// 	// if (result.toLowerCase().includes('d/m')) {
			// 	// 	const indexRef = text.toLowerCase().indexOf('tham chieu');

			// 	// 	const textSplitLabel = text.substring(indexRef + 12);
			// 	// 	result = textSplitLabel;
			// 	// } else {
			// 	// 	if (result.length < 6) {
			// 	// 		result = listResult[index + 2];
			// 	// 	}
			// 	// }
			// 	// setReceiptSerialNo(result);
			// 	if (!isNaN(result)) {
			// 		setReceiptSerialNo(result);
			// 	} else {
			// 		for (let i = index; i <= listResult.length; i++) {
			// 			result = listResult[i];
			// 			if (!isNaN(result) && result.length ==12) {
			// 				setReceiptSerialNo(result);
			// 				break;
			// 			}
			// 		}
			// 	}
			// }

			if (!isNaN(text as any) && text.length == 12) {
				setReceiptSerialNo(text);
			}

			if (text.toLowerCase().includes('ma tai xe')) {
				let resultIDTaxi = listResult[index + 1] || '';
				if (resultIDTaxi?.toLowerCase().includes('taxi id')) {
					resultIDTaxi = listResult[index + 2];
				}
				setDriverID(resultIDTaxi);
			}
			if (text.toLowerCase().includes('bien so xe')) {
				let resultPlate = listResult[index + 1];
				if (resultPlate?.toLowerCase()?.includes('number plates')) {
					resultPlate = listResult[index + 2];
				}
				setNumberPlate(resultPlate);
			}
		}
	};

	const handleResultVietinBank = (listResult: string[]) => {
		setSupplierName('TAXI VINASUN');

		const bookingIDResult = listResult[0];
		const indexBookingIDLabel = bookingIDResult.toLowerCase().indexOf('id:');
		setBookingID(bookingIDResult);

		// if (indexBookingIDLabel > -1) {
		// 	// const resultBookingID = bookingIDResult.substring(
		// 	// 	indexBookingIDLabel + 4,
		// 	// );
		// 	const resultBookingID = bookingIDResult[0];
		// 	setBookingID(resultBookingID);

		// }

		for (const [index, text] of listResult.entries()) {
			if (text.toLowerCase().includes('swipe')) {
				const resultReceipt = listResult[index + 1];
				setReceiptSerialNo(resultReceipt);

				const indexCardNumber = text.toLowerCase().indexOf('(swipe)');
				const textSplitLabel = text.substring(indexCardNumber - 5);
				const indexSpace = textSplitLabel.indexOf(' ');
				const resultCardNumber = textSplitLabel.substring(
					0,
					indexSpace > -1 ? indexSpace : undefined,
				);
				setCardNumber(resultCardNumber);
			}
			if (text.toLowerCase().includes('invoice/')) {
				const indexInvoice = text.toLowerCase().indexOf('invoice/');
				const textSplitLabel = text.substring(indexInvoice + 17);
				const indexSpace = textSplitLabel.indexOf(' ');
				const result = textSplitLabel.substring(
					0,
					indexSpace > -1 ? indexSpace : undefined,
				);
				setInvoiceNo(result);
			}
			if (text.toLowerCase().includes('chieu')) {
				const indexRef = text.toLowerCase().indexOf('chieu');
				const result = text.substring(indexRef + 7);
				setReceiptSerialNo(result);
			}
			if (text.toLowerCase().includes('vien')) {
				const indexDriverID = text.toLowerCase().indexOf('vien');
				const result = text.substring(indexDriverID + 6);
				setDriverID(result);
			}
			if (
				text.toLowerCase().includes('ngay') &&
				text.toLowerCase().includes('gio')
			) {
				const indexDate = text.toLowerCase().indexOf('ngay');
				const textSplitLabelDate = text.substring(indexDate + 6);
				const indexSpaceDate = textSplitLabelDate.indexOf(' ');
				const resultDate = textSplitLabelDate.substring(
					0,
					indexSpaceDate > -1 ? indexSpaceDate : undefined,
				);
				const listResultDate: any = resultDate.split('/');

				const indexTime = text.toLowerCase().indexOf('gio');
				const resultTime = text.substring(indexTime + 5);
				const listResultTime: any = resultTime.split(':');

				setUsingDateTime(
					new Date(
						listResultDate[2],
						listResultDate[1] - 1,
						listResultDate[0],
						listResultTime[0],
						listResultTime[1],
						listResultTime[2],
						0,
					),
				);
			}
			if (text.toLowerCase().includes('total/')) {
				const result = listResult[index + 1];
				setTotalAmount(result.replace(/[^0-9-]+/g, ''));
			}
		}
	};

	// const getCard_No = async ()=>{
	// 	const dataCard: any = await getListTaxiCard({ action: 'GET_TAXI_CARD' });
	// 	return dataCard.
	// }

	const _onPressSave = async () => {
		try {
			const data = await insertTaxiData({
				action: 'INST_TAXI_FEE',
				req_ID: bookingID,
				card_No: '',
				destination: '',
				total_Fee: totalAmount,
				serial_No: receiptSerialNo,
				user_login: dataUserRC.userId,
			})
				.then(i => {
					console.log(i);
				})
				.catch(e => console.log(e));
			// Alert.alert('Alert', "You don't have permission to in this room!!!", [
			// 	{
			// 		text: 'Ok',
			// 		onPress: () => {
			// 			Alert.alert('Alert', 'Do you want to join this room?', [
			// 				{ text: 'Cancel', onPress: () => navigation.goBack() },
			// 				{
			// 					text: 'Yes',
			// 					onPress: async () => sendRequest(),
			// 					// onPress: () => navigation.goBack(),
			// 				},
			// 			]);
			// 		},
			// 	},
			// ]);
			navigation.goBack();
		} catch (error: any) {
			//do nothing
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Scan Taxi Bill'} />
			</View>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'android' ? undefined : 'padding'}
				style={{ flex: 1 }}
			>
				<ScrollView style={{ flex: 1 }}>
					<View style={{ padding: 8 }}>
						<Card style={{ padding: 8, marginBottom: 10 }}>
							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInputCustomComponent
									label="BookingID"
									value={bookingID}
									style={{ flex: 1 }}
									onChangeText={setBookingID}
									textColor='red'
								/>
								<TextInputCustomComponent
									label="Receipt Serial No"
									value={receiptSerialNo}
									style={{ marginLeft: 8, flex: 1 }}
									onChangeText={setReceiptSerialNo}
									textColor='red'

								/>
							</View>
							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInputCustomComponent
									label="Invoice No"
									value={invoiceNo}
									style={{ flex: 1 }}
									onChangeText={setInvoiceNo}
								/>
								<TextInputCustomComponent
									label="Supplier Name"
									value={supplierName}
									style={{ marginLeft: 8, flex: 1 }}
									onChangeText={setSupplierName}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<ButtonChooseDateTime
									label={'Using Date'}
									modalMode="date"
									valueDisplay={moment(usingDateTime).format('DD/MM/YYYY')}
									value={usingDateTime}
									minuteInterval={30}
									onHandleConfirmDate={setUsingDateTime}
									containerStyle={{ flex: 1 }}
								/>

								<ButtonChooseDateTime
									label={'Using Time'}
									modalMode="time"
									valueDisplay={moment(usingDateTime).format('HH:mm:ss')}
									value={usingDateTime}
									onHandleConfirmDate={setUsingDateTime}
									containerStyle={{ flex: 1, marginLeft: 8 }}
								/>
							</View>

							<TextInputCustomComponent
								label="Using Person"
								value={usingPerson}
								style={{ marginBottom: 8 }}
								onChangeText={setUsingPerson}
							/>
							<TextInputCustomComponent
								label="Total Amount"
								value={totalAmount}
								style={{ marginBottom: 8 }}
								onChangeText={setTotalAmount}
								textColor='red'

							/>
						</Card>

						<Card style={{ padding: 8, marginBottom: 10 }}>
							<TextInputCustomComponent
								label="Card Number"
								value={cardNumber}
								style={{ marginBottom: 8 }}
								onChangeText={setCardNumber}
							/>
							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInputCustomComponent
									label="Payment Method"
									value={'Card'}
									style={{ flex: 1 }}
									onChangeText={_text => null}
								/>
							</View>
						</Card>

						<Card style={{ padding: 8 }}>
							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInputCustomComponent
									label="Driver ID/ Taxi ID"
									value={driverID}
									style={{ flex: 1, marginRight: 8 }}
									onChangeText={setDriverID}
								/>

								<TextInputCustomComponent
									label="Number Plate"
									value={numberPlate}
									style={{ flex: 1 }}
									onChangeText={setNumberPlate}
								/>
							</View>
						</Card>

						<View
							style={{ flexDirection: 'row', justifyContent: 'space-between' }}
						>
							<Checkbox.Item
								mode={'android'}
								position={'leading'}
								label={'Check to save picture'}
								labelStyle={{ fontSize: 14, color: '#666', fontWeight: '600' }}
								style={{ paddingHorizontal: 0 }}
								status={isCheckedSaveImage ? 'checked' : 'unchecked'}
								onPress={() => {
									setCheckedSaveImage(!isCheckedSaveImage);
								}}
								color={colors.primary}
								uncheckedColor={'#ddd'}
							/>

							<Checkbox.Item
								mode={'android'}
								position={'trailing'}
								label={'Show result'}
								labelStyle={{ fontSize: 14, color: '#666', fontWeight: '600' }}
								style={{ paddingHorizontal: 0 }}
								status={isCheckedShowLog ? 'checked' : 'unchecked'}
								onPress={() => {
									setCheckedShowLog(!isCheckedShowLog);
								}}
								color={colors.primary}
								uncheckedColor={'#ddd'}
							/>
						</View>

						{isCheckedShowLog && result ? (
							<View>
								<Text
									style={{
										color: colors.primary,
										fontWeight: '600',
										marginBottom: 8,
									}}
								>
									Text
								</Text>
								<Image
									source={{ uri: image }}
									style={{ width: '100%', height: 300, marginBottom: 8 }}
									resizeMode={'contain'}
								/>
								<Text>{result}</Text>
							</View>
						) : null}

						<Button
							mode={'contained'}
							uppercase={false}
							loading={loading}
							style={{
								margin: 8,
								backgroundColor: colors.primary,
							}}
							onPress={() => _onPressSave()}
						>
							{loading ? 'Loading...' : 'Save'}
						</Button>
					</View>

					<SafeAreaView style={{ height: 60 }} />
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
