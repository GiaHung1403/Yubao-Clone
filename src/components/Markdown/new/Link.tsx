import React, { useContext, useEffect, useState } from 'react';
import { Image, InteractionManager, Text, View } from 'react-native';
import { Link as LinkProps } from '@rocket.chat/message-parser';

import styles from '../styles';
import I18n from '../../../i18n';
import openLink from '../../../utils/openLink';
import EventEmitter from '../../../utils/events';
import Strike from './Strike';
import Italic from './Italic';
import Bold from './Bold';
import MarkdownContext from './MarkdownContext';
import Color from '@config/Color';
import Clipboard from '@react-native-community/clipboard';
import RNUrlPreview from 'react-native-url-preview';
// import { LinkPreview } from '@flyerhq/react-native-link-preview';

import { getLinkInfor } from '@data/api/api_getLink_Infor';
import ImageAutoSize from '@components/ImageAutoSize';
import { height } from 'styled-system';
import { useSelector } from 'react-redux';
import { LinkPreview } from '@dhaiwat10/react-link-preview';

interface ILinkProps {
	value: LinkProps['value'];
}

const Link = ({ value }: ILinkProps): JSX.Element => {
	const [linkInfo, setLinkInfo] = useState<any>('');
	const { onLinkPress } = useContext(MarkdownContext);
	const { src, label } = value;
	const handlePress = () => {
		if (!src.value) {
			return;
		}
		if (onLinkPress) {
			return onLinkPress(src.value);
		}
		// openLink(src.value);
		getListAssetImage();
	};

	const getListAssetImage = async () => {
		const data: any = await getLinkInfor({ url: src.value });
		setLinkInfo(data?.data);
		// return data;
	};

	const onLongPress = () => {
		Clipboard.setString(src.value);
		EventEmitter.emit('Toast', { message: I18n.t('Copied_to_clipboard') });
	};

	useEffect(() => {
		getListAssetImage();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<Text
				onPress={handlePress}
				onLongPress={onLongPress}
				style={[styles.link, { color: 'orange' }]}
			>
				{(block => {
					switch (block.type) {
						case 'PLAIN_TEXT':
							return block.value;
						case 'STRIKE':
							return <Strike value={block.value} />;
						case 'ITALIC':
							return <Italic value={block.value} />;
						case 'BOLD':
							return <Bold value={block.value} />;
						default:
							return null;
					}
				})(label)}
			</Text>
			{/* <ImageAutoSize uri={'https://i.ytimg.com/vi/7kpreUxmHvA/hqdefault.jpg'} /> */}
			{/* <Image
				// style={{ flex: 1, height: 100 ,flexBasis : 100}}
				style={{ width: '100%', height: 100, resizeMode: 'center' , marginTop: 5}}
				source={{
					uri: linkInfo?.image,
				}}
			/> */}
		</View>
	);
};

export default Link;
