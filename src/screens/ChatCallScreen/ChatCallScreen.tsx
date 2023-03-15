import { getDomainAPIChat } from '@data/Constants';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, InteractionManager, StatusBar, View } from 'react-native';
// @ts-ignore
// import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';

import LoadingFullScreen from '@components/LoadingFullScreen';
import { RocketChat } from '@data/rocketchat';

export function ChatCallScreen(props: any) {
	const navigation: any = useNavigation();
	let jitsiTimeout;
	const { isVideoCall, username, roomID } = props.route.params;

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});

		// return () => JitsiMeet.endCall();
	}, []);

	useEffect(() => {
		if (doneLoadAnimated) {
			(async function callVideo() {
				const url = await jitsiURL({ rid: roomID });
				const userInfo = {
					displayName: username,
					avatar: `${getDomainAPIChat()}/avatar/${username}?size=100&format=png`,
				};

				// if (isVideoCall) {
				//   JitsiMeet.call(url, userInfo);
				// } else {
				//   JitsiMeet.audioCall(url, userInfo);
				// }

				/* You can also use JitsiMeet.audioCall(url) for audio only call */
				/* You can programmatically end the call with JitsiMeet.endCall() */
			})();
		}
	}, [doneLoadAnimated]);

	const onConferenceTerminated = nativeEvent => {
		if (jitsiTimeout) {
			clearInterval(jitsiTimeout);
		}
		navigation.goBack();
	};

	const onConferenceJoined = nativeEvent => {
		/* Conference joined event */
		RocketChat.updateJitsiTimeout({ roomID }).catch(e =>
			Alert.alert('Error', e.data.error),
		);
		if (jitsiTimeout) {
			clearInterval(jitsiTimeout);
		}
		jitsiTimeout = setInterval(() => {
			RocketChat.updateJitsiTimeout({ roomID }).catch(e =>
				Alert.alert('Error', e.data.error),
			);
		}, 10000);
	};

	const onConferenceWillJoin = nativeEvent => {
		/* Conference will join event */
	};

	const jitsiURL = ({ rid }) => {
		const domain = `meet.jit.si/`;
		const prefix = 'RocketChat';
		const uniqueIdentifier = '765hrokeourxjqpNu';
		const protocol = 'https://';

		const queryString = '';
		// if (Jitsi_Enabled_TokenAuth) {
		//   try {
		//     const accessToken = await this.methodCallWrapper('jitsi:generateAccessToken', rid);
		//     queryString = `?jwt=${ accessToken }`;
		//   } catch (e: any) {
		//     console.log(e);
		//   }
		// }

		return `${protocol}${domain}${prefix}${uniqueIdentifier}${rid}${queryString}`;
	};

	return (
		<View style={{ backgroundColor: 'black', flex: 1 }}>
			<StatusBar hidden={false} translucent backgroundColor="transparent" />
			{/*{doneLoadAnimated ? <JitsiMeetView*/}
			{/*  onConferenceTerminated={onConferenceTerminated}*/}
			{/*  onConferenceJoined={onConferenceJoined}*/}
			{/*  onConferenceWillJoin={onConferenceWillJoin}*/}
			{/*  style={{ flex: 1, height: '100%', width: '100%' }}*/}
			{/*/> : <LoadingFullScreen/>}*/}
		</View>
	);
}
