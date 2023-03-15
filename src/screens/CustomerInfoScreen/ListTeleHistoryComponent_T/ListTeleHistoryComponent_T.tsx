import React, { useEffect, useState } from 'react';
import { FlatList, InteractionManager, SafeAreaView, Text, View } from 'react-native';
import { Card , useTheme} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import LoadingFullScreen from '@components/LoadingFullScreen';
import NoDataComponent from '@components/NoDataComponent';
import Colors from '@config/Color';
import { getListTeleHistory_T } from '@data/api';
import { ITeleHistory_Trading, IUserSystem } from '@models/types';
import { convertUnixTimeDDMMYYYY } from '@utils';
import styles from './styles';

export default function ListTeleHistoryComponent_T(props: any) {
	const { customerName } = props;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [listTeleHistory, setListTeleHistory] = useState<
		ITeleHistory_Trading[]
	>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);

			const responseTeleHistory: ITeleHistory_Trading[] =
				(await getListTeleHistory_T({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					customerName,
				})) as ITeleHistory_Trading[];

			setListTeleHistory(responseTeleHistory);
		});
	}, []);

	return doneLoadAnimated ? (
		<FlatList
			style={{ padding: 8 }}
			data={listTeleHistory}
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
							{item.tele_id}
						</Text>
						<Text>
							<Text style={{ fontWeight: '500', color: colors.primary }}>
								Date:
							</Text>{' '}
							{convertUnixTimeDDMMYYYY(
								new Date(item.calldate1).getTime() / 1000,
							)}
						</Text>
						<Text
							style={{
								marginVertical: 8,
								fontWeight: '600',
								color: Colors.approved,
							}}
						>
							<Text style={{ fontWeight: '500', color: colors.primary }}>
								PIC:
							</Text>{' '}
							{item.emp_no} - {item.emp_nm}
						</Text>
						<Text>
							<Text style={{ fontWeight: '500', color: colors.primary }}>
								Content:
							</Text>{' '}
							{item.callcontent}
						</Text>
					</View>
				</Card>
			)}
		/>
	) : (
		<LoadingFullScreen />
	);
}
