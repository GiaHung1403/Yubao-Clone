import React from 'react';
import { Text } from 'react-native';

import styles from './styles';
import { events, logEvent } from '../../utils/log';
import Color from '@config/Color';

interface IAtMention {
	mention: string;
	username?: string;
	navToRoomInfo?: Function;
	style?: any;
	useRealName?: boolean;
	mentions: any;
}

const AtMention = React.memo(
	({
		mention,
		mentions,
		username,
		navToRoomInfo,
		style = [],
		useRealName,
	}: IAtMention) => {
		if (mention === 'all' || mention === 'here') {
			return (
				<Text
					style={[
						styles.mention,
						{
							color: '#F38C39',
						},
						...style,
					]}
				>
					{mention}
				</Text>
			);
		}

		let mentionStyle = {};
		if (mention === username) {
			mentionStyle = {
				color: '#F3BE08',
			};
		} else {
			mentionStyle = {
				color: '#F3BE08',
			};
		}

		const user = mentions?.find?.((m: any) => m && m.username === mention);

		const handlePress = () => {
			// const navParam = {
			// 	t: 'd',
			// 	rid: user && user._id,
			// };

			if (navToRoomInfo) {
				navToRoomInfo(user?.username);
			}
		};

		if (user) {
			return (
				<Text
					style={[styles.mention, mentionStyle, ...style]}
					onPress={handlePress}
				>
					{useRealName && user.name ? user.name : user.username}
				</Text>
			);
		}

		return (
			<Text
				style={[styles.text, { color: '#2f343d' }, ...style]}
			>{`@${mention}`}</Text>
		);
	},
);

export default AtMention;
