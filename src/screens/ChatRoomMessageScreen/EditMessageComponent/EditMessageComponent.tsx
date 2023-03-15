import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { IMemberRoom, IMessage } from '../../../models/types';
import { Ionicons } from '@expo/vector-icons';
import { DOMAIN_SERVER_CHAT } from '@data/Constants';
import { useSelector } from 'react-redux';
import EventEmitter from '@utils/events';

// let listRoomMember: IMemberRoom[];
// let itemMessageSelected: IMessage;
interface IProps {
	onPressCancelEdit: () => void;
}

export default function EditMessageComponent(props: IProps) {
	const { onPressCancelEdit } = props;
	const [isEditMessage, setEditMessage] = useState<boolean>(false);
	const [itemMessageSelected, setItemMessageSelected] = useState<IMessage>();
	const checkQuote = message => {
		if (message?.includes('[ ]')) {
			const temp = message.split(')');
			return temp[1];
		} else {
			return message;
		}
	};

	const { dataUserRC } = useSelector((state: any) => state.auth_reducer);

	EventEmitter.addEventListener('showEdit', item => {
		setItemMessageSelected(item?.itemMessageSelected);
		setEditMessage(item?.value);
	});

	return isEditMessage && itemMessageSelected ? (
		itemMessageSelected!.attachments?.length > 0 &&
		itemMessageSelected?.msg === '' ? (
			<View style={{ padding: 8 }}>
				<View
					style={{
						paddingHorizontal: 8,
						borderLeftColor: '#2c82c9',
						borderLeftWidth: 2,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<View style={{ flex: 1 }}>
						<Text style={{ fontSize: 13 }}>Edit Message</Text>
						<View>
							<Image
								source={{
									uri: `${DOMAIN_SERVER_CHAT}${itemMessageSelected?.attachments[0]?.image_url}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
								}}
								style={{ height: 100, width: 100 }}
							/>
						</View>
						<View></View>
					</View>

					<TouchableOpacity
						style={{
							paddingLeft: 16,
							paddingVertical: 4,
						}}
						onPress={onPressCancelEdit}
					>
						<Icon as={Ionicons} name="close" size={18} />
					</TouchableOpacity>
				</View>
			</View>
		) : (
			<View style={{ padding: 8 }}>
				<View
					style={{
						paddingHorizontal: 8,
						borderLeftColor: '#2c82c9',
						borderLeftWidth: 2,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<View style={{ flex: 1 }}>
						<Text style={{ fontSize: 13 }}>Edit Message</Text>
						<Text
							style={{ marginTop: 8, color: '#666', fontSize: 12 }}
							numberOfLines={1}
						>
							{itemMessageSelected?.msg.trim()}
						</Text>
					</View>

					<TouchableOpacity
						style={{
							paddingLeft: 16,
							paddingVertical: 4,
						}}
						onPress={onPressCancelEdit}
					>
						<Icon as={Ionicons} name="close" size={18} />
					</TouchableOpacity>
				</View>
			</View>
		)
	) : null;
}
