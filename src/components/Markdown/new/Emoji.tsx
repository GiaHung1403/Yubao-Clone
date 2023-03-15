import React, { useContext } from 'react';
import { Text } from 'react-native';
import { Emoji as EmojiProps } from '@rocket.chat/message-parser';

import shortnameToUnicode from '@utils/shortnameToUnicode';
import styles from '../styles';
import CustomEmoji from '../../EmojiPicker/CustomEmoji';
import MarkdownContext from './MarkdownContext';
import { DOMAIN_SERVER_CHAT } from '@data/Constants';

interface IEmojiProps {
	value: EmojiProps['value'];
	isBigEmoji?: boolean;
	shortCode?: string;
	unicode?: string;
}

const Emoji = ({
	value,
	isBigEmoji,
	shortCode,
	unicode,
}: IEmojiProps): JSX.Element => {
	const emojiUnicode =
		unicode || shortnameToUnicode(`:${shortCode}:` || `:${value?.value}:`);
	const emoji = value?.value.includes('custom')
		? { content: value.value, name: value.value, extension: 'png' }
		: undefined;

	if (emoji) {
		return (
			<CustomEmoji
				baseUrl={DOMAIN_SERVER_CHAT}
				style={[isBigEmoji ? styles.customEmojiBig : styles.customEmoji]}
				emoji={emoji}
			/>
		);
	}
	return (
		<Text
			style={[{ color: '#2f343d' }, isBigEmoji ? styles.textBig : styles.text]}
		>
			{emojiUnicode}
		</Text>
	);
};

export default Emoji;
