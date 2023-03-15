import React, { useContext, useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	Image,
	InteractionManager,
	Linking,
	Platform,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import EventEmitter from '@utils/events';
import { useNavigation, StackActions } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import { Card, FAB, Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme, Searchbar } from 'react-native-paper';
import LoadingFullScreen from '@components/LoadingFullScreen';
import NoDataComponent from '@components/NoDataComponent';
import Colors from '@config/Color';
import { getContactPerson, getCIC, getHistoryCIC } from '@data/api';

import { IContactPerson, IUserSystem } from '@models/types';
import CIC_Item_History_Component from '../CIC_Item_History_Component';
import { LocalizationContext } from '@context/LocalizationContext';
import { EventEmitterEnum } from '@models/EventEmitterEnum';
import TextInputCustomComponent from '@components/TextInputCustomComponent/TextInputCustomComponent';
import Color from '@config/Color';

const IC_EMAIL = require('@assets/icons/ic_email.png');
const IC_PHONE = require('@assets/icons/ic_phone.png');

export default function CIC_CheckingComponent(props: any) {
	const { leseID, hasContact, customerName } = props;
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();
	const I18n = useContext(LocalizationContext);
	const textSearchHistory = I18n.t('search_history');
	const [firstQuery, setFirstQuery] = useState('');
	const [list_HistoryCIC, getList_HistoryCIC] = useState<any>([]);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [loading, setLoading] = useState(false);
	// const [listContactPerson, setListContactPerson] = useState<IContactPerson[]>(
	// 	[],
	// );

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			if (hasContact) {
				const responseContactPerson: any = await getContactPerson({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					LeseID: leseID,
				});
				// setListContactPerson(responseContactPerson);
			}
			(async function getData() {
				const data: any = await getHistoryCIC({
					flag: 'GET_CIC_BY_LESE_ID',
					lese_Id: leseID, //'210098', // leseID,
				});
				getList_HistoryCIC(data);
				setDoneLoadAnimated(true);
			})();
		});
	}, []);

	useEffect(() => {
		const willFocusSubscription = navigation.addListener('focus', () => {
			(async function getData() {
				const data: any = await getHistoryCIC({
					flag: 'GET_CIC_BY_LESE_ID',
					lese_Id: leseID, //'210098', // leseID,
				});
				getList_HistoryCIC(data);
			})();
		});

		return () => willFocusSubscription;
	}, [navigation]);

	const _onPressPhoneIcon = (numberPhone: string) => {
		let phoneNumber = '';

		if (Platform.OS === 'android') {
			phoneNumber = `tel:${numberPhone}`;
		} else {
			phoneNumber = `telprompt:${numberPhone}`;
		}

		Linking.canOpenURL(phoneNumber)
			.then(supported => {
				if (supported) {
					return Linking.openURL(phoneNumber)
						.then(data => null)
						.catch(err => {
							throw err;
						});
				}
			})
			.catch(err => Alert.alert('Thông báo', err.message));
	};

	const _onPressEmailIcon = (email: string) => {
		Linking.openURL(`mailto:${email}`);
	};

	const onRefresh = async () => {
		setLoading(true);
		(async function getData() {
			const data: any = await getHistoryCIC({
				flag: 'GET_CIC_BY_LESE_ID',
				lese_Id: leseID, //'210098', // leseID,
			});
			getList_HistoryCIC(data);
			setLoading(false);
		})();
	};

	return doneLoadAnimated ? (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			{/* CIC Request */}
			<Searchbar
				placeholder={textSearchHistory}
				onChangeText={query => setFirstQuery(query)}
				value={firstQuery}
				style={{
					zIndex: 2,
					marginTop: 8,
					marginHorizontal: 8,
					marginBottom: 10,
				}}
				inputStyle={{ fontSize: 14 }}
			/>
			<FlatList
				data={list_HistoryCIC}
				keyExtractor={(_, index) => index.toString()}
				contentContainerStyle={{ flexGrow: 1 }}
				refreshControl={
					<RefreshControl
						tintColor={colors.primary}
						colors={[colors.primary, Color.waiting, Color.approved]}
						refreshing={loading}
						onRefresh={onRefresh}
					/>
				}
				ListHeaderComponent={() => (
					<View style={{ padding: 8, flexDirection: 'row' }}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Text style={{ color: 'red', fontSize: 12 }}>
								Chailease employees are allowed to use the CIC information of
								customers for the activities of Chailease only.
								{'\n'}Any violations shall be fined from VND 30 to 40 million
								according to the law.
							</Text>
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<NoDataComponent type={hasContact ? 'Denied' : 'Empty'} />
				)}
				renderItem={({ item, index }) => (
					<CIC_Item_History_Component
						dataItem={item}
						onPressItem={() => {
							null;
						}}
					/>
				)}
			/>
			<FABComponent
				getDetail={null}
				userInfo={dataUserSystem}
				leseID={leseID}
				customerName={customerName}
			/>
			{/* <ModalCIC_Checking /> */}
		</View>
	) : (
		<LoadingFullScreen size={'large'} />
	);
}

const FABComponent = ({ getDetail, userInfo, leseID, customerName }) => {
	const navigation: any = useNavigation();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const onStateChange = ({ open }) => setIsOpen(open);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	return (
		<FAB.Group
			visible={true}
			open={isOpen}
			icon={isOpen ? 'close' : 'menu'}
			actions={[
				{
					icon: 'plus',
					label: 'New Check',
					onPress: () => {
						navigation.navigate('CICRequestDetailScreen', {
							cicRequest: null,
							leseID,
							customerName,
						});
					},
				},
				{
					icon: 'clipboard-check-outline',
					label: 'Check disburse(CT)',
					onPress: () => {
						navigation.navigate('CIC_CheckingScreen', {
							title: true,
							leseID,
						});
					},
				},
				{
					icon: 'clipboard-check-multiple-outline',
					label: 'Check other(CT+TSBĐ)',
					onPress: () => {
						navigation.navigate('CIC_CheckingScreen', {
							title: false,
							leseID,
						});
					},
				},
			]}
			onStateChange={onStateChange}
		/>
	);
};
