import React, { useEffect, useState } from 'react';
import {
	Alert,
	Dimensions,
	FlatList,
	Image,
	Linking,
	Platform,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '@components/Header/Header';
import NoDataComponent from '@components/NoDataComponent';
import { getListGuarantor } from '@data/api';
import { IContactPerson, IUserSystem } from '@models/types';

const IC_EMAIL = require('@assets/icons/ic_email.png');
const IC_PHONE = require('@assets/icons/ic_phone.png');

export function CustomerGuarantorScreen(props: any) {
	const { title, APNO }: any = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [listGuarantor, setListGuarantor] = useState<IContactPerson[]>([]);

	const { colors } = useTheme();

	useEffect(() => {
		(async function getData() {
			const credentials: any = await Keychain.getGenericPassword();
			const { username, password } = credentials;

			const responseGuarantor: any = await getListGuarantor({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
				APNO,
			});

			setListGuarantor(responseGuarantor);
		})();
	}, []);

	const _onPressPhoneIcon = (numberPhone: string) => {
		let phoneNumber = '';

		if (Platform.OS === 'android') {
			phoneNumber = `tel:${numberPhone}`;
		} else {
			phoneNumber = `telprompt:${numberPhone}`;
		}

		Linking.canOpenURL(phoneNumber)
			.then(supported => {
				if (supported) {
					return Linking.openURL(phoneNumber)
						.then(data => null)
						.catch(err => {
							throw err;
						});
				}
			})
			.catch(err => Alert.alert('Thông báo', err.message));
	};

	const _onPressEmailIcon = (email: string) => {
		Linking.openURL(`mailto:${email}`);
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<Header title={title} />
			<FlatList
				data={listGuarantor}
				keyExtractor={(_, index) => index.toString()}
				contentContainerStyle={{ flexGrow: 1 }}
				ListEmptyComponent={() => <NoDataComponent />}
				renderItem={({ item, index }) => (
					<Card
						style={{
							backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff',
							marginTop: 8,
							marginHorizontal: 8,
						}}
						elevation={4}
					>
						<View style={{ padding: 8 }}>
							<Text
								style={{
									marginBottom: 4,
									fontWeight: '600',
									color: colors.primary,
									fontSize: 15,
								}}
							>
								{item.CP_NM}
							</Text>
							<TouchableOpacity
								style={{
									alignItems: 'center',
									flexDirection: 'row',
									marginVertical: 8,
								}}
								onPress={() => _onPressEmailIcon(item.EMAIL)}
							>
								<Image
									source={IC_EMAIL}
									resizeMode="contain"
									style={{ width: 24, height: 24, marginRight: 4 }}
								/>
								<Text style={{ fontWeight: '500' }}>{item.EMAIL}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									alignItems: 'center',
									flexDirection: 'row',
								}}
								onPress={() => _onPressPhoneIcon(item.CP_NM)}
							>
								<Image
									source={IC_PHONE}
									resizeMode="contain"
									style={{ width: 24, height: 24, marginRight: 4 }}
								/>
								<Text style={{ fontWeight: '500' }}>{item.TNO}</Text>
							</TouchableOpacity>
						</View>
					</Card>
				)}
			/>
		</View>
	);
}
