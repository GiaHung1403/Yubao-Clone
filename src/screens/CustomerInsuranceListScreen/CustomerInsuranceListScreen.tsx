import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';

import Header from '@components/Header';
import ItemInsurance from '@components/ItemInsurance';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { LocalizationContext } from '@context/LocalizationContext';
import { useSelector } from 'react-redux';
import api_get_insurance from '@data/api/api_get_insurance';

export function CustomerInsuranceListScreen(props: any) {
	const flatListRef: any = useRef<any>(null);
	const navigation: any = useNavigation();
	const route = useRoute();
	const { keyword, taxCode }: any = route.params;
	const I18n = useContext(LocalizationContext);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [listData, setListData] = useState<any>([]);

	const textContractInsurance = I18n.t('contractInsurance');
	const textInsuranceNo = I18n.t('insuranceNo');
	const textNoData = I18n.t('noData');

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setTimeout(() => {
				setDoneLoadAnimated(true);
			}, 500);
		});
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}
		(async function getListDataInsurance() {
			const response: any = await api_get_insurance({
				User_ID: taxCode.trim(),
				Password: taxCode.trim(),
			});

			const dataFilter = response.filter(
				item => item.INSR_NO.includes(keyword) || item.APNO.includes(keyword),
			);
			setListData(dataFilter);
		})();
	}, [doneLoadAnimated]);

	/* Function press Item */
	const _onPressItem = (item: any, listAssets: any) => {
		navigation.navigate('CustomerInsuranceChooseInfoScreen', {
			title: `${textInsuranceNo} ${item.INSR_NO}`,
			url: `http://ebill.chailease.com.vn/Contracts/${item.APNO}.pdf`,
			isShowButton: true,
			listAssets,
			insuranceItem: item,
			taxCode,
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={textContractInsurance} />
			</View>

			<View style={{ flex: 1, marginHorizontal: 8 }}>
				{doneLoadAnimated ? (
					<FlatList
						ref={flatListRef}
						style={{ flex: 1, zIndex: 1 }}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
						removeClippedSubviews
						keyExtractor={(item, index) => index.toString()}
						data={listData}
						extraData={listData}
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
							<ItemInsurance
								item={item}
								taxCode={taxCode}
								stylesItem={{
									marginBottom: index === listData?.length - 1 ? 8 : 0,
								}}
								onPressItem={listAssets => _onPressItem(item, listAssets)}
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
