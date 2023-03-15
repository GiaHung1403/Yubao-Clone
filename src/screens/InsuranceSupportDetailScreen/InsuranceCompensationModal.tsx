import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { getListInsuranceAsset, getListInsuranceCompensation } from '@data/api';
import { IInsuranceAsset, IUserSystem } from '@models/types';
import { IInsuranceCompensation } from '@models/types/IInsuranceCompensation';
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

export function InsuranceCompensationModal(props: any) {
	const navigation = useNavigation();
	const { apno } = props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [compensations, setCompensation] = useState<IInsuranceCompensation[]>();

	const [fromDate] = useAtom(fromDateInsuranceAtom);
	const [toDate] = useAtom(toDateInsuranceAtom);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const responseCompensation: any = await getListInsuranceCompensation({
				userId: dataUserSystem.EMP_NO,
				fromDate: fromDate.format('DDMMYYYY'),
				toDate: toDate.format('DDMMYYYY'),
				apno,
			});

			setCompensation(responseCompensation);
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
					Insurance Compensation
				</Text>
				<Button uppercase={false} onPress={() => null}>
					OK
				</Button>
			</View>

			<View style={{ flex: 1 }}>
				<FlatList
					data={compensations}
					keyExtractor={(_, index) => index.toString()}
					extraData={compensations}
					renderItem={({ item, index }) => (
						<Card
							elevation={1}
							style={{ padding: 8, marginTop: 8, marginHorizontal: 8 }}
						>
							<Text style={{ fontWeight: '600', color: Color.main }}>
								{item.LS_NM}
							</Text>
							<View style={{ flexDirection: 'row' }}>
								<TextInfoRow
									icon={'barcode-outline'}
									value={item.ID.toString()}
									containerStyle={{ marginTop: 8 }}
								/>

								<TextInfoRow
									isIconRight
									icon={'document-text-outline'}
									value={item.APNO}
									styleLabel={{ flex: 0 }}
									containerStyle={{ marginTop: 8 }}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginTop: 8 }}>
								<TextInfoRow
									icon={'cash-outline'}
									value={item.AMOUNT}
									styleValue={{ fontWeight: '600', color: Color.approved }}
								/>

								<TextInfoRow
									isIconRight
									icon={'car-outline'}
									value={item.PLATE_NO.trim() || 'Not available'}
								/>
							</View>

							<TextInfoRow
								icon={'briefcase-outline'}
								value={item.RECEIVER_NAME}
								styleLabel={{ flex: 0 }}
								containerStyle={{ marginTop: 8 }}
							/>

							<TextInfoRow
								icon={'create-outline'}
								value={item.POA_CONTENT_NAME}
								containerStyle={{ marginTop: 8, flex: 1 }}
								styleValue={{ flex: 1 }}
							/>
						</Card>
					)}
				/>
			</View>
		</View>
	);
}
