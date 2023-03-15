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

import { getListFileEReview } from '@data/api';
import { IRequestEFlow, IUserSystem } from '@models/types';
import openLink from '@utils/openLink';
import styles from './styles';
import isURLImage from '@utils/checkURLImage';
import ImageViewerCustom from '@components/ImageViewerCustom';

interface IProps {
	eReviewItem: IRequestEFlow;
}
interface IFileEFlow {
	fileName: string;
	link: string;
	type: string;
}

export default function ListFileComponent(props: IProps) {
	const imageViewerRef = useRef<any>();

	const navigation: any = useNavigation();
	const { eReviewItem } = props;
	const dimensions = useWindowDimensions();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [listFile, setListFile] = useState<IFileEFlow[]>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;

			const responseFile: any = await getListFileEReview({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
				KEY_DATA: eReviewItem.keY_ID,
				FUNCTION_NAME: eReviewItem.functioN_NAME,
				companyCode: eReviewItem.companyCode,
			});

			const filterListFile = responseFile.filter(
				file => file.type.toLowerCase() !== 'json',
			);
			setListFile(filterListFile);
		});
	}, []);

	const _onPressFileItem = ({ file }: { file: IFileEFlow }) => {
		// openlink(file.link)
		const indexSubPDFMain = file.link.toLowerCase().indexOf('.pdf');

		if (file.type === 'IFRAME') {
			file.link = file.link.toLowerCase().replace(
				'http://leasesys/',
				'http://api.chailease.com.vn:9999/',
			);
			file.link = file.link
				.toLowerCase()
				.replace('http://tradesys/', 'http://api.chaileasetrade.com.vn:9902/');
		}

		navigation.navigate('WebviewScreen', {
			url: file.link,
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
