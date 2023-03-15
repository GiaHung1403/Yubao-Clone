import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { CELL_WIDTH } from './TableCell';
import styles from './styles';
import I18n from '../../i18n';
import { useNavigation } from '@react-navigation/native';

interface ITable {
	children: JSX.Element;
	numColumns: number;
	theme: string;
}

const MAX_HEIGHT = 300;

const Table = React.memo(({ children, numColumns, theme }: ITable) => {
	const navigation: any = useNavigation();
	const getTableWidth = () => numColumns * CELL_WIDTH;

	const renderRows = (drawExtraBorders = true) => {
		const tableStyle = [styles.table, { borderColor: '#e1e5e8' }];
		if (drawExtraBorders) {
			tableStyle.push(styles.tableExtraBorders);
		}

		const rows: any = React.Children.toArray(children);
		rows[rows.length - 1] = React.cloneElement(rows[rows.length - 1], {
			isLastRow: true,
		});

		return <View style={tableStyle}>{rows}</View>;
	};

	const onPress = () =>
		navigation.navigate('MarkdownTableView', {
			renderRows,
			tableWidth: getTableWidth(),
		});

	return (
		<TouchableOpacity onPress={onPress}>
			<ScrollView
				contentContainerStyle={{ width: getTableWidth() }}
				scrollEnabled={false}
				showsVerticalScrollIndicator={false}
				style={[
					styles.containerTable,
					{
						maxWidth: getTableWidth(),
						maxHeight: MAX_HEIGHT,
						borderColor: '#e1e5e8',
					},
				]}
			>
				{renderRows(false)}
			</ScrollView>
			<Text style={[styles.textInfo, { color: '#9ca2a8' }]}>
				{I18n.t('Full_table')}
			</Text>
		</TouchableOpacity>
	);
});

export default Table;
