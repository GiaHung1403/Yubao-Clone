import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	RefreshControl,
	SafeAreaView,
	View,
} from 'react-native';
import { Card, FAB, Searchbar, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import Header from '@components/Header';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { getListVisit, getListVisit_Trading } from '@data/api';
import { IUserSystem, IVisit } from '@models/types';
import VisitItemComponent from './VisitItemComponent';

const timeNow = new Date();
const timeTo = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() + 7),
);
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() - 7),
);

export function VisitScreen(props: any) {
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [loading, setLoading] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [listVisit, setListVisit] = useState<IVisit[]>([]);
	const [fromDate, setFromDate] = useState(timeFrom);
	const [toDate, setToDate] = useState(timeTo);
	const [listVisitFilter, setListVisitFilter] = useState<any>([]);

	const I18n = useContext(LocalizationContext);
	const textSearch = 'Search';

	const { colors } = useTheme();
	const isVN = I18n.locale === 'vi';

	useEffect(() => {
		onRefresh();
	}, []);

	useEffect(() => {
		const willFocusSubscription = navigation.addListener('focus', () => {
			onRefresh();
		});

		return () => willFocusSubscription;
	}, [fromDate, toDate]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setLoading(true);
			// const credentials: any = await Keychain.getGenericPassword();
			// const { username, password } = credentials;

			const data = dataUserSystem.EMP_NO.includes('T')
				? ((await getListVisit_Trading({
						User_ID: dataUserSystem.EMP_NO,
						fromDate: moment(fromDate).format('DDMMYYYY'),
						toDate: moment(toDate).format('DDMMYYYY'),
						CustomerName: '',
				  })) as IVisit[])
				: ((await getListVisit({
						User_ID: dataUserSystem.EMP_NO,
						Password: '',
						fromDate: moment(fromDate).format('DDMMYYYY'),
						toDate: moment(toDate).format('DDMMYYYY'),
						CustomerName: '',
				  })) as IVisit[]);

			setListVisit(data);
			setListVisitFilter(data);
			setLoading(false);
		});
	}, [fromDate, toDate]);

	useEffect(() => {
		(async function search() {
			if (!firstQuery) {
				setListVisitFilter(listVisit);
			} else {
				setLoading(true);
				const data = await getListVisit({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					fromDate: moment(fromDate).format('DDMMYYYY'),
					toDate: moment(toDate).format('DDMMYYYY'),
					CustomerName: firstQuery,
				});
				setLoading(false);
				setListVisitFilter(data);
			}
		})();
	}, [firstQuery]);

	const _onPressItem = (item: any) => {
		dataUserSystem.EMP_NO.includes('T')
			? navigation.navigate('VisitDetailScreen_T', {
					visitInfo: item,
			  })
			: navigation.navigate('VisitDetailScreen', {
					visitInfo: item,
			  });
	};

	const onRefresh = async () => {
		setLoading(true);
		const data = dataUserSystem.EMP_NO.includes('T')
			? ((await getListVisit_Trading({
					User_ID: dataUserSystem.EMP_NO,
					fromDate: moment(fromDate).format('DDMMYYYY'),
					toDate: moment(toDate).format('DDMMYYYY'),
					CustomerName: '',
			  })) as IVisit[])
			: ((await getListVisit({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					fromDate: moment(fromDate).format('DDMMYYYY'),
					toDate: moment(toDate).format('DDMMYYYY'),
					CustomerName: '',
			  })) as IVisit[]);

		setListVisit(data);
		setListVisitFilter(data);
		setLoading(false);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Visiting" />
			</View>

			<View style={{ flex: 1 }}>
				<Card elevation={4} style={{ margin: 8 }}>
					<View style={{ flexDirection: 'row', padding: 8 }}>
						<ButtonChooseDateTime
							label={'From date'}
							modalMode={'date'}
							valueDisplay={moment(fromDate).format('DD/MM/YYYY')}
							value={fromDate}
							onHandleConfirmDate={setFromDate}
							containerStyle={{ flex: 1, marginRight: 8 }}
						/>

						<ButtonChooseDateTime
							label={'To date'}
							modalMode={'date'}
							valueDisplay={moment(toDate).format('DD/MM/YYYY')}
							value={toDate}
							onHandleConfirmDate={setToDate}
							containerStyle={{ flex: 1 }}
						/>
					</View>
				</Card>

				<Searchbar
					textAlign={'left'}
					placeholder={textSearch}
					onChangeText={query => setFirstQuery(query)}
					value={firstQuery}
					style={{ zIndex: 2, marginHorizontal: 8 }}
					inputStyle={{ fontSize: 14 }}
				/>

				<FlatList
					keyboardShouldPersistTaps="handled"
					style={{ paddingTop: 16 }}
					data={listVisitFilter}
					showsVerticalScrollIndicator={false}
					keyExtractor={(_, index) => index.toString()}
					ListFooterComponent={() => <SafeAreaView style={{ height: 80 }} />}
					refreshControl={
						<RefreshControl
							tintColor={colors.primary}
							colors={[colors.primary, Color.waiting, Color.approved]}
							refreshing={loading}
							onRefresh={onRefresh}
						/>
					}
					renderItem={({ item, index }) => (
						<VisitItemComponent
							visitInfo={item}
							index={index}
							onPress={() => _onPressItem(item)}
						/>
					)}
				/>

				<SafeAreaView
					style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
				>
					<FAB icon="plus" onPress={() => _onPressItem(null)} />
				</SafeAreaView>
			</View>
		</View>
	);
}
