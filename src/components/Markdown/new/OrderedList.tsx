import React from 'react';
import { View, Text } from 'react-native';
import { OrderedList as OrderedListProps } from '@rocket.chat/message-parser';

import Inline from './Inline';
import styles from '../styles';

import {  useTheme } from 'react-native-paper';

interface IOrderedListProps {
	value: OrderedListProps['value'];
}

const OrderedList = ({ value }: IOrderedListProps): JSX.Element => {
	const {colors} = useTheme()

	return (
		<View>
			{value.map((item : any , index) => (
				<View style={styles.row}>
					<Text style={[styles.text, { color: colors.primary }]}>{item?.number}. </Text>
					<Inline value={item.value} />
				</View>
			))}
		</View>
	);
};

export default OrderedList;
