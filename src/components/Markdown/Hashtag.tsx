import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

import { IUserChannel } from './interfaces';
import styles from './styles';

interface IHashtag {
	hashtag: string;
	navToRoomInfo?: Function;
	style?: StyleProp<TextStyle>[];
	channels?: IUserChannel[];
}

const Hashtag = React.memo(
	({ hashtag, channels, navToRoomInfo, style = [] }: IHashtag) => {
		const handlePress = () => {
			const index = channels?.findIndex(channel => channel.name === hashtag);
			if (index && navToRoomInfo) {
				const navParam = {
					t: 'c',
					rid: channels?.[index]._id,
				};
				navToRoomInfo(navParam);
			}
		};

		if (
			channels &&
			channels.length &&
			channels.findIndex(channel => channel.name === hashtag) !== -1
		) {
			return (
				<Text
					style={[
						styles.mention,
						{
							color: '#F3BE08',
						},
						...style,
					]}
					onPress={handlePress}
				>
					{`#${hashtag}`}
				</Text>
			);
		}
		return (
			<Text
				style={[styles.text, { color: '#2f343d' }, ...style]}
			>{`#${hashtag}`}</Text>
		);
	},
);

export default Hashtag;
