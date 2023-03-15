import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import ItemNotice from '@components/ItemNotice';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { LocalizationContext } from '@context/LocalizationContext';
import { getPaymentNotice } from '@data/api';
import { IPaymentNotice } from '@models/types';

export default function CustomerPaymentNoticeScreen(props: any) {
	const route = useRoute();
	const flatListRef: any = useRef<any>(null);
	const { title, taxCode }: any = props;
	const navigation: any = useNavigation();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [listNotice, setListNotice] = useState<IPaymentNotice[]>([]);
	const [listNoticeFilter, setListNoticeFilter] = useState<IPaymentNotice[]>([]);

	const I18n = useContext(LocalizationContext);
	const textNoticeNo = 'Notice No.';
	const textNoData = I18n.t('noData');

	useEffect(() => {
		(async function getData() {
			const responseNotice: any = await getPaymentNotice({
				User_ID: taxCode,
				Password: taxCode,
			});

			setListNotice(responseNotice);
			setListNoticeFilter(responseNotice);
			setDoneLoadAnimated(true);
		})();
	}, []);

	useEffect(() => {
		if (firstQuery.length > 0) {
			setListNoticeFilter(listNotice);
		} else {
			const dataFilter = listNotice.filter((item ) =>
				item.note_no.toLowerCase().includes(firstQuery.toLowerCase()),
			);
		}
	}, [firstQuery]);

	const _onPressItemNotice = (item  ) => {
		navigation.navigate('WebviewScreen', {
			title: `${textNoticeNo} ${item.note_no}`,
			url: item.file_url,
			isShowButton: true,
			isPDF: true,
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, marginHorizontal: 8 }}>
				<Searchbar
					textAlign={'left'}
					placeholder={'Search Notice No.'}
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
						data={listNoticeFilter}
						extraData={listNoticeFilter}
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
							<ItemNotice
								onPressItem={() => _onPressItemNotice(item)}
								stylesItem={{
									marginBottom: index === listNoticeFilter?.length - 1 ? 8 : 0,
								}}
								item={item}
								taxCode={taxCode}
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
