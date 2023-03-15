import React, { useEffect, useState } from 'react';
import { FlatList, InteractionManager, SafeAreaView, Text, View } from 'react-native';
import { Card , useTheme} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import LoadingFullScreen from '@components/LoadingFullScreen';
import NoDataComponent from '@components/NoDataComponent';
import Colors from '@config/Color';
import { getListVisit_History_Trading } from '@data/api';
import { IUserSystem, IVisitHistory_Trading } from '@models/types';
import { convertUnixTimeDDMMYYYY } from '@utils';
import styles from './styles';

export default function ListVisitHistoryComponent_T(props: any) {
	const { leseID } = props;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [listVisitHistory, setListVisitHistory] = useState<
		IVisitHistory_Trading[]
	>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);

			const responseVisitHistory: any = await getListVisit_History_Trading({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				LeseID: leseID,
			});

			setListVisitHistory(responseVisitHistory);
		});
	}, []);

	return doneLoadAnimated ? (
		<FlatList
			style={{ padding: 8 }}
			data={listVisitHistory}
			contentContainerStyle={{ flexGrow: 1 }}
			keyExtractor={(_, index) => index.toString()}
			ListEmptyComponent={() => <NoDataComponent />}
			ListFooterComponent={() => <SafeAreaView style={{ height: 50 }} />}
			renderItem={({ item, index }) => (
				<Card style={{ marginBottom: 8 }} elevation={2}>
					<View style={{ padding: 8 }}>
						<Text
							style={{
								color: colors.primary,
								fontWeight: '600',
								fontSize: 15,
								marginBottom: 8,
							}}
						>
							{item.op_Emp_Nm}
						</Text>
						<Text>
							<Text style={{ fontWeight: '500', color: colors.primary }}>
								SEQ:
							</Text>{' '}
							{item.seq}
						</Text>
						<Text style={{ marginVertical: 4 }}>
							<Text style={{ fontWeight: '500', color: colors.primary }}>
								Date:
							</Text>{' '}
							{convertUnixTimeDDMMYYYY(
								new Date(item.bas_Date).getTime() / 1000,
							)}
						</Text>
						<Text>
							<Text style={{ fontWeight: '500', color: colors.primary }}>
								Remark:
							</Text>{' '}
							{item.rmks}
						</Text>
					</View>
				</Card>
			)}
		/>
	) : (
		<LoadingFullScreen />
	);
}
