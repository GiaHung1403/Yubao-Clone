import React from 'react';
import { Text } from 'react-native';
import { Code as CodeProps } from '@rocket.chat/message-parser';

import styles from '../styles';
import CodeLine from './CodeLine';

interface ICodeProps {
	value: CodeProps['value'];
}

const Code = ({ value }: ICodeProps): JSX.Element => {

	return (
		<Text
			style={[
				styles.codeBlock,
				{
					color: '#cbced1',
					backgroundColor: '#f1f2f4',
					borderColor: '#e1e5e8',
				},
			]}
		>
			{value.map(block => {
				switch (block.type) {
					case 'CODE_LINE':
						return <CodeLine value={block.value} />;
					default:
						return null;
				}
			})}
		</Text>
	);
};

export default Code;
