import React from 'react';
import { View } from 'react-native';
import { Quote as QuoteProps } from '@rocket.chat/message-parser';

import styles from '../styles';
import Paragraph from './Paragraph';
import {useTheme} from 'react-native-paper'
import { color } from 'native-base/lib/typescript/theme/styled-system';

interface IQuoteProps {
	value: QuoteProps['value'];
}

const Quote = ({ value }: IQuoteProps): JSX.Element => {
	const {colors} = useTheme()
	return (
		<View style={styles.container}>
			<View style={[styles.quote, { backgroundColor: colors.primary }]} />
			<View style={styles.childContainer}>
				{value.map(item => (
					<Paragraph value={item.value} styleText={{color: 'white'}} />
				))}
			</View>
		</View>
	);
};

export default Quote;
