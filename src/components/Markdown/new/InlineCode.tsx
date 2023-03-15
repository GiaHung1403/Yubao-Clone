import React from 'react';
import { Text } from 'react-native';
import { InlineCode as InlineCodeProps } from '@rocket.chat/message-parser';

import styles from '../styles';

interface IInlineCodeProps {
	value: InlineCodeProps['value'];
}

const InlineCode = ({ value }: IInlineCodeProps): JSX.Element => {
	return (
		<Text
			style={[
				styles.codeInline,
				{
					color: '#2f343d',
					backgroundColor: '#f1f2f4',
					borderColor: '#e1e5e8',
				},
			]}
		>
			{(block => {
				switch (block.type) {
					case 'PLAIN_TEXT':
						return <Text>{block.value}</Text>;
					default:
						return null;
				}
			})(value)}
		</Text>
	);
};

export default InlineCode;
