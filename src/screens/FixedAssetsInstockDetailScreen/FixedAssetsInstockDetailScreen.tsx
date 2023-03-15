import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, InteractionManager, SafeAreaView, View } from 'react-native';
import { Card } from 'react-native-paper';

import Header from '@components/Header';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { getListStatusAsset } from '@data/api';
import { getListFixedAssetInstockDetail } from '@data/api/api_fixed_assets';
import { IFixedAssetInstockDetail, IUserSystem } from '@models/types';
import { useSelector } from 'react-redux';
import moment from 'moment';

export function FixedAssetsInstockDetailScreen(props) {
	const navigation: any = useNavigation();

	const { receiptNo } = props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [listAssetInstockDetail, setListAssetInstockDetail] = useState<
		IFixedAssetInstockDetail[]
	>([]);
	const [listStatus, setListStatus] = useState([]);
	const [statusSelected, setStatusSelected] = useState();

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const response = (await getListFixedAssetInstockDetail({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				ReceiptNo: receiptNo,
			})) as IFixedAssetInstockDetail[];

			setListAssetInstockDetail(response);

			const responseStatus: any = await getListStatusAsset({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			});
			const statusConvert = responseStatus.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));

			setListStatus(statusConvert);
		});
	}, []);

	const _onChangeStatus = ({ status, index }) => {};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Fixed Assets Instock Detail" />
			</View>

			<FlatList
				data={listAssetInstockDetail}
				keyExtractor={(_, index) => index.toString()}
				style={{ paddingTop: 12, paddingHorizontal: 8 }}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
				renderItem={({ item, index }) => (
					<Card
						elevation={2}
						style={{ marginBottom: 8 }}
						onPress={() => navigation.navigate('FixedAssetsDetailScreen', {})}
					>
						<View style={{ padding: 8 }}>
							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInfoRow
									icon={'barcode-outline'}
									value={item.AssetCode}
									styleValue={{ fontWeight: '600', color: Color.approved }}
								/>

								<TextInfoRow
									icon={'calendar-outline'}
									isIconRight
									value={moment(new Date(item.Check_Date)).format('DD/MM/YYYY')}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInfoRow
									icon={'apps-outline'}
									value={item.AssetCategoryName}
								/>

								<TextInfoRow
									icon={'laptop-outline'}
									isIconRight
									value={item.AssetName}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInfoRow icon={'business-outline'} value={item.CompanyID} />

								<TextInfoRow
									icon={'layers-outline'}
									isIconRight
									value={'Material'}
								/>
							</View>

							<PickerCustomComponent
								showLabel={true}
								listData={listStatus}
								label="Asset Status"
								value={item.AssetStatus}
								style={{ flex: 1 }}
								textStyle={{ maxWidth: '100%' }}
								onValueChange={text => _onChangeStatus({ status: text, index })}
							/>
						</View>
					</Card>
				)}
			/>
		</View>
	);
}
