import React, { useMemo } from 'react';
import { ImageStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

interface IProps {
	baseUrl?: string;
	emoji: {
		content: string;
		name: string;
		extension: string;
	};
	style: ImageStyle[];
}

export default function CustomEmoji(props: IProps) {
  const { baseUrl, emoji, style } = props;

  return useMemo(
		() => (
			<FastImage
				style={style as any}
				source={{
					uri: `${baseUrl}/emoji-custom/${encodeURIComponent(
						emoji.content || emoji.name,
					)}.${emoji.extension}`,
				}}
			/>
		),
		[],
	);
}
