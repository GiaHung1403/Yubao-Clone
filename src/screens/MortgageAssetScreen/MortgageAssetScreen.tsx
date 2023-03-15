import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	FlatList,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Card, Searchbar } from 'react-native-paper';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { LocalizationContext } from '@context/LocalizationContext';
import { getMortgageAssets } from '@data/api';

export function MortgageAssetScreen(props: any) {
	const flatListRef: any = useRef<any>(null);
	const navigation: any = useNavigation();
	const route = useRoute();
	const { APNO, title, taxCode }: any = route.params;

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [data, setData] = useState<any>([]);
	const [listQuery, setListQuery] = useState<any>([]);

	const I18n = useContext(LocalizationContext);
	const textTotalAmount = I18n.t('totalAmount');
	const textQuality = I18n.t('quality');
	const textSearch = I18n.t('search');
	const textNoData = I18n.t('noData');

	useEffect(() => {
		setTimeout(() => {
			setDoneLoadAnimated(true);
		}, 500);
	}, []);

	useEffect(() => {
		(async function getData() {
			if (!doneLoadAnimated) {
				return;
			}
			const listData: any = await getMortgageAssets({
				User_ID: taxCode.trim(),
				Password: taxCode.trim(),
				APNO,
			});

			setData(listData);
		})();
	}, [doneLoadAnimated]);

	useEffect(() => {
		if (listQuery?.length === 0) {
			setListQuery(data);
		}
	}, [data]);

	useEffect(() => {
		if (firstQuery.length > 0) {
			const dataFilter = data.filter(item =>
				item.ASTS_NAME.includes(firstQuery),
			);
			setListQuery(dataFilter);
		} else {
			setListQuery(data);
		}
	}, [firstQuery, data]);

	return (
		<View style={{ flex: 1 }}>
			<Header title={title} />
			<View style={{ flex: 1 }}>
				<Searchbar
					textAlign={'left'}
					placeholder={textSearch}
					onChangeText={query => setFirstQuery(query)}
					value={firstQuery}
					style={{ zIndex: 2, marginTop: 8, marginHorizontal: 8 }}
					inputStyle={{ fontSize: 14 }}
				/>

				{doneLoadAnimated ? (
					<FlatList
						ref={flatListRef}
						style={{ flex: 1, zIndex: 1 }}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
						removeClippedSubviews
						keyExtractor={(item, index) => index.toString()}
						data={listQuery}
						extraData={data}
						ListEmptyComponent={() => (
							<View
								style={{
									paddingTop: 50,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Text>{textNoData}</Text>
							</View>
						)}
						ListFooterComponent={() => <SafeAreaView />}
						renderItem={({ item, index }) => (
							<Card
								key={index.toString()}
								style={{ borderRadius: 8, marginTop: 8, marginHorizontal: 8 }}
								elevation={2}
							>
								<TouchableOpacity
									style={{
										borderRadius: 8,
										padding: 8,
									}}
								>
									<Text
										style={{ fontWeight: '600' }}
									>{`${item.ASTS_NAME}`}</Text>
									<Text style={{ marginVertical: 4 }}>{`${'Kind'}: ${
										item.KIND
									}`}</Text>
									<Text
										style={{ marginBottom: 4 }}
									>{`${textQuality}: ${item.QTY}`}</Text>
									<Text>{`${textTotalAmount}: ${item.AMT} ${item.CUR}`}</Text>
								</TouchableOpacity>
							</Card>
						)}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View>
		</View>
	);
}
