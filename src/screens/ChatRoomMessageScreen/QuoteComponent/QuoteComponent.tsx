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
	onPressCancelQuote: () => void;
}

export default function QuoteComponent(props: IProps) {
	const { onPressCancelQuote } = props;
	const [isQuoteMessage, setQuoteMessage] = useState<boolean>(false);
	const [itemMessageSelected, setItemMessageSelected] = useState<IMessage>();
	const checkQuote = message => {
		if (message?.includes('[ ]')) {
			const temp = message.split(')');
			return temp[1];
		} else {
			return message;
		}
	}

	const { dataUserRC } = useSelector((state: any) => state.auth_reducer);

	EventEmitter.addEventListener('showQuote', item => {
		setItemMessageSelected(item?.itemMessageSelected)
		setQuoteMessage(item?.value);
	});


	return isQuoteMessage && itemMessageSelected ? (
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
						<Text style={{ fontSize: 13 }}>
							Replying to{' '}
							<Text style={{ fontWeight: '600' }}>
								{itemMessageSelected?.u?.name}
							</Text>
						</Text>
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
						onPress={onPressCancelQuote}
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
						<Text style={{ fontSize: 13 }}>
							Replying to{' '}
							<Text style={{ fontWeight: '600' }}>
								{itemMessageSelected?.u?.name}
							</Text>
						</Text>
						<Text
							style={{ marginTop: 8, color: '#666', fontSize: 12 }}
							numberOfLines={1}
						>
							{checkQuote(itemMessageSelected?.msg.trim())}
						</Text>
					</View>

					<TouchableOpacity
						style={{
							paddingLeft: 16,
							paddingVertical: 4,
						}}
						onPress={onPressCancelQuote}
					>
						<Icon as={Ionicons} name="close" size={18} />
					</TouchableOpacity>
				</View>
			</View>
		)
	) : null;
}
