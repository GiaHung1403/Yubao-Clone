import React from 'react';
import { View } from 'react-native';

import styles from './styles';

interface IBlockQuote {
	children: JSX.Element;
	theme: string;
}

const BlockQuote = React.memo(({ children }: IBlockQuote) => (
	<View style={styles.container}>
		<View style={[styles.quote, { backgroundColor: '#e1e5e8' }]} />
		<View style={styles.childContainer}>{children}</View>
	</View>
));

export default BlockQuote;
