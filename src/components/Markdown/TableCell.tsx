import React from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

interface ITableCell {
	align: '' | 'left' | 'center' | 'right';
	children: JSX.Element;
	isLastCell: boolean;
	theme: string;
}

export const CELL_WIDTH = 100;

const TableCell = React.memo(({ isLastCell, align, children, theme }: ITableCell) => {
	const cellStyle = [styles.cell, { borderColor: '#e1e5e8' }];
	if (!isLastCell) {
		cellStyle.push(styles.cellRightBorder);
	}

	let textStyle = null;
	if (align === 'center') {
		textStyle = styles.alignCenter;
	} else if (align === 'right') {
		textStyle = styles.alignRight;
	}

	return (
		<View style={[...cellStyle, { width: CELL_WIDTH }]}>
			<Text style={[textStyle, { color: '#2f343d' }]}>{children}</Text>
		</View>
	);
});

export default TableCell;
