import React from 'react';
import { Image as ImageProps } from '@rocket.chat/message-parser';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';

import Color from '@config/Color';

interface IImageProps {
	value: ImageProps['value'];
}

type TMessageImage = {
	img: string;
	theme: string;
};

const ImageProgress = createImageProgress(FastImage);

const MessageImage = ({ img, theme }: TMessageImage) => (
	<ImageProgress
		style={{
			borderColor: '#e1e5e8',
			width: 300,
			height: 300,
			resizeMode: 'contain',
		}}
		source={{ uri: encodeURI(img) }}
		resizeMode={FastImage.resizeMode.cover}
		indicator={Progress.Pie}
		indicatorProps={{
			color: Color.main,
		}}
	/>
);

const Image = ({ value }: IImageProps): JSX.Element => {
	const { src } = value;
	return <MessageImage img={src.value} theme={'light'} />;
};

export default Image;
