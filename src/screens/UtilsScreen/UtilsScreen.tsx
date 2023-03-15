import Color from '@config/Color';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect } from 'react';
import {
	FlatList,
	Linking,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useTheme } from 'react-native-paper';
import HeaderBanner from '@components/HeaderBanner/HeaderBanner';
import { LocalizationContext } from '@context/LocalizationContext';
import { IUserSystem } from '@models/types';
import styles from './styles';

export function UtilsScreen(props: any) {
	const navigation: any = useNavigation();
	const I18n = useContext(LocalizationContext);
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const listFeature = [
		// {
		//   name: "Attendance",
		//   image: "calendar-check-o",
		//   id: "attendance",
		// },
		{
			name: 'Scan Document',
			image: 'file-pdf-o',
			id: 'scanDocument',
		},
		{
			name: 'Scan CardVisit',
			image: 'vcard-o',
			id: 'scanCard',
		},
		{
			name: 'Quiz',
			image: 'book',
			id: 'quiz',
		},
		{
			name: null,
		},
	];

	useEffect(() => {
		(async function checkListener() {
			const initialUrl = await Linking.getInitialURL();

			const codeScreen: string = initialUrl?.substring(
				initialUrl.indexOf('//') + 2,
			)!;

			if (codeScreen) {
				navigation.navigate(codeScreen);
			}
		})();
	}, []);

	const _onPressItemFeature = ({ dataFeature }) => {
		switch (dataFeature.id) {
			case 'attendance':
				navigation.navigate('AttendanceViaFaceScreen');
				break;
			case 'scanDocument':
				navigation.navigate('DocumentScanScreen');
				break;
			case 'scanCard':
				navigation.navigate('DetectTextCameraScreen');
				break;
			case 'quiz':
				navigation.navigate('QuizScreen');
				break;
			default:
				break;
		}
	};

	return (
		<View style={styles.container}>
			<HeaderBanner />

			<View style={styles.containerBody}>
				{/* Session Tra cứu */}
				<FlatList
					style={styles.listFeature}
					data={listFeature}
					keyExtractor={(item, index) => index.toString()}
					extraData={props}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={() => (
						<SafeAreaView style={{ backgroundColor: '#fff' }} />
					)}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							key={index.toString()}
							style={styles.containerItem}
							disabled={!item.name}
							onPress={() => _onPressItemFeature({ dataFeature: item })}
						>
							<View
								style={[
									styles.containerImageItem,
									{
										marginLeft: index % 2 === 0 ? 16 : 0,
										marginTop: index === 0 || index === 1 ? 16 : 0,
										marginRight: index % 2 !== 0 ? 16 : 0,
										borderBottomColor: '#ddd',
										borderBottomWidth:
											index !== listFeature.length - 1 &&
											index !== listFeature.length - 2
												? 1
												: 0,
										borderRightColor: '#ddd',
										borderRightWidth: index % 2 === 0 ? 1 : 0,
									},
								]}
							>
								<Icon
									as={FontAwesome}
									name={item.image!}
									size={10}
									color={colors.primary}
								/>

								<Text style={styles.nameItem}>{item.name}</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
}
