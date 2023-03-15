import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	PixelRatio,
} from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListApproverEFlow } from '@actions/eFlow_action';
import Color from '@config/Color';
import { IApproverEFlow, IRequestEFlow, IUserSystem } from '@models/types';
import styles from './styles';
import RenderHTMLComponent from '@components/RenderHTMLComponent';

interface IDataItem extends IApproverEFlow, IUserSystem {}

interface IProps {
	eFlowItem: IRequestEFlow;
	isScroll: boolean;
}

export default function ListApproverComponent(props: IProps) {
	const { eFlowItem, isScroll } = props;
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const listApproverEFlow: IApproverEFlow[] = useSelector(
		(state: any) => state.eFlow_reducer.listApproverEFlow,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			dispatch(
				getListApproverEFlow({
					User_ID: dataUserSystem.EMP_NO,
					KEY_DATA: eFlowItem.keY_ID,
					FUNCTION_NAME: eFlowItem.functioN_NAME,
					companyCode: eFlowItem.companyCode,
				}),
			);
		});
	}, []);

	const getColorStatus = (status: string) => {
		switch (status) {
			case '':
				return Color.waiting;
			case 'Approved':
				return Color.approved;
			case 'Rejected':
				return Color.reject;
			default:
				return '#fff';
		}
	};

	const renderItemApprover = (item: IApproverEFlow) => {
		const source = `<p>${item.comment}</p>`;
		return (
			<View style={styles.containerItemListApprover}>
				<Text style={styles.textEmployeeName}>
					{item.app_Emp_NM?.trim()}
					{item.app_Emp_Tit_HR?.trim() ? (
						<Text style={styles.textEmployeePosition}>
							{' - '}
							{item.app_Emp_Tit_HR?.trim()}{' '}
						</Text>
					) : null}

					{item.app_Emp_Position?.trim() ? (
						<Text style={styles.textEmployeePosition}>
							({item.app_Emp_Position?.trim()})
						</Text>
					) : null}
				</Text>
				{/* {item.Comment?.trim() ? <Text>{item.Comment}</Text> : null} */}
				{item.comment?.trim() ? (
					<RenderHTMLComponent value={source} stylesheet={{}} />
				) : null}

				<Text style={styles.textSendDate}>{item.c_Send_Date}</Text>
				<View style={styles.containerViewStatus}>
					<Text style={styles.textStatus}>{item.app_Cnfm_Yn || 'Waiting'}</Text>
					<View
						style={[
							styles.circleStatus,
							{ backgroundColor: getColorStatus(item.app_Cnfm_Yn) },
						]}
					/>
				</View>
			</View>
		);
	};

	return (
		<ScrollView
			scrollEnabled={isScroll}
			showsVerticalScrollIndicator={false}
			style={styles.flatListApprover}
		>
			{listApproverEFlow.map((approver, index) => (
				<Card
					key={index.toString()}
					style={styles.cardItemListApprover}
					elevation={2}
				>
					{renderItemApprover(approver)}
				</Card>
			))}
			<SafeAreaView style={{ height: 60 }} />
		</ScrollView>
	);
}
