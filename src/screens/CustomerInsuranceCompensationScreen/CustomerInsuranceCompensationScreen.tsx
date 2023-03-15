import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

import Header from '@components/Header';
import ItemInsuranceCompensation from '@components/ItemInsuranceCompensation';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Colors from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { getInsuranceCompensation } from '@data/api';

export function CustomerInsuranceCompensationScreen(props: any) {
	const flatListRef: any = useRef<any>(null);
	const navigation: any = useNavigation();
	const route = useRoute();
	const { APNO, title, taxCode }: any = route.params;

	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [data, setData] = useState<any>([]);
	const [listQuery, setListQuery] = useState<any>([]);

	const I18n = useContext(LocalizationContext);
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
			const listData: any = await getInsuranceCompensation({
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
			<Header title={'POA'} />
			<View style={{ flex: 1 }}>
				<Searchbar
					textAlign={'left'}
					placeholder={textSearch}
					onChangeText={query => setFirstQuery(query)}
					value={firstQuery}
					style={{
						zIndex: 2,
						marginTop: 8,
						marginHorizontal: 8,
					}}
					inputStyle={{ fontSize: 14 }}
				/>

				{doneLoadAnimated ? (
					<FlatList
						ref={flatListRef}
						style={{ flex: 1, zIndex: 1, paddingHorizontal: 8 }}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
						removeClippedSubviews
						keyExtractor={(item, index) => index.toString()}
						data={listQuery}
						extraData={data}
						ListFooterComponent={() => <SafeAreaView />}
						ListEmptyComponent={() => (
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									paddingTop: 50,
								}}
							>
								<Text>{textNoData}</Text>
							</View>
						)}
						renderItem={({ item, index }) => (
							<ItemInsuranceCompensation
								item={item}
								stylesItem={{
									marginBottom: index === listQuery?.length - 1 ? 8 : 0,
									backgroundColor: colors.primary,
								}}
								onPressItem={listAssets => null}
							/>
						)}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View>
		</View>
	);
}
