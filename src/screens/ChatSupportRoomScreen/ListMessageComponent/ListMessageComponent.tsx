import React, {
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	Platform,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { hasNotch } from 'react-native-device-info';
import MessageItemComponent from '../MessageItemComponent';
import firestore from '@react-native-firebase/firestore';

let newListMessage : any ;

const ListMessageComponent = (props: any) => {
	const { listMessage, userName } = props;
	const renderItem = ({ item, index }) => {
		return (
			<MessageItemComponent
				listMessage={item}
				nextMessage={listMessage[index + 1]}
				userName={userName}
				//   index={index}
				//   room={room}
				//   prevItem={listMessage[index - 1]}
				//   nextItem={listMessage[index + 1]}
				//   onSwipeLeft={_onSwipeLeft}
				//   setItemMessageSelected={setItemMessageSelected}
				//   onPressReactionList={_onPressReactionList}
				//   onPressReaction={_onPressReaction}
				//   onPressQuoteMessage={_onPressQuoteMessage}
				//   onPressDeleteMessage={_onPressDeleteMessage}
				//   onPressUpdateMessage={_onPressUpdateMessage}
				//   onPressCopy={_onPressCopy}
				//   onPressPin={_onPressPin}
				//   imageViewerRef={imageViewerRef}
			/>
			// null
		);
	};
  if(listMessage !== undefined){
		 newListMessage = [...listMessage.reverse()];
	}
  else newListMessage = []

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				style={{ flex: 1, marginTop: hasNotch() ? 44 : 12 }}
				data={newListMessage}
				extraData={newListMessage}
				inverted
				showsVerticalScrollIndicator={false}
				// keyExtractor={(item, index) => index}
				removeClippedSubviews={Platform.OS === 'ios'}
				initialNumToRender={5}
				onEndReachedThreshold={0.5}
				maxToRenderPerBatch={5}
				windowSize={11}
				// keyboardShouldPersistTaps={'handled'}
				ListHeaderComponent={() => <View style={{ height: 4 }} />}
				renderItem={renderItem}
				// keyboardShouldPersistTaps="handled"
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="none"
			/>
		</View>
	);
};

export default ListMessageComponent;
