import React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import RNFS, { readFile } from 'react-native-fs';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';

import Header from '@components/Header';

export function DocumentPDFViewScreen(props: any) {
	const { urlPDF, isShowButton } = props.route.params;

	const _onPressButtonShare = () => {
		Platform.OS === 'ios' ? sharePDFWithIOS() : sharePDFWithAndroid();
	};

	const sharePDFWithIOS = async () => {
		const options = {
			title: '',
			type: 'application/pdf',
			url: urlPDF,
		};
		await Share.open(options);
	};

	const sharePDFWithAndroid = async () => {
		let base64Data = await readFile(urlPDF, 'base64');
		base64Data = `data:application/pdf;base64,` + base64Data;

		await Share.open({
			title: '',
			url: base64Data,
			filename: `PDF_File_Convert`,
		});
		await RNFS.unlink(urlPDF);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 1 }}>
				<Header
					title="PDF View"
					isShowButton={isShowButton}
					labelButton="Share"
					onPressButton={() => _onPressButtonShare()}
				/>
			</View>

			<View style={{ flex: 1 }}>
				<Pdf
					source={{ uri: urlPDF }}
					style={{
						flex: 1,
						width: Dimensions.get('window').width,
						height: Dimensions.get('window').height,
					}}
				/>
			</View>
		</View>
	);
}
