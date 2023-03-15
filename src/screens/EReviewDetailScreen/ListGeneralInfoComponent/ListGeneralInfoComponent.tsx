import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Color from '@config/Color';
import { getListFileEFlow } from '@data/api';
import { IRequestEFlow, IUserSystem } from '@models/types';
import styles from './styles';
import WebView from 'react-native-webview';

interface IProps {
	eReviewItem: IRequestEFlow;
}

export default function ListFileComponent(props: IProps) {
	const { eReviewItem } = props;

	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [listFile, setListFile] = useState<any>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const responseFile: any = await getListFileEFlow({
				User_ID: dataUserSystem.EMP_NO,
				KEY_DATA: eReviewItem.keY_ID,
				FUNCTION_NAME: eReviewItem.functioN_NAME,
				companyCode: eReviewItem.companyCode,
			});

			const filterListFile = responseFile.filter(
				file => file.type.toLowerCase() === 'html',
			);

			setListFile(filterListFile);
		});
	}, []);

	return (
		<>
			{listFile.map((item, index) => {
				return (
					<WebView
						originWhitelist={['*']}
						source={{
							html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${item.link}</body></html>`,
						}}
					/>
				);
			})}
		</>
	);
}
