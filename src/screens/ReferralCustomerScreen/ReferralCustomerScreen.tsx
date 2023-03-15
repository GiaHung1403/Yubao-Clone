import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { getReferralCustomer } from '@data/api';
import { IReferralCustomer, IUserSystem } from '@models/types';
import { useNavigation } from '@react-navigation/native';
import {
	referralCustomersAtom,
	searchKeyRefCustomerAtom,
} from 'atoms/referral-customer.atom';
import { useAtom } from 'jotai';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Animated,
	FlatList,
	InteractionManager,
	RefreshControl,
	SafeAreaView,
	Text,
	TextStyle,
	View,
} from 'react-native';
import { Button, Card, FAB, Searchbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

function HightLightTextComponent({
	label,
	value,
	colorValue,
	valueStyle,
}: {
	label: string;
	value: string;
	colorValue?: string;
	valueStyle?: TextStyle;
}) {
	return (
		<View
			style={{
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
				style={[
					{
						fontWeight: '600',
						color: colorValue,
					},
					valueStyle,
				]}
			>
				{value}
			</Text>
		</View>
	);
}

const BlinkingText = ({ text, color1, color2, style }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: false,
				}),
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: false,
				}),
			]),
		).start();
	}, [fadeAnim]);

	const color = fadeAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [color1, color2],
	});

	return <Animated.Text style={[style, { color }]}>{text}</Animated.Text>;
};

function ReferralCustomerScreen(props: any) {
	const navigation: any = useNavigation();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [referralCustomers, setReferralCustomers] = useAtom(
		referralCustomersAtom,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchKey, setSearchKey] = useAtom<string>(searchKeyRefCustomerAtom);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		setLoading(true);
		const timeOutSearch = setTimeout(async () => {
			const response = (await getReferralCustomer({
				userId: dataUserSystem.EMP_NO,
				searchKey,
				fromDate: searchKey
					? moment().subtract('10', 'years').format('DDMMYYYY')
					: moment().subtract('1', 'months').format('DDMMYYYY'),
				toDate: moment().format('DDMMYYYY'),
			})) as IReferralCustomer[];
			setReferralCustomers(response);
			setLoading(false);
		}, 300);
		return () => clearTimeout(timeOutSearch);
	}, [doneLoadAnimated, searchKey]);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Referral Customer'} />
			</View>

			<Searchbar
				placeholder={'Search by Name/TaxCode'}
				onChangeText={setSearchKey}
				value={searchKey}
				style={{ elevation: 2, margin: 8 }}
				inputStyle={{ fontSize: 13 }}
			/>

			<View style={{ flex: 1 }}>
				{doneLoadAnimated ? (
					<FlatList
						data={referralCustomers}
						keyExtractor={(_, index) => index.toString()}
						contentContainerStyle={{ marginHorizontal: 8 }}
						refreshControl={
							<RefreshControl
								tintColor={Color.main}
								colors={[Color.main, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={() => null}
							/>
						}
						ListFooterComponent={() => <View style={{ height: 60 }} />}
						ListHeaderComponent={() => (
							<View style={{ margin: 8, flexDirection: 'row' }}>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginRight: 12,
									}}
								>
									<View
										style={{
											width: 10,
											height: 10,
											borderRadius: 6,
											backgroundColor: Color.approved,
											marginRight: 4,
										}}
									/>
									<Text>New Customer</Text>
								</View>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<View
										style={{
											width: 10,
											height: 10,
											borderRadius: 6,
											backgroundColor: Color.status,
											marginRight: 4,
										}}
									/>
									<Text>Old Customer</Text>
								</View>
							</View>
						)}
						renderItem={({ item, index }) => (
							<Card
								elevation={1}
								style={{ padding: 8, marginBottom: 8 }}
								onPress={() =>
									navigation.navigate('ReferralCustomerDetailScreen', {
										referralCustomer: item,
									})
								}
							>
								<View style={{ flexDirection: 'row' }}>
									<TextInfoRow
										icon={'briefcase-outline'}
										value={item.lS_NM}
										containerStyle={{
											flex: 1,
										}}
										styleValue={{
											flex: 1,
											color: Color.main,
											fontWeight: '600',
										}}
									/>
									<View
										style={{
											width: 10,
											height: 10,
											borderRadius: 6,
											backgroundColor:
												item.lS_TP === '1' ? Color.approved : Color.status,
											marginLeft: 4,
										}}
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 8 }}>
									<TextInfoRow
										icon={'barcode-outline'}
										value={item.lesE_ID || 'Not available'}
										styleValue={item.lesE_ID ? {} : {}}
										containerStyle={{
											flex: 1,
										}}
									/>
									<TextInfoRow
										icon={'time-outline'}
										isIconRight
										value={item.datE_CREATE.replace(/\./g, '/')}
										containerStyle={{
											flex: 1,
										}}
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 8 }}>
									<TextInfoRow
										icon={'receipt-outline'}
										value={item?.cnid || 'Not available'}
										styleValue={{}}
										containerStyle={{
											flex: 1,
										}}
									/>
									<TextInfoRow
										icon={'call-outline'}
										isIconRight
										value={item.tno}
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
										marginTop: 8,
									}}
								>
									<HightLightTextComponent
										label="Dealer"
										value={item.selleR_NM}
										colorValue={Color.background}
									/>

									<HightLightTextComponent
										label="Salesman"
										value={item.salemaN_NM}
										colorValue={'orange'}
									/>
								</View>

								<View
									style={{
										flexDirection: 'row',
										backgroundColor: `${Color.backgroundAlpha}50`,
										padding: 8,
										borderRadius: 4,
										marginTop: 8,
									}}
								>
									<HightLightTextComponent
										label="PIC"
										value={item.mo}
										colorValue={Color.main}
									/>

									<HightLightTextComponent
										label="Team"
										value={item.team?.trim() || ''}
										colorValue={Color.approved}
										valueStyle={{ textAlign: 'center' }}
									/>
								</View>

								{item.lesE_ID ? null : (
									<Button
										mode="contained"
										uppercase={false}
										style={{ alignSelf: 'flex-end', marginTop: 8 }}
										onPress={() => navigation.navigate('CustomerNewScreen', {
											leseName: item.lS_NM,
											telephone: item.tno,
											taxCodeRef: item.taX_CODE,
											customerSource: "06"
										})}
									>
										Create
									</Button>
								)}
							</Card>
						)}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View>

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() =>
						navigation.navigate('ReferralCustomerDetailScreen', {})
					}
				/>
			</SafeAreaView>
		</View>
	);
}

export { ReferralCustomerScreen };
