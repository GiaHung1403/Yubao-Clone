import React from 'react';
import { UnorderedList as UnorderedListProps } from '@rocket.chat/message-parser';
import { View, Text } from 'react-native';

import Inline from './Inline';
import styles from '../styles';

interface IUnorderedListProps {
	value: UnorderedListProps['value'];
}

const UnorderedList = ({ value }: IUnorderedListProps): JSX.Element => {
	return (
		<View>
			{value.map(item => (
				<View style={styles.row}>
					<Text style={[styles.text, { color: '#cbced1' }]}>- </Text>
					<Inline value={item.value} />
				</View>
			))}
		</View>
	);
};

export default UnorderedList;
