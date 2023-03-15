import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Chip, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';

import { typeValidAprvAtom } from 'atoms/valid_aprv.atom';
import { useAtom } from 'jotai';

const listFilterChip = [
	{ id: 1, label: 'All', icon: 'ballot' },
	{ id: 2, label: 'Valid', icon: 'focus-auto' },
	{ id: 3, label: 'Not Valid', icon: 'alarm-off' },
];
export default function ListFilterButton(props: any) {
	const { onRefresh } = props;
	const [, setFilterSelected] = useAtom(typeValidAprvAtom);
	const [select, setSelect] = useState<any>(1);

	useEffect(() => {
		const timeOutFilter = setTimeout(() => {
			setFilterSelected(select);
		}, 50);
		return () => clearTimeout(timeOutFilter);
	}, [select]);

	const onPressFilter = item => {
		onRefresh(item);
	};

	return (
		<ScrollView
			style={{
				paddingLeft: 8,
				flexDirection: 'row',
				alignSelf: 'center',
			}}
			horizontal
			showsHorizontalScrollIndicator={false}
		>
			{listFilterChip.map(item => {
				const isSelected = select === item.id;
				return (
					<View key={item.id} style={{ marginRight: 8 }}>
						<Chip
							icon={item.icon}
							selected={isSelected}
							style={isSelected ? { backgroundColor: `${Color.main}30` } : {}}
							onPress={() => {
								setSelect(item.id);
								onPressFilter(item.id);
							}}
						>
							{item.label}
						</Chip>
					</View>
				);
			})}
		</ScrollView>
	);
}
