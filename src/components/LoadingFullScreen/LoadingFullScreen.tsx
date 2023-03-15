import Color from '@config/Color';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface IProps {
	size?: "large" | "small"
}

export default function LoadingFullScreen(props: IProps) {
	const { size = 'large' } = props;
	const { colors } = useTheme();

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<ActivityIndicator color={colors.primary} size={size} />
		</View>
	);
}
