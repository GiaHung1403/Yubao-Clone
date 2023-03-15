import React, { useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	Image,
	InteractionManager,
	Linking,
	Platform,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from 'react-native-paper';
import LoadingFullScreen from '@components/LoadingFullScreen';
import NoDataComponent from '@components/NoDataComponent';
import Colors from '@config/Color';
import { getContactPerson } from '@data/api';
import { IContactPerson, IUserSystem } from '@models/types';

const IC_EMAIL = require('@assets/icons/ic_email.png');
const IC_PHONE = require('@assets/icons/ic_phone.png');

export default function ContactPersonComponent(props: any) {
	const { leseID, hasContact } = props;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [listContactPerson, setListContactPerson] = useState<IContactPerson[]>(
		[],
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);

			if (hasContact) {
				const responseContactPerson: any = await getContactPerson({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					LeseID: leseID,
				});
				setListContactPerson(responseContactPerson);
			}
		});
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

	return doneLoadAnimated ? (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<FlatList
				data={listContactPerson}
				keyExtractor={(_, index) => index.toString()}
				contentContainerStyle={{ flexGrow: 1 }}
				ListEmptyComponent={() => (
					<NoDataComponent type={hasContact ? 'Denied' : 'Empty'} />
				)}
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
								{item.cP_NM}
							</Text>
							<TouchableOpacity
								style={{
									alignItems: 'center',
									flexDirection: 'row',
									marginVertical: 8,
								}}
								onPress={() => _onPressEmailIcon(item.email)}
							>
								<Image
									source={IC_EMAIL}
									resizeMode="contain"
									style={{ width: 24, height: 24, marginRight: 4 }}
								/>
								<Text style={{ fontWeight: '500' }}>{item.email}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									alignItems: 'center',
									flexDirection: 'row',
								}}
								onPress={() => _onPressPhoneIcon(item.cP_NM)}
							>
								<Image
									source={IC_PHONE}
									resizeMode="contain"
									style={{ width: 24, height: 24, marginRight: 4 }}
								/>
								<Text style={{ fontWeight: '500' }}>{item.tno}</Text>
							</TouchableOpacity>
						</View>
					</Card>
				)}
			/>
		</View>
	) : (
		<LoadingFullScreen />
	);
}
