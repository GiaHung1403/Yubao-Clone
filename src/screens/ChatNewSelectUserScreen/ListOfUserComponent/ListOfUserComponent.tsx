import React, { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Avatar, Card, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
	addUserInvitedRC,
	removeUserInvitedRC,
	removeAllUserInvitedRC,
} from '@actions/room_rc_action';
import Header from '@components/Header';
import Color from '@config/Color';
import {
	IContact,
	IDepartment,
	ISpotlight,
	ISubTeam,
	IUserLoginRC,
	IUserSystem,
} from '@models/types';
import { RoomType } from '@models/RoomTypeEnum';

import { DOMAIN_SERVER_CHAT, getDomainAPIChat } from '@data/Constants';
import { getSpotlight } from '@data/api';
import { useNavigation } from '@react-navigation/native';

interface IContactReducer {
	listContact: IContact[];
	departmentSelected: IDepartment;
}

const ListOfUserComponent = () => {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const [textQuery, setTextQuery] = useState<string>('');
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const listInvite: any = useRef<any[]>([]);

	const { listContact, departmentSelected }: IContactReducer = useSelector(
		(state: any) => state.contact_reducer,
	);

	const checkInvite = item => {
		if (
			listInvite.current?.filter(user => item?.username === user?.username)
				.length === 1
		) {
			return true;
		}

		return false;
	};

	const getUserInfor = item => {
		(async function search() {
			const mergerSpotlight: any = await getSpotlight({
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
				query: `@${item}`,
			});
			if (!checkInvite(mergerSpotlight[0])) {
				dispatch(addUserInvitedRC({ user: [mergerSpotlight[0]] }));
				listInvite?.current.push(mergerSpotlight[0]);
			}
		})();
	};

	return (
		<View>
			<FlatList
				style={{ paddingHorizontal: 8, paddingTop: 4 }}
				keyExtractor={(_, index) => index.toString()}
				keyboardShouldPersistTaps="handled"
				data={listContact}
				ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
				renderItem={({ item, index }) => (
					<Card style={{ marginTop: 4 }}>
						<TouchableOpacity
							style={{
								padding: 8,
								flexDirection: 'row',
								alignItems: 'center',
							}}
							onPress={() => {
								getUserInfor(item?.emp_no);
							}}
						>
							<Avatar.Image
								source={{
									uri: `${getDomainAPIChat()}/avatar/${
										item?.emp_no
									}?size=60&format=png`,
								}}
								size={40}
							/>
							<Text style={{ marginLeft: 8 }}>{item?.emp_nm}</Text>
						</TouchableOpacity>
					</Card>
				)}
			/>
		</View>
	);
};

export default ListOfUserComponent;
