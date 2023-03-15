import React from 'react';
import { Text, TextStyle } from 'react-native';
import { Plain as PlainProps } from '@rocket.chat/message-parser';

import styles from '../styles';
import shortnameToUnicode from '@utils/shortnameToUnicode';

interface IPlainProps {
	value: PlainProps['value'];
	textStyle?: TextStyle;
}

const Plain = ({ value, textStyle }: IPlainProps): JSX.Element => {
	return (
		<Text
			accessibilityLabel={value}
			style={[styles.plainText, { color: '#000' }, textStyle]}
		>
			{shortnameToUnicode(value)}
		</Text>
	);
};

export default Plain;
