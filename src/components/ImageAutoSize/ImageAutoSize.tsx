import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import Color from '@config/Color';
import { CaseRatioImage } from '@models/CaseRatioImageEnum';
import { getImageSize } from '@utils';
import { useTheme } from 'react-native-paper';

const widthScreen = Dimensions.get('screen').width;

export default function ImageAutoSize(props: any) {
	const { uri, isMe } = props;
	const [ratioSize, setRatioSize] = useState(0);

	const { colors } = useTheme();

	useEffect(() => {
		(async function checkSizeImage() {
			setRatioSize(await _checkRatioSizeImage());
		})();
	}, []);

	const _checkRatioSizeImage = async () => {
		const { width, height } = await getImageSize(uri);

		if (width > height) {
			return CaseRatioImage.WIDTH_THAN;
		} else if (width === height) {
			return CaseRatioImage.EQUAL;
		} else {
			return CaseRatioImage.HEIGHT_THAN;
		}
	};

	return (
		<View
			style={{
				borderWidth: 1,
				borderColor: isMe ? colors.primary : '#ddd',
				borderRadius: 8,
				marginBottom: 4,
				overflow: 'hidden',
			}}
		>
			<FastImage
				style={{
					width:
						ratioSize === CaseRatioImage.WIDTH_THAN ? 0.8 * widthScreen : 200,
					height: ratioSize === CaseRatioImage.WIDTH_THAN ? 200 : 300,
					maxHeight: 300,
					maxWidth: 0.8 * widthScreen - 20,
				}}
				source={{
					uri,
					priority: FastImage.priority.normal,
				}}
				resizeMode={FastImage.resizeMode.cover}
			/>
		</View>
	);
}
