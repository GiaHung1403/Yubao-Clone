import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

import Header from '@components/Header/Header';
import ItemInvoice from '@components/ItemInvoice';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { LocalizationContext } from '@context/LocalizationContext';
import { getInvoice } from '@data/api';

export function CustomerInvoiceScreen(props: any) {
	const route = useRoute();
	const flatListRef: any = useRef<any>(null);
	const { title, APNO, taxCode }: any = route.params;
	const navigation: any = useNavigation();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [listInvoice, setListInvoice] = useState([]);
	const [listInvoiceFilter, setListInvoiceFilter] = useState([]);

	const I18n = useContext(LocalizationContext);
	const textNoticeNo = 'Invoice No.';
	const textNoData = I18n.t('noData');

	useEffect(() => {
		(async function getData() {
			setDoneLoadAnimated(true);

			const responseInvoice: any = await getInvoice({
				User_ID: taxCode,
				Password: taxCode,
				APNO,
			});

			setListInvoice(responseInvoice);
			setListInvoiceFilter(responseInvoice);
		})();
	}, []);

	useEffect(() => {
		if (firstQuery.length > 0) {
			setListInvoiceFilter(listInvoice);
		} else {
			const dataFilter = listInvoice.filter((item: any) =>
				item.INV_NO.toLowerCase().includes(firstQuery.toLowerCase()),
			);
			setListInvoiceFilter(dataFilter);
		}
	}, [firstQuery]);

	const _onPressItemNotice = (item: any) => {
		navigation.navigate('WebviewScreen', {
			title: `${textNoticeNo} ${item.INV_NO}`,
			url: item.FILE_URL,
			isShowButton: true,
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={title} />
			<View style={{ flex: 1, marginHorizontal: 8 }}>
				<Searchbar
					textAlign={'left'}
					placeholder={'Search Invoice No.'}
					onChangeText={query => setFirstQuery(query)}
					value={firstQuery}
					style={{ zIndex: 2, marginTop: 8 }}
					inputStyle={{ fontSize: 13 }}
				/>

				{doneLoadAnimated ? (
					<FlatList
						ref={flatListRef}
						style={{ flex: 1, zIndex: 1 }}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
						removeClippedSubviews
						keyExtractor={(item, index) => index.toString()}
						data={listInvoiceFilter}
						extraData={listInvoiceFilter}
						ListFooterComponent={() => <SafeAreaView />}
						ListEmptyComponent={() => (
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									marginVertical: 20,
								}}
							>
								<Text style={{ color: '#3e3e3e', fontWeight: '600' }}>
									{textNoData}
								</Text>
							</View>
						)}
						renderItem={({ item, index }) => (
							<ItemInvoice
								onPressItem={() => _onPressItemNotice(item)}
								stylesItem={{
									marginBottom: index === listInvoiceFilter?.length - 1 ? 8 : 0,
								}}
								item={item}
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
