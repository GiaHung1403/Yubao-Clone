import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, InteractionManager, SafeAreaView, View } from 'react-native';
import { Card, FAB, Searchbar, useTheme } from 'react-native-paper';

import Header from '@components/Header';
import TextInfoRow from '@components/TextInfoRow';
import { getListFixedAssetInstock } from '@data/api';
import { IAssetInstock, IUserSystem } from '@models/types';
import { convertUnixTimeDDMMYYYY } from '@utils';
import { useSelector } from 'react-redux';
import moment from 'moment';

export function FixedAssetsInstockScreen() {
	const navigation: any = useNavigation();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();
	const [listAssetInstock, setListAssetInstock] = useState<IAssetInstock[]>([]);
	const [searchText, setSearchText] = useState<string>('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const response = (await getListFixedAssetInstock({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				ReceiptNo: '',
			})) as IAssetInstock[];
			setListAssetInstock(response);
		});
	}, []);

	const filterListSearch = () => {
		return listAssetInstock.filter(
			item =>
				item.Check_UserID?.includes(searchText) ||
				item.ReceiptNo?.includes(searchText),
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="In Stock Checking" />
			</View>

			<Searchbar
				placeholder={'Receipt No or User Name'}
				value={searchText}
				inputStyle={{ fontSize: 14 }}
				style={{ marginTop: 8, marginHorizontal: 8, zIndex: 2 }}
				onChangeText={text => setSearchText(text)}
			/>

			<FlatList
				data={filterListSearch()}
				style={{ paddingTop: 12, paddingHorizontal: 8 }}
				keyExtractor={(item, index) => index.toString()}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
				renderItem={({ item, index }) => (
					<Card
						elevation={2}
						style={{ marginBottom: 8 }}
						onPress={() =>
							navigation.navigate('FixedAssetsInstockDetailScreen', {
								receiptNo: item.ReceiptNo,
							})
						}
					>
						<View style={{ padding: 8 }}>
							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInfoRow icon={'barcode-outline'} value={item.ReceiptNo} />

								<TextInfoRow
									icon={'calendar-outline'}
									isIconRight
									value={moment(new Date(item.Check_Date)).format('DD/MM/YYYY')}
								/>
							</View>

							<TextInfoRow
								icon={'layers-outline'}
								value={item.Remark || 'Nothing'}
								containerStyle={{ marginBottom: 8 }}
								styleValue={{ flex: 1 }}
							/>

							<TextInfoRow
								icon={'person-outline'}
								value={item.Check_UserID || 'Undefine'}
								styleValue={{ fontWeight: '600', color: colors.primary }}
								containerStyle={{ marginBottom: 8 }}
							/>

							<TextInfoRow
								icon={'timer-outline'}
								value={convertUnixTimeDDMMYYYY(new Date().getTime() / 1000)}
							/>
						</View>
					</Card>
				)}
			/>
			{/*<SafeAreaView*/}
			{/*    style={{position: 'absolute', margin: 16, right: 0, bottom: 0}}*/}
			{/*>*/}
			{/*    <FAB icon="plus" onPress={() => navigation.navigate("FixedAssetsInstockDetailScreen", {})}/>*/}
			{/*</SafeAreaView>*/}
		</View>
	);
}
