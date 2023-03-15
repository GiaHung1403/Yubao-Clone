import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    View,
} from 'react-native';

import {
    Notification,
    NotificationCompletion,
    Notifications,
} from 'react-native-notifications';
import {Card} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import uuid from 'uuid';

import {setNumberMessageUnread} from '@actions/room_rc_action';
import AsyncStorage from '@data/local/AsyncStorage';
import {Ionicons} from "@expo/vector-icons";

const LOGO = require('@assets/logo.png');

const getNewUuid = () => uuid.v4().toLowerCase();
const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

export default function BannerNotification(props: any) {
    const dispatch = useDispatch();
    const [visibleBanner, setVisibleBanner] = useState<boolean>(false);
    const [notificationBanner, setNotificationBanner] = useState<any>({
        body:
            'Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.',
        message: 'Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.',
        title: 'Message Test Nhé',
    });
    const [heldCalls, setHeldCalls] = useState({}); // callKeep uuid: held
    const [calls, setCalls] = useState({});

    const dataUser = useSelector((state: any) => state.auth_reducer.data);

    useEffect(() => {
        (async function setupCallKeep() {
            const isFirstTimeUsing = await AsyncStorage.getIsFirstTimeUsing();
            // if (!isFirstTimeUsing) {

            //     await RNCallKeep.setup({
            //         ios: {
            //             appName: 'Yubao',
            //         },
            //         android: {
            //             alertTitle: 'Permissions required',
            //             alertDescription: 'This application needs to access your phone accounts',
            //             cancelButton: 'Cancel',
            //             okButton: 'ok',
            //             additionalPermissions: [''],
            //         },
            //     });
            //     return;
            // }

            setTimeout(() => {
                // JitsiMeet.call('https://meet.jit.si/configFirstTime');
            }, 10000);

            // setTimeout(async () => {
            //     // JitsiMeet.endCall();


            //     await RNCallKeep.setup({
            //         ios: {
            //             appName: 'Yubao',
            //         },
            //         android: {
            //             alertTitle: 'Permissions required',
            //             alertDescription: 'This application needs to access your phone accounts',
            //             cancelButton: 'Cancel',
            //             okButton: 'ok',
            //             additionalPermissions: [''],
            //         },
            //     });
            // }, 12000);

        })();

        Notifications.events().registerNotificationReceivedForeground(
            (
                notification: Notification,
                completion: (response: NotificationCompletion) => void,
            ) => {
                /* Nếu là thông báo gửi từ rocket sẽ kèm theo cái ejson => set lại số tin chưa đọc */
                // if (notification.payload.ejson) {
                //     dispatch(setNumberMessageUnread({count: 1}));

                //     const ejson = JSON.parse(notification.payload.ejson);
                //     if (ejson.messageType === 'jitsi_call_started') {
                //         AsyncStorage.setRoomIDVideoCall(ejson.rid).then();
                //         displayIncomingCallNow();
                //     }
                // }

                if (Platform.OS === 'ios') {
                    // PushNotificationIOS.setApplicationIconBadgeNumber(numberUnread + 1);
                    setNotificationBanner(notification);
                } else {
                    setNotificationBanner(notification.payload);
                }

                setVisibleBanner(true);

                setTimeout(() => {
                    setVisibleBanner(false);
                }, 3000);

                // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
                completion({alert: true, sound: true, badge: false});
            },
        );

        return () => {
            Notifications.removeAllDeliveredNotifications();
        };
    }, []);

    // const addCall = (callUUID, numberNew) => {
    //     setHeldCalls({...heldCalls, [callUUID]: false});
    //     setCalls({...calls, [callUUID]: numberNew});
    // };

    // const displayIncomingCall = (numberNew) => {
    //     const callUUID = getNewUuid();
    //     addCall(callUUID, numberNew);
    //     RNCallKeep.displayIncomingCall(callUUID, numberNew, numberNew, 'number', false);
    // };

    // const displayIncomingCallNow = () => {
    //     displayIncomingCall(getRandomNumber());
    // };

    return visibleBanner ? (
        <SafeAreaView
            style={{
                zIndex: 999,
                position: 'absolute',
                top: Platform.OS === 'ios' ? 8 : StatusBar.currentHeight,
                left: 8,
                right: 8,
            }}
        >
            <Card
                elevation={8}
                style={{
                    overflow: 'hidden',
                    borderRadius: 10,
                    backgroundColor: 'rgba(242,242,247,0.95)',
                }}
            >
                <View
                    style={{
                        padding: 8,
                    }}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            source={LOGO}
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 8,
                            }}
                        />

                        <Text style={{fontWeight: '500', color: '#777', flex: 1}}>Chailease</Text>

                        <Icon
                            as={Ionicons}
                            name={'close-outline'}
                            size={7}
                            color={"#777"}
                            onPress={() => setVisibleBanner(false)}
                        />
                    </View>

                    <View style={{justifyContent: 'center', flex: 1, marginTop: 8}}>
                        <Text style={{fontSize: 15, fontWeight: '600', marginBottom: 4}}>
                            {notificationBanner?.title}
                        </Text>
                        <Text numberOfLines={3} style={{color: 'rgba(72,72,74,0.90)'}}>
                            {Platform.OS === 'ios'
                                ? notificationBanner?.body
                                : notificationBanner?.message}
                        </Text>
                    </View>
                </View>
            </Card>

        </SafeAreaView>
    ) : null;
}
