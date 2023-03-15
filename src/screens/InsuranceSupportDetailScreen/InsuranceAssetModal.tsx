import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { getListInsuranceAsset } from '@data/api';
import { IInsuranceAsset, IUserSystem } from '@models/types';
import { useNavigation } from '@react-navigation/native';
import { formatVND } from '@utils/formatMoney';
import { fromDateInsuranceAtom, toDateInsuranceAtom } from 'atoms/insurance-support.atom';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useSelector } from 'react-redux';

export function InsuranceAssetModal(props: any) {
	const navigation = useNavigation();
	const { ins_apNo } = props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [assets, setAssets] = useState<IInsuranceAsset[]>();

	const [fromDate] = useAtom(fromDateInsuranceAtom);
	const [toDate] = useAtom(toDateInsuranceAtom);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const responseAssets: any = await getListInsuranceAsset({
				userId: dataUserSystem.EMP_NO,
				fromDate: fromDate.format('DDMMYYYY'),
				toDate: toDate.format('DDMMYYYY'),
				ins_apNo,
			});

			setAssets(responseAssets);
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: 8,
					borderBottomColor: '#ddd',
					borderBottomWidth: 1,
				}}
			>
				<Button
					uppercase={false}
					style={{}}
					onPress={() => navigation.goBack()}
				>
					Close
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					Insurance Asset
				</Text>
				<Button uppercase={false} onPress={() => null}>
					OK
				</Button>
			</View>

			<View style={{ flex: 1 }}>
				<FlatList
					data={assets}
					keyExtractor={(_, index) => index.toString()}
					extraData={assets}
					renderItem={({ item, index }) => (
						<Card
							elevation={1}
							style={{ padding: 8, marginTop: 8, marginHorizontal: 8 }}
						>
							<Text style={{ fontWeight: '600', color: Color.main }}>
								{item.ASTS_NM}
							</Text>
							<TextInfoRow
								icon={'barcode-outline'}
								value={item.ASTS_ID.toString()}
								containerStyle={{ marginTop: 8 }}
							/>

							<TextInfoRow
								icon={'speedometer-outline'}
								label="Quantity: "
								value={item.ASTS_QUANTITY.toString()}
								styleLabel={{ flex: 0 }}
								containerStyle={{ marginTop: 8 }}
							/>

							<View style={{ flexDirection: 'row', marginTop: 8 }}>
								<TextInfoRow
									icon={'cash-outline'}
									value={`${formatVND(item.ASTS_PRICE)} ${item.CUR_C}`}
									styleValue={{ fontWeight: '600', color: Color.approved }}
								/>

								<TextInfoRow
									isIconRight
									icon={'car-outline'}
									value={item.PLATE_NO.trim() || "Not available"}
								/>
							</View>
						</Card>
					)}
				/>
			</View>
		</View>
	);
}
