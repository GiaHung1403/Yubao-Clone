import React from 'react';
import { Image, Text, View, ViewStyle } from 'react-native';
import { Avatar } from 'react-native-paper';
import Svg, { ImageProps } from 'react-native-svg';

import { getDomainAPIChat, DOMAIN_API_CHAT_NEW } from '@data/Constants';
import styles from './styles';

interface IProps {
	username?: string;
	size: number;
	styleContainer?: ViewStyle;
	name?: string;
}

export default function AvatarBorder(props: IProps) {
	const { username, size, styleContainer, name } = props;

	return (
		<View
			style={[
				styles.container,
				{ width: size + 6, height: size + 6, borderRadius: (size + 6) / 2 },
				styleContainer,
			]}
		>
			<Avatar.Image
				source={{
					uri: `${getDomainAPIChat()}/avatar/${username}?size=${120}&format=png`,
				}}
				size={size}
			/>
		</View>
	);
}
