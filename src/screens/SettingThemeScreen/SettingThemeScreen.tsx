import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
	FlatList,
	Text,
	TouchableOpacity,
	View,
	Image,
	ImageBackground,
} from 'react-native';

import Header from '@components/Header';
import { LocalizationContext } from '@context/LocalizationContext';
import { PreferencesContext } from '@context/PreferencesContext';
import { listThemes } from '@data/Constants';
import AsyncStorage from '@data/local/AsyncStorage';

import styles from './styles';

const BG_HCM =
	'https://i1-dulich.vnecdn.net/2021/05/27/xavier-portela-dubai-glow-2-1622087761.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=zpEojRsSC5lw_3noiyUkag';

export function SettingThemeScreen(props: any) {
	const navigation: any = useNavigation();
	const I18n = React.useContext(LocalizationContext);
	const colors = React.useContext(PreferencesContext);

	const { newTheme } = React.useContext(PreferencesContext);
	const [customTheme, setCustomTheme] = useState<any>([]);

	const [theme, setTheme] = useState<string>(BG_HCM);

	useEffect(() => {
		(async () => {
			const main = await AsyncStorage.getColor();
			setCustomTheme(main);
		})();
	}, []);

	const _onPressTheme = item => {
		setTheme(item.Link);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={I18n.t('theme')} />
			</View>
			<ImageBackground
				source={{
					uri: `data:image/jpeg;base64,${newTheme}`,
				}}
				style={{ flex: 2 }}
			>
				<View style={{ flex: 2 }}>
					<View>
						<Text
							style={{ color: 'white', textAlign: 'center', marginTop: 20 }}
						>
							Choose you theme
						</Text>
						<FlatList
							data={listThemes}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							renderItem={({ item, index }) => (
								<TouchableOpacity
									onPress={() => {
										_onPressTheme(item);
									}}
									style={styles.containerItem}
								>
									<Image
										source={{ uri: item.Link }}
										resizeMode={'contain'}
										style={{
											width: 210,
											height: 150,
											alignSelf: 'center',
											marginVertical: 16,
										}}
									/>
								</TouchableOpacity>
							)}
						/>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
}
