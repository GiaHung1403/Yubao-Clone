import React, { useEffect } from 'react';
import {
	InteractionManager,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { IRequestEFlow, IUserSystem } from '@models/types';
import { getListCommentEReview } from '@actions/eReview_action';
import WebView from 'react-native-webview';

interface IProps {
	eReviewItem: IRequestEFlow;
	isScroll: boolean;
}

export default function ListApproverComponent(props: IProps) {
	const { isScroll, eReviewItem } = props;
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const listCommentEReview = useSelector(
		(state: any) => state.eReview_reducer.listCommentEReview,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			dispatch(
				getListCommentEReview({
					User_ID: dataUserSystem.EMP_NO,
					KEY_DATA: eReviewItem.keY_ID,
					FUNCTION_NAME: eReviewItem.functioN_NAME,
					companyCode: eReviewItem.companyCode,
				}),
			);
		});
	}, []);

	return (
		<WebView
			originWhitelist={['*']}
			source={{
				html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${listCommentEReview.content || ""}</body></html>`,
			}}
		/>
	);
}
