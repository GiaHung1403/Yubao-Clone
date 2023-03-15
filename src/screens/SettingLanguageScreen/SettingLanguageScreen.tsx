import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

import Header from '@components/Header';
import { LocalizationContext } from '@context/LocalizationContext';
import { listLanguage } from '@data/Constants';
import AsyncStorage from '@data/local/AsyncStorage';

import styles from './styles';

export function SettingLanguageScreen(props: any) {
	const navigation: any = useNavigation();
	const I18n = React.useContext(LocalizationContext);

	const _onPressItem = async (item: any) => {
		I18n.setLocale(item.id);
		await AsyncStorage.setLanguage(item.id);
		navigation.goBack();
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={I18n.t('language')} />
			</View>

			<View>
				<FlatList
					style={{ backgroundColor: '#fff' }}
					data={listLanguage}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							onPress={() => _onPressItem(item)}
							style={styles.containerItem}
						>
							<Text>{item.label}</Text>
							<Checkbox
								status={item.id === I18n.locale ? 'checked' : 'unchecked'}
								onPress={() => _onPressItem(item)}
							/>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
}
