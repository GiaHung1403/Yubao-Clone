import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
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
import { getListTele, getListTele_T } from '@data/api';
import { IUserSystem } from '@models/types';
import TeleItemComponent from './TeleItemComponent';

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() - 1),
);

export function TeleScreen(props: any) {
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [fromDate, setFromDate] = useState(timeFrom);
	const [toDate, setToDate] = useState(timeNow);
	const [listTele, setListTele] = useState<any>([]);
	const [listTeleFilter, setListTeleFilter] = useState<any>([]);

	const { colors } = useTheme();
	const I18n = useContext(LocalizationContext);
	const textSearch = 'Search Customer Name';

	const isVN = I18n.locale === 'vi';

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		loadData({ first: true }).then();
	}, [fromDate, toDate, doneLoadAnimated]);

	useEffect(() => {
		(async function search() {
			if (!firstQuery) {
				setListTeleFilter(listTele);
			} else {
				await loadData({ first: false });
			}
		})();
	}, [firstQuery]);

	const loadData = async ({ first }) => {
		setLoading(true);
		const data = dataUserSystem.EMP_NO.includes('T')
			? await getListTele_T({
					User_ID: dataUserSystem.EMP_NO, //'00023',
					Password: '',
					fromDate: moment(fromDate).format('YYYY-MM-DD'),
					toDate: moment(toDate).format('YYYY-MM-DD'),
					customerName: '',
			  })
			: await getListTele({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					fromDate: moment(fromDate).format('YYYY-MM-DD'),
					toDate: moment(toDate).format('YYYY-MM-DD'),
					customerName: '',
			  });

		setLoading(false);
		if (first) {
			setListTele(data);
		}

		setListTeleFilter(data);
	};

	const onRefresh = async () => {
		await loadData({ first: true });
	};

	const _onPressItem = (item: any) => {
		navigation.navigate('TeleDetailScreen', {
			teleInfo: item,
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Telemarketing" />
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

				{doneLoadAnimated && (
					<FlatList
						keyboardShouldPersistTaps="handled"
						style={{ paddingTop: 8 }}
						data={listTeleFilter}
						keyExtractor={(_, index) => index.toString()}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={onRefresh}
							/>
						}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<TeleItemComponent
								teleInfo={item}
								index={index}
								onPress={() => _onPressItem(item)}
							/>
						)}
					/>
				)}

				<SafeAreaView
					style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
				>
					<FAB
						icon="plus"
						onPress={() =>
							navigation.navigate('TeleDetailScreen', {
								teleInfo: null,
								isCreateNewTele: true,
							})
						}
					/>
				</SafeAreaView>
			</View>
		</View>
	);
}
