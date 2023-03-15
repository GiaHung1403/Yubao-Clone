import React, { useEffect, useState } from 'react';
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

import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

interface IContactReducer {
	listContact: IContact[];
	departmentSelected: IDepartment;
}

import { getDomainAPIChat } from '@data/Constants';
const ListInviteComponent = (props: any) => {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const [textQuery, setTextQuery] = useState<string>('');
	const listUserInvited: ISpotlight[] = useSelector(
		(state: any) => state.room_rc_reducer.listUserInvited,
	);
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	const { listContact, departmentSelected }: IContactReducer = useSelector(
		(state: any) => state.contact_reducer,
	);

	const { buttonRemove } = props;

	return (
		<View>
			<FlatList
				style={{ paddingHorizontal: 8, paddingTop: 4 }}
				horizontal
				keyExtractor={(_, index) => index.toString()}
				keyboardShouldPersistTaps="handled"
				data={listUserInvited}
				ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
				renderItem={({ item, index }) => (
					<View>
						<TouchableOpacity
							key={index.toString()}
							style={{
								paddingVertical: 8,
								marginRight: 8,
								flexDirection: 'row',
								alignItems: 'center',
							}}
							onPress={() => {
								dispatch(removeUserInvitedRC({ index }));
								buttonRemove(item);
							}}
						>
							<View
								style={{
									backgroundColor: colors.primary,
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: 50,
									flexDirection: 'row',
									paddingVertical: 8,
									paddingHorizontal: 16,
								}}
							>
								<Avatar.Image
									source={{
										uri: `${getDomainAPIChat()}/avatar/${
											item.username
										}?size=60&format=png`,
									}}
									size={20}
									style={{ backgroundColor: '#fff' }}
								/>
								<Text
									style={{
										color: '#fff',
										marginLeft: 8,
									}}
								>
									{item?.name}
								</Text>
								<Icon
									as={Ionicons}
									name="close-outline"
									size={6}
									style={{
										marginLeft: 5,
										alignSelf: 'center',
										marginRight: -5,
									}}
									color={'#666'}
								/>
							</View>
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
};
export default ListInviteComponent;
