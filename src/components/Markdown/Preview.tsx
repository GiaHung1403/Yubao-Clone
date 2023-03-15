import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import removeMarkdown from 'remove-markdown';

import shortnameToUnicode from '@utils/shortnameToUnicode';
import { formatText } from './formatText';
import styles from './styles';
import { formatHyperlink } from './formatHyperlink';

interface IMarkdownPreview {
	msg?: string;
	numberOfLines?: number;
	testID?: string;
	style?: StyleProp<TextStyle>[];
}

const MarkdownPreview = ({ msg, numberOfLines = 1, testID, style = [] }: IMarkdownPreview): React.ReactElement | null => {
	if (!msg) {
		return null;
	}

	let m = formatText(msg);
	m = formatHyperlink(m);
	m = shortnameToUnicode(m);
	// Removes sequential empty spaces
	m = m.replace(/\s+/g, ' ');
	m = removeMarkdown(m);
	m = m.replace(/\n+/g, ' ');
	return (
		<Text
			accessibilityLabel={m}
			style={[styles.text, { color: '#cbced1' }, ...style]}
			numberOfLines={numberOfLines}
			testID={testID}
		>
			{m}
		</Text>
	);
};

export default MarkdownPreview;
