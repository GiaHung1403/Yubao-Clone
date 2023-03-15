import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	InteractionManager,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import AsyncStorage from '@data/local/AsyncStorage';
import { ISortRoom, IUserSystem } from '@models/types';
import EventEmitter from '@utils/events';
import { Ionicons } from '@expo/vector-icons';

const listSortOption = [
	{
		id: 'alphabetic',
		label: 'Alphabetical',
		value: 'alphabetic',
		icon: 'swap-vertical-outline',
	},
	{
		id: 'activity',
		label: 'Activity',
		value: 'activity',
		icon: 'time-outline',
	},
];

export function SortRoomModal(props: any) {
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [sortOptionSelected, setSortOptionSelected] = useState<ISortRoom>({});
	const { colors } = useTheme();
	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const objectSortOption: any = await AsyncStorage.getSortRoom();
			setSortOptionSelected(objectSortOption);
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressSort = () => {
		AsyncStorage.setSortRoom(sortOptionSelected).then();
		EventEmitter.emit('sortRoomEvent', {
			sortOptionSelected,
		});
		navigation.goBack();
	};

	const renderItemSort = ({ label, icon, isSelected, onSelected }) => (
		<TouchableOpacity
			style={{
				borderBottomColor: '#ddd',
				borderBottomWidth: 1,
				paddingVertical: 16,
			}}
			onPress={onSelected}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Icon as={Ionicons} name={icon} size={6} />
				<Text style={{ flex: 1, marginLeft: 16 }}>{label}</Text>
				{isSelected && (
					<Icon
						as={Ionicons}
						name={'checkmark-outline'}
						size={6}
						color={colors.primary}
					/>
				)}
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: 8,
					borderBottomColor: '#ddd',
					borderBottomWidth: 1,
				}}
			>
				<Button
					uppercase={false}
					style={{}}
					onPress={() => navigation.goBack()}
				>
					Cancel
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					Sort Room
				</Text>
				<Button uppercase={false} onPress={() => null}>
					Reset
				</Button>
			</View>

			{doneLoadAnimated && (
				<View style={{ flex: 1, padding: 8 }}>
					<Text style={{ fontSize: 15, fontWeight: '600' }}>Sort by</Text>

					{listSortOption.map(sortOption =>
						renderItemSort({
							label: sortOption.label,
							icon: sortOption.icon,
							isSelected:
								sortOption.id === sortOptionSelected?.sortOptionSelected,
							onSelected: () =>
								setSortOptionSelected(oldOption => ({
									...oldOption,
									sortOptionSelected: sortOption.id,
								})),
						}),
					)}

					<Text style={{ fontSize: 15, fontWeight: '600', marginTop: 20 }}>
						Group by
					</Text>

					{renderItemSort({
						label: 'Unread on top',
						icon: 'eye-off-outline',
						isSelected: sortOptionSelected?.groupOptionSelected?.isUnreadOnTop,
						onSelected: () =>
							setSortOptionSelected(oldOption => ({
								...oldOption,
								groupOptionSelected: {
									isUnreadOnTop: !oldOption?.groupOptionSelected?.isUnreadOnTop,
								},
							})),
					})}

					<Button
						mode={'contained'}
						uppercase={false}
						style={{ marginTop: 20 }}
						onPress={_onPressSort}
					>
						Sort
					</Button>
				</View>
			)}
		</View>
	);
}
