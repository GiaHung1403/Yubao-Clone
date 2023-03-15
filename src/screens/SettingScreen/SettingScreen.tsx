import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Image,
	InteractionManager,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Switch } from 'react-native-paper';

import Header from '@components/Header';
import { LocalizationContext } from '@context/LocalizationContext';
import { listLanguage } from '@data/Constants';
import styles from './styles';
import AsyncStorage from '@data/local/AsyncStorage';

const IC_ARROW_RIGHT = require('@assets/icons/ic_arrow_right.png');

export function SettingScreen(props: any) {
	const navigation: any = useNavigation();
	const I18n = React.useContext(LocalizationContext);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [isSwitchAuthOn, setIsSwitchAuthOn] = useState(true);
	const [isSwitchNotificationOn, setIsSwitchNotificationOn] = useState(true);

	const [isModalVisible, setIsModalVisible] = useState(false);

	const languageSelected = listLanguage.find(item => item.id === I18n.locale);
	const [color, getColor] = useState('');
	useEffect(() => {
		(async () => {
			const main = await AsyncStorage.getColor();
			getColor(main);
		})();
	}, []);

	const txtSetting = I18n.t('settings');
	const txtTouchID = I18n.t('setting_touchID');
	const txtLanguage = I18n.t('language');
	const txtTheme = I18n.t('theme');
	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onToggleSwitchAuth = () => {
		setIsSwitchAuthOn(!isSwitchAuthOn);
	};

	const _onToggleSwitchNotification = () => {
		setIsSwitchNotificationOn(!isSwitchNotificationOn);
	};

	const _onPressChangeLanguage = () => {
		navigation.navigate('SettingLanguageScreen');
	};

	const _onPressChangeTheme = () => {
		//setIsModalVisible(true);
		navigation.navigate('SettingCustomThemeScreen');
	};

	return (
		<View style={styles.container}>
			<View style={styles.containerHeader}>
				<Header title={txtSetting} />
			</View>
			{doneLoadAnimated ? (
				<ScrollView style={styles.containerBody}>
					<View style={[styles.containerItem, { marginTop: 8, flex: 1 }]}>
						<Text style={{ flex: 1 }}>{txtTouchID}</Text>
						<Switch
							value={isSwitchAuthOn}
							onValueChange={() => _onToggleSwitchAuth()}
						/>
					</View>

					<TouchableOpacity
						onPress={() => _onPressChangeLanguage()}
						style={[styles.containerItem, { marginTop: 8 }]}
					>
						<Text>{txtLanguage}</Text>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Text style={{ color: '#8a8a8a' }}>
								{languageSelected?.label}
							</Text>
							<Image
								source={IC_ARROW_RIGHT}
								resizeMode="contain"
								style={{ width: 16, height: 16, tintColor: '#8a8a8a' }}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => _onPressChangeTheme()}
						style={[styles.containerItem, { marginTop: 8 }]}
					>
						<Text>{txtTheme}</Text>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Image
								source={IC_ARROW_RIGHT}
								resizeMode="contain"
								style={{ width: 16, height: 16, tintColor: '#8a8a8a' }}
							/>
						</View>
					</TouchableOpacity>

					{/* <View style={{ flex: 1 }}>
            <GestureRecognizer
              style={{ flex: 1 }}
              onSwipeDown={() => setIsModalVisible(false)}
            >
              <Modal
                isVisible={isModalVisible}
                style={{ marginVertical: 100 }}
                animationType="slide"
              >
                <View
                  style={{ flex: 1, padding: 45, backgroundColor: "#212021" }}>
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Choose you color
                  </Text>
                  <ColorPicker
                    onColorSelected={color => _onPressItem(color)}
                    style={{ flex: 1 }}
                  />
                </View>
              </Modal>
            </GestureRecognizer>
          </View> */}
				</ScrollView>
			) : null}
		</View>
	);
}
