import React, { useEffect, useState } from 'react';
import {
	InteractionManager,
	Keyboard,
	Text,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
	ScrollView,

} from 'react-native';
import { useSelector } from 'react-redux';

import { useTheme } from 'react-native-paper';
import Color from '@config/Color';
import { getDataPreparedEFlow } from '@data/api';
import { IRequestEFlow, IUserSystem } from '@models/types';
import styles from './styles';
import RenderHTMLComponent from '@components/RenderHTMLComponent';

interface IProps {
	eFlowItem: IRequestEFlow;
}
interface IPreparedEFlow {
	department: string;
	ext: string;
	ha_Sign: string;
	kind: string;
	prepared_By: string;
	request_Date: string;
	request_No: string;
	rmks: null;
	sT_C: string;
	title: string;
}

export default function PreparedComponent(props: IProps) {
	const { eFlowItem } = props;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();
	const [preparedData, setPreparedData] = useState<IPreparedEFlow>();

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const responsePrepared: any = await getDataPreparedEFlow({
				User_ID: dataUserSystem.EMP_NO,
				KEY_DATA: eFlowItem.keY_ID,
				FUNCTION_NAME: eFlowItem.functioN_NAME,
				companyCode: eFlowItem.companyCode,
			});
			setPreparedData(responsePrepared);
		});
	}, []);

	const getColorStatus = (status: string) => {
		switch (status) {
			case 'Waiting Approval':
				return Color.waiting;
			case 'Reject':
				return Color.reject;
			case 'Approved':
				return Color.approved;
			default:
				break;
		}
	};
	const source = `<p>${eFlowItem.rmks}</p>`;

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={{}}>
				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					<Text
						style={{
							flex: 1,
							color: colors.primary,
							fontWeight: '600',
							fontSize: 15,
						}}
					>
						Kind:
					</Text>
					<Text>{preparedData?.kind}</Text>
				</View>
				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					<Text
						style={{
							flex: 1,
							color: colors.primary,
							fontWeight: '600',
							fontSize: 15,
						}}
					>
						Prepared by:
					</Text>
					<Text>
						{preparedData?.prepared_By} ({preparedData?.ext})
					</Text>
				</View>
				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					<Text
						style={{
							flex: 1,
							color: colors.primary,
							fontWeight: '600',
							fontSize: 15,
						}}
					>
						Department:
					</Text>
					<Text>{preparedData?.department}</Text>
				</View>
				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					<Text
						style={{
							flex: 0,
							color: colors.primary,
							fontWeight: '600',
							fontSize: 15,
							marginRight: 20,
						}}
					>
						Remark:
					</Text>
						<RenderHTMLComponent value={source} stylesheet={stylesHTML} />

				</View>
				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					<Text
						style={{
							flex: 1,
							color: colors.primary,
							fontWeight: '600',
							fontSize: 15,
						}}
					>
						Request Date:
					</Text>
					<Text>{preparedData?.request_Date}</Text>
				</View>
				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					<Text
						style={{
							flex: 1,
							color: colors.primary,
							fontWeight: '600',
							fontSize: 15,
						}}
					>
						Status:
					</Text>
					<View style={styles.containerViewStatus}>
						{eFlowItem.functioN_NAME === 'PCR' ? (
							<RenderHTMLComponent value={eFlowItem.status} stylesheet={{}} />
						) : (
							<Text>{eFlowItem.status}</Text>
						)}
						<View
							style={[
								styles.circleStatus,
								{ backgroundColor: getColorStatus(eFlowItem.status) },
							]}
						/>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const stylesHTML = StyleSheet.create({
	p: {
		textAlign: 'right',
		alignContent : 'flex-end'
	},
});
