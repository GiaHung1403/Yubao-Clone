import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import Header from '@components/Header';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { removeVietnameseTones } from '@utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Image,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface ICardInfor {
	ID: string;
	Name: string;
	Birth_Day: Date;
	Sex: string;
	Nation: string;
	Country: string;
	Address: string;
	End_DateCreate: Date;
	Start_DateCreate: Date;
}

export function IDCardResultScreen(props) {
	const navigation: any = useNavigation();
	const { result, image, isFront }: any = props.route.params;
	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [imageFrontUpdate, setImageFrontUpdate] = useState(undefined);
	const [imageBackUpdate, setImageBackUpdate] = useState(undefined);

	const [dataCardID, setDataCardID] = useState<ICardInfor>({
		ID: '',
		Name: '',
		Birth_Day: new Date(),
		Sex: '',
		Nation: '',
		Country: '',
		Address: '',
		End_DateCreate: new Date(),
		Start_DateCreate: new Date(),
	});

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		const textRemoveTones = removeVietnameseTones(result);

		const listTextFrontSplit: string[] = textRemoveTones.split(/[\n|]/);

		if (
			textRemoveTones.toUpperCase().includes('CAN CUOC CONG DAN') ||
			textRemoveTones.toLowerCase().includes('dac diem nhan dang')
		) {
			handleResultCCCD_Old(listTextFrontSplit);
		} else if (
			textRemoveTones.toUpperCase().includes('GIAY CHUNG MINH NHAN DAN')
		) {
			handleResultCCCD_Old(listTextFrontSplit);
		} else if (
			textRemoveTones.toUpperCase().includes('GIAY CHUNG MINH NHAN DAN')
		)
			handleResultCMND(listTextFrontSplit);
	}, [result]);

	const handleResultCCCD_New = (listResult: string[]) => { };

	const handleResultCCCD_Old = (listResult: string[]) => {
		if (isFront) {
			let id = '';
			let name = '';
			let birth_Day = '';
			let sex = '';
			let nation = '';
			let country = '';
			let address = '';
			let end_DateCreate = '';
			const regexName = /[\[\]\!\(a-z)@#%&,.+={}'/""<>:]/g;

			try {
				for (const [index, text] of listResult.entries()) {
					if (listResult[index].toLowerCase().includes('so')) {
						id = listResult[index].split(':')[1];
					} else if (!regexName.test(listResult[index])) {
						name = listResult[index];
					} else if (listResult[index].includes('Gioi tinh')) {
						sex = listResult[index].split(':')[1].trim();
					} else if (listResult[index].includes('Ngay, thang, nam sinh')) {
						birth_Day = listResult[index].split(':')[1].trim();
					} else if (listResult[index].includes('Que quan')) {
						country = listResult[index]?.split(':')[1].trim();
					} else if (listResult[index].includes('Quoc tich')) {
						nation = listResult[index].split(':')[1].trim();
					} else if (listResult[index].includes('Co gia tri den')) {
						end_DateCreate = listResult[index].split(':')[1].trim();
					} else if (listResult[index].includes('Noi thuong tru')) {
						const temp = listResult[index].split(':');
						address = temp[1];
					} else if (listResult[index].includes(',')) {
						address += listResult[index];
					}
				}
				setDataCardID({
					ID: id,
					Name: name,
					Birth_Day: convertDate(birth_Day),
					Sex: sex,
					Nation: nation,
					Country: country,
					Address: address,
					End_DateCreate: convertDate(end_DateCreate),
					Start_DateCreate: new Date(),
				});
			} catch (error) {
				Alert.alert('Alert', 'ain :vvv', [
					{
						text: 'Ok',
						onPress: navigation.goBack(),
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
						onPress: navigation.goBack(),
					},
				]);
			}
		}
	};

	const handleResultCMND = (listResult: string[]) => {
		for (const [index, text] of listResult.entries()) {
		}
	};

	const convertDate = date => {
		const temp = date.split('/');
		return new Date(temp[2], temp[1] - 1, temp[0]);
	};

	const _onPressSave = async () => {
		navigation.navigate('IDCardFormScreen', {
			result: dataCardID,
			image,
			isFront,
		});
	};

	return (
		<View style={{ flex: 1,height:150 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Scan Card ID'} />
			</View>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'android' ? undefined : 'padding'}
				style={{ flex: 1 }}
			>
				<ScrollView style={{ flex: 1 }}>
					<View style={{ padding: 8 }}>
						{isFront ? (
							<Card style={{ padding: 8, marginBottom: 10 }}>
								<View
									style={{ flexDirection: 'row', marginBottom: 8, flex: 1 }}
								>
									<TextInputCustomComponent
										label="Card ID"
										value={dataCardID.ID}
										style={{ flex: 1 }}
										onChangeText={text =>
											setDataCardID({ ...dataCardID, ID: text })
										}
									/>
								</View>
								<View style={{ flexDirection: 'row', marginBottom: 8 }}>
									<TextInputCustomComponent
										label="Name"
										value={dataCardID.Name}
										style={{ flex: 1, marginRight: 8 }}
										onChangeText={text =>
											setDataCardID({ ...dataCardID, Name: text })
										}
									/>
									<ButtonChooseDateTime
										label={'Birth Day'}
										modalMode="date"
										valueDisplay={moment(dataCardID.Birth_Day).format(
											'DD/MM/YYYY',
										)}
										value={dataCardID.Birth_Day}
										minuteInterval={30}
										onHandleConfirmDate={date =>
											setDataCardID({ ...dataCardID, Birth_Day: date })
										}
										containerStyle={{ flex: 1 }}
									/>
								</View>

								<View style={{ flexDirection: 'row', marginBottom: 8 }}>
									<TextInputCustomComponent
										label="Place of origin"
										value={dataCardID.Country}
										style={{ flex: 1, marginRight: 8 }}
										onChangeText={text =>
											setDataCardID({ ...dataCardID, Country: text })
										}
									/>
									<TextInputCustomComponent
										label="Sex"
										value={dataCardID.Sex}
										style={{ flex: 1 }}
										onChangeText={text =>
											setDataCardID({ ...dataCardID, Sex: text })
										}
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
										valueDisplay={moment(dataCardID.End_DateCreate).format(
											'DD/MM/YYYY',
										)}
										value={dataCardID.End_DateCreate}
										minuteInterval={30}
										onHandleConfirmDate={date =>
											setDataCardID({ ...dataCardID, End_DateCreate: date })
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
								/>
								{/* <TextInputCustomComponent
								label="Total Amount"
								value={totalAmount}
								style={{ marginBottom: 8 }}
								onChangeText={setTotalAmount}
							/> */}
							</Card>
						) : (
							<Card style={{ padding: 8, marginBottom: 10 }}>
								<TextInputCustomComponent
									label="Noi Cap"
									value={
										'CUC TRUONG CUC CANH SAT QUAN LY HANH CHINH VE TRAT TU XA HOI'
									}
									style={{ marginBottom: 8 }}
								// onChangeText={text =>
								// 	setDataCardID({ ...dataCardID, Name: text })
								// }
								/>
								{/* <View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInputCustomComponent
									label="Payment Method"
									value={'Card'}
									style={{ flex: 1 }}
									onChangeText={text => null}
								/>
							</View> */}
								<ButtonChooseDateTime
									label={'Using Date'}
									modalMode="date"
									valueDisplay={moment(dataCardID.Start_DateCreate).format(
										'DD/MM/YYYY',
									)}
									value={dataCardID.Start_DateCreate}
									minuteInterval={30}
									onHandleConfirmDate={date =>
										setDataCardID({ ...dataCardID, Start_DateCreate: date })
									}
									containerStyle={{ flex: 1 }}
								/>
							</Card>
						)}

						{/* <View
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
						</View> */}

						{/* {isCheckedShowLog && result ? (
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
						) : null} */}

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
