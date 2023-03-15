import { getDomainAPIChat } from '@data/Constants';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Avatar, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '@components/Header';
import { RocketChat } from '@data/rocketchat';
import { IRoom, IUserSystem } from '@models/types';

interface IRouteParams {
	room: IRoom;
}

export function ChatRoomInfoScreen(props: any) {
	const { room }: IRouteParams = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	useEffect(() => {
		(async function getData() {
			const data: any = await RocketChat.getRoomInfo({ roomId: room.rid });
		})();
	}, []);

	// useEffect(() => {
	//   RocketChat.updateCustomFieldRoom({
	//     roomType: room.t,
	//     roomId: room.rid,
	//     customFields:
	//         {
	//           color: '#6CB374',
	//           name: 'Test Delete User',
	//           avatar: 'http://125.212.249.189:3000/avatar/00678.Ngo.Thanh.Tuan',
	//         },
	//   });
	// }, []);

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Room Info" />
			</View>

			<View style={{ flex: 1 }}>
				<View style={{ alignItems: 'center', padding: 20 }}>
					<Avatar.Image
						source={{
							uri: `${getDomainAPIChat()}/avatar/room/${
								room?.rid
							}?size=60&format=png`,
						}}
						size={60}
						style={{ marginHorizontal: 16 }}
					/>
					<Text style={{ marginTop: 20, fontSize: 16, fontWeight: '600' }}>
						{room?.fname || room?.name}
					</Text>
				</View>

				<View style={{ padding: 8, flex: 1 }}>
					<TextInput
						mode="outlined"
						label="Branch"
						value={room?.customFields?.toString()}
						placeholder="Branch"
						style={{ marginBottom: 16, height: 40 }}
					/>
				</View>
			</View>
		</View>
	);
}
