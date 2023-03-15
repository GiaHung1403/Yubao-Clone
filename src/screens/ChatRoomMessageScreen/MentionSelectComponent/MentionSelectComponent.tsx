import { getDomainAPIChat } from '@data/Constants';
import React, { useImperativeHandle, useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';

import { IMemberRoom } from '@models/types';
import EventEmitter from '@utils/events';

interface IProps {
//   listRoomMember: IMemberRoom[];
  onPressItem: (item: IMemberRoom) => void;
}

export default function MentionSelectComponent(props: IProps, ref: any) {
	const { onPressItem } = props;
	const [listRoomMemberFilter, setListRoomMemberFilter] = useState<[IMemberRoom]>();
	// useImperativeHandle(ref, () => ({
	// 	onShowViewer: (imageURL, messageItem) => {
	// 		setVisible(true);
	// 	},
	// }));

	EventEmitter.addEventListener('showMention', item =>{
		setListRoomMemberFilter(item?.listRoomMember);
	})

	return listRoomMemberFilter?.length > 0 ? (
		<ScrollView
			style={{
				padding: 8,
				maxHeight: 120,
				borderBottomColor: '#ddd',
				borderBottomWidth: 1,
			}}
		>
			{listRoomMemberFilter?.map((member, index) => (
				<TouchableOpacity
					key={index.toString()}
					style={{
						flexDirection: 'row',
						paddingBottom: index < listRoomMemberFilter.length - 1 ? 16 : 8,
					}}
					onPress={() => {onPressItem(member);setListRoomMemberFilter([])}}
				>
					<Avatar.Image
						source={{
							uri: `${getDomainAPIChat()}/avatar/${
								member.username
							}?size=60&format=png`,
						}}
						size={20}
						style={{ backgroundColor: '#fff', marginRight: 8 }}
					/>
					<Text style={{ fontWeight: '500', color: '#555' }}>
						{member.name}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	) : null;
}
