import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	RefreshControl,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Card, Searchbar, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { LocalizationContext } from '@context/LocalizationContext';
import { getPaymentNoticeForCollection } from '@data/api';
import { ICustomer, IUserSystem } from '@models/types';
import Header from '@components/Header';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import moment from 'moment';
import { formatVND } from '@utils/formatMoney';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

interface IPropsRoute {
	customerSelected: ICustomer;
}

export function PaymentNoticeScreen(props: any) {
	const route = useRoute();
	const flatListRef: any = useRef<any>(null);
	const navigation: any = useNavigation();
	const { customerSelected }: IPropsRoute = props.route.params;

	const { colors } = useTheme();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [listNotice, setListNotice] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const I18n = useContext(LocalizationContext);
	const textNoticeNo = 'Notice No.';

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (doneLoadAnimated) {
			(async function getData() {
				setDoneLoadAnimated(true);
				_getDataPaymentNotice();
			})();
		}
	}, [firstQuery, customerSelected, doneLoadAnimated]);

	const _onPressItemNotice = (item: any) => {
		navigation.navigate('WebviewScreen', {
			title: `${textNoticeNo} ${item.note_No}`,
			url: item.file_Url,
			isShowButton: true,
			isPDF: true,
		});
	};

	const _getDataPaymentNotice = async () => {
		setLoading(true);
		const responseNotice: any = await getPaymentNoticeForCollection({
			userID: dataUserSystem.EMP_NO,
			taxCode: customerSelected?.tax_code || '',
			noticeNo: firstQuery,
		});

		setListNotice(responseNotice);
		setLoading(false);
	};

	const _onSearchNotice = (query: string) => {
		setFirstQuery(query);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 1 }}>
				<Header title="Payment Notice" />
			</View>
			<View style={{ flex: 1 }}>
				{/* Heder Search and Filter Customer */}
				<View style={{ flexDirection: 'row', zIndex: 2, marginTop: 12 }}>
					<Card style={{ marginHorizontal: 8, flex: 1 }} elevation={2}>
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								paddingHorizontal: 8,
								paddingVertical: 12,
								alignItems: 'center',
							}}
							onPress={() =>
								navigation.navigate('ChooseCustomerModal', {
									idCustomerExisted: customerSelected?.lese_ID,
									screenBack: 'PaymentNoticeScreen',
								})
							}
						>
							<Text style={{ flex: 1, color: '#666' }} numberOfLines={1}>
								{customerSelected ? customerSelected.ls_nm : 'Choose customer'}
							</Text>
							<Icon
								as={Ionicons}
								name="chevron-down-outline"
								size={7}
								color={'#666'}
							/>
						</TouchableOpacity>
					</Card>

					<Searchbar
						placeholder={'Notice No.'}
						onChangeText={_onSearchNotice}
						value={firstQuery}
						style={{ marginRight: 8, flex: 1, elevation: 2 }}
						inputStyle={{ fontSize: 13 }}
					/>
				</View>

				{/* List Payment Notice */}
				{doneLoadAnimated ? (
					<FlatList
						ref={flatListRef}
						style={{ zIndex: 1, marginTop: 12 }}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
						removeClippedSubviews
						keyExtractor={(_, index) => index.toString()}
						data={listNotice.filter(
							item => (item.u_Amt && item.u_Amt !== 0) || item.special_yn,
						)}
						extraData={listNotice}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={_getDataPaymentNotice}
							/>
						}
						ListFooterComponent={() => <View style={{ height: 60 }} />}
						renderItem={({ item }) => (
							<Card
								elevation={1}
								style={{
									marginBottom: 8,
									marginHorizontal: 8,
									padding: 8,
								}}
								onPress={() => _onPressItemNotice(item)}
							>
								<Text
									style={{
										marginBottom: 8,
										color: Color.approved,
										fontWeight: '600',
									}}
								>
									{item.ls_Nm}
								</Text>

								<View style={{ marginBottom: 8, flexDirection: 'row' }}>
									<TextInfoRow
										icon={'barcode-outline'}
										value={`${item.note_No}`}
										styleValue={{}}
										containerStyle={{
											flex: 1,
										}}
									/>

									<TextInfoRow
										icon={'timer-outline'}
										isIconRight
										value={moment(item.print_Date).format('DD/MM/YYYY')}
										styleValue={{}}
										containerStyle={{
											flex: 1,
										}}
									/>
								</View>

								<View
									style={{
										flexDirection: 'row',
										backgroundColor: `${Color.main}30`,
										padding: 8,
										borderRadius: 4,
									}}
								>
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
											Total Payable ({item.cur_c})
										</Text>
										<Text
											style={{
												fontWeight: '600',
												color: 'orange',
											}}
										>
											{formatVND(item.ttL_PAY)} đ
										</Text>
									</View>
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
											Receipt
										</Text>
										<Text
											style={{
												fontWeight: '600',
												color: Color.approved,
											}}
										>
											{!item.special_yn
												? formatVND(item.ttL_PAY - (item?.u_Amt || 0))
												: 'Case special'}
										</Text>
									</View>
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
											Remaining
										</Text>
										<Text
											style={{
												fontWeight: '600',
												color: Color.background,
											}}
										>
											{!item.special_yn ? formatVND(item?.u_Amt) : 'View file'}
										</Text>
									</View>
								</View>

								{/* <TextInfoRow
									icon={'cash-outline'}
									label={`Total Payable: `}
									styleLabel={{ flex: 0 }}
									value={`${formatVND(123425436)} VNĐ`}
									styleValue={{ color: 'orange', fontWeight: '600' }}
									containerStyle={{
										flex: 2,
										marginBottom: 8,
									}}
								/>
								<TextInfoRow
									icon={'cash-outline'}
									label={`Receipt Amount: `}
									styleLabel={{ flex: 0 }}
									value={`${formatVND(123425436)} VNĐ`}
									styleValue={{ color: Color.approved, fontWeight: '600' }}
									containerStyle={{
										flex: 2,
										marginBottom: 8,
									}}
								/>
								<TextInfoRow
									icon={'cash-outline'}
									label={`Remaining Amount: `}
									styleLabel={{ flex: 0 }}
									value={`${formatVND(123425436)} VNĐ`}
									styleValue={{ color: Color.background, fontWeight: '600' }}
									containerStyle={{
										flex: 2,
										marginBottom: 8,
									}}
								/> */}
							</Card>
						)}
					/>
				) : null}
			</View>
		</View>
	);
}
