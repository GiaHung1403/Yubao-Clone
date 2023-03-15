import {Ionicons} from "@expo/vector-icons";
import {Icon} from 'native-base';
import React, {useRef} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';

import { useTheme } from "react-native-paper";
import Header from '@components/Header';
import Color from '@config/Color';
import {IRoom} from '@models/types';

interface IRouteParams {
    room: IRoom;
}

const LOGO = require('@assets/logo_with_bg.jpg');

export function ChatRoomShareScreen(props: any) {
    const qrCodeRef = useRef<any>();
    const {room}: IRouteParams = props.route.params;
    const {colors} = useTheme()
    const roomIdString = JSON.stringify({roomId: room.rid});

    const shareQRCode = () => {
        qrCodeRef.current.toDataURL((data) => {
            RNFS.writeFile(RNFS.CachesDirectoryPath + `/qrcode-${room.fname}.png`, data, 'base64')
                .then(async (success) => {
                    const options = {
                        title: `Room chat: ${room.fname}`,
                        url: (Platform.OS === 'android' ? 'file://' : '') + RNFS.CachesDirectoryPath + `/qrcode-${room.fname}.png`,
                    };
                    await Share.open(options);
                })
                .then();
        });
    };

    return (
        <View style={{flex: 1}}>
            <View style={{zIndex: 2}}>
                <Header title="Share Room Info"/>
            </View>

            <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 20}}>
                <View style={{marginVertical: 50}}>
                    <QRCode getRef={(c) => (qrCodeRef.current = c)} value={roomIdString} logo={LOGO} size={150}/>
                </View>

                <Text style={{marginTop: 20, color: '#666', textAlign: 'center'}}>
                    Sử dụng chức năng scan QRCode của ứng dụng để tham gia phòng chat nhanh!
                </Text>

                <TouchableOpacity style={{marginTop: 50, alignItems: 'center'}} onPress={shareQRCode}>
                    <Icon as={Ionicons}
                          name={'arrow-redo-outline'}
                          size={7}
                          color={colors.primary}
                    />
                    <Text style={{marginTop: 4, color: '#3e3e3e', fontSize: 12}}>Share QRCode</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
