import React from 'react';
import { Text, TextStyle } from 'react-native';
import { Paragraph as ParagraphProps } from '@rocket.chat/message-parser';

import Inline from './Inline';
import styles from '../styles';

interface IParagraphProps {
	value: ParagraphProps['value'];
	styleText?: TextStyle
}

const Paragraph = ({ value, styleText }: IParagraphProps): JSX.Element => {
	return (
		<Text style={[styles.text, styleText, { fontSize: 14  }]}>
			<Inline value={value} textStyle={styleText} />
		</Text>
	);
};

export default Paragraph;
