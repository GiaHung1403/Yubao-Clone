import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
	Image,
	InteractionManager,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { getListFileEFlow } from '@data/api';
import { IRequestEFlow, IUserSystem } from '@models/types';
import openLink from '@utils/openLink';
import styles from './styles';
import isURLImage from '@utils/checkURLImage';
import ImageViewerCustom from '@components/ImageViewerCustom';

interface IProps {
	eFlowItem: IRequestEFlow;
}
interface IFileEFlow {
	fileName: string;
	link: string;
	type: string;
}

export default function ListFileComponent(props: IProps) {
	const imageViewerRef = useRef<any>();

	const navigation: any = useNavigation();
	const { eFlowItem } = props;
	const dimensions = useWindowDimensions();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [listFile, setListFile] = useState<IFileEFlow[]>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;

			const responseFile: any = await getListFileEFlow({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
				KEY_DATA: eFlowItem.keY_ID,
				FUNCTION_NAME: eFlowItem.functioN_NAME,
				companyCode: eFlowItem.companyCode,
			});

			const filterListFile = responseFile.filter(
				file => file.type.toLowerCase() !== 'html',
			);

			setListFile(filterListFile);
		});
	}, []);

	const _onPressFileItem = ({ file }: { file: IFileEFlow }) => {
		console.log('====================================');
		console.log(file, eFlowItem);
		console.log('====================================');
		// openlink(file.link)
		const indexSubPDFMain = file.link.toLowerCase().indexOf('.pdf');
		let link = file.link;
		if (['CA', 'MBO'].includes(eFlowItem.functioN_NAME)) {
			link = link
				.toLowerCase()
				.replace('http://leasesys', 'https://system.chailease.com.vn');

			console.log('====================================');
			console.log(link);
			console.log('====================================');
		}
		navigation.navigate('WebviewScreen', {
			url: link,
			title: file.fileName,
			isHTML: file.type === 'HTML',
			isPDF: indexSubPDFMain > -1,
		});
	};

	return (
		<View style={styles.flatListFile}>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{listFile.map((item, index) => (
					<Card
						key={index.toString()}
						style={[
							styles.cardItemListFile,
							{
								marginRight: 8,
							},
						]}
						elevation={2}
					>
						<TouchableOpacity
							style={[
								styles.containerItemListFile,
								{
									width:
										index % 2
											? dimensions.width / 2 - 16
											: dimensions.width / 2 - 8,
								},
							]}
							onPress={() => _onPressFileItem({ file: item })}
						>
							<Image
								source={{
									uri:
										item.type.toLowerCase() === 'pdf'
											? 'https://img.icons8.com/bubbles/344/000000/pdf-2.png'
											: 'https://img.icons8.com/bubbles/344/000000/document.png',
								}}
								resizeMode="contain"
								style={styles.iconFile}
							/>
							<Text style={styles.textFileName}>
								{item.fileName}
								{item.fileName.includes('.')
									? ''
									: `.${item.type.toLowerCase()}`}
							</Text>
						</TouchableOpacity>
					</Card>
				))}
			</View>

			<ImageViewerCustom
				ref={ref => {
					imageViewerRef.current = ref;
				}}
			/>
		</View>
	);
}
