import {Ionicons} from '@expo/vector-icons';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'native-base';
import React, {useContext} from 'react';
import {
    Image,
    ImageBackground,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from 'react-native';
import {Card} from 'react-native-paper';
import {useSelector} from 'react-redux';

import {LocalizationContext} from '@context/LocalizationContext';
import {IUserLoginRC, IUserSystem} from '@models/types';
import {formatVND} from "@utils";
import openLink from "@utils/openLink";
import AvatarBorder from '../AvatarBorder';
import styles from './styles';
import Color from "@config/Color";
import Colors from "@config/Color";

const BANNER1 = require('@assets/banner_tet_2022.png');
const LOGO = require('@assets/logo.png');
const LOGO_TET = require('@assets/logo_tet_2022_2.png');
const LOGO_HODIHUB = require('@assets/logo_hodiHub.png');
const IC_NOTIFICATION = require('@assets/icons/ic_notification_v2.png');
const IC_FEEDBACK = require('@assets/icons/ic_feedback.png');
const IC_CHAICOIN = require('@assets/icons/ic_chaicoin_border.png');

interface IProps {
    style?: any;
    name?: string;
    color?: string;
    email?: string;
    avatar?: string;
    hideWelcome?: boolean;
}

export default function HeaderBanner(props: IProps) {
    const navigation: any = useNavigation();

    const dataUserSystem: IUserSystem = useSelector(
        (state: any) => state.auth_reducer.dataUserSystem,
    );

    const dataUserRC: IUserLoginRC = useSelector(
        (state: any) => state.auth_reducer.dataUserRC,
    );

    const eCoinTotal: IUserLoginRC = useSelector(
        (state: any) => state.e_coin_reducer.eCoinTotal,
    );

    const numberMessageUnread: number = useSelector(
        (state: any) => state.room_rc_reducer.numberMessageUnread,
    );

    const numberNotificationUnread = useSelector(
        (state: any) =>
            (dataUserSystem
                ? state.notification_reducer.numberUnreadNotification
                : 0) + state.notification_reducer.numberUnreadPromotion,
    );

    if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(
            numberNotificationUnread + numberMessageUnread,
        );
    }

    const I18n = useContext(LocalizationContext);
    const textWelcome = I18n.t('welcome');

    const listMenuTab = [
        {
            image: 'book-outline',
            id: 'contact',
            label: 'Contact',
            numberBadge: 0,
        },
        {
            image: 'location-outline',
            id: 'listCustomer',
            label: 'LESDAR',
            numberBadge: 0,
        },
        {
            image: IC_NOTIFICATION,
            id: 'chat',
            label: 'Notification',
            numberBadge: numberMessageUnread,
            withoutLib: true,
        },
        {
            image: 'chatbubbles-outline',
            id: 'chat',
            label: 'Chat',
            numberBadge: numberMessageUnread,
        },

        {
            image: IC_FEEDBACK,
            id: 'feedback',
            label: 'Feedback',
            numberBadge: 0,
            withoutLib: true,
        },
        {
            image: LOGO_HODIHUB,
            id: 'feedback',
            label: 'Hodihub',
            numberBadge: 0,
            withoutLib: true,
            hiddenBg: false
        },
    ];

    const _onPressItemMenuTop = (idMenu: string) => {
        switch (idMenu) {
            case 'feedback':
                navigation.navigate('FeedbackScreen');
                break;
            case 'utils':
                break;
            case 'contact':
                navigation.navigate('ContactScreen');
                break;
            case 'listCustomer':
                navigation.navigate('MapScreen');
                break;
            case 'notification':
                navigation.navigate('NotificationScreen');
                break;
            case 'chat':
                navigation.navigate('ChatRoomListScreen');
                break;
            default:
                break;
        }
    };

    const _onPressInfoUser = () => {
        // navigation.navigate('UserInfoScreen', {userID: dataUserSystem.EMP_NO});
    };

    return (
        <Card elevation={4} style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: Color.main}}>
            {/* View image banner */}
            <StatusBar barStyle="dark-content"/>

            <ImageBackground source={{}} resizeMethod={'resize'}
                             resizeMode="stretch" style={[styles.imageSwiper, {paddingHorizontal: 16}]}>
                <TouchableOpacity
                    style={{}}
                    onPress={_onPressInfoUser}
                >
                    <SafeAreaView style={{flexDirection: "row", alignItems: "center"}}>
                        <AvatarBorder username={dataUserRC?.me.username} size={50}/>

                        <View style={{marginLeft: 8}}>
                            <Text style={{color: "#000", fontWeight: "600"}}>{textWelcome}</Text>
                            {dataUserSystem && (
                                <Text
                                    style={{color: "#fff", fontWeight: "600"}}
                                >{`${dataUserSystem.FST_NM} ${dataUserSystem.LST_NM}`}</Text>
                            )}
                            <View style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                marginTop: 4
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                    onPress={() => navigation.navigate("ECoinScreen")}
                                >

                                    <Image source={IC_CHAICOIN} resizeMode={"contain"}
                                           style={{width: 23, height: 23, marginRight: 4}}/>
                                    <Text style={{
                                        color: "#fdad29",
                                        fontWeight: "700",
                                    }}>{formatVND(eCoinTotal)} point</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Image
                            source={LOGO_TET}
                            resizeMode="contain"
                            style={{width: 200, height: 250, position: "absolute", top: -40, right: -10}}
                        />

                    </SafeAreaView>
                </TouchableOpacity>

            </ImageBackground>

            <View style={{paddingHorizontal: 16, marginTop: 40}}>
                <View style={{flexDirection: "row", marginTop: 8, flexWrap: "wrap"}}>
                    {listMenuTab.slice(0, 4).map((item, index) => (
                        <View key={index.toString()} style={{width: "25%", marginTop: index > 3 ? 16 : 0}}>
                            <TouchableOpacity
                                style={{justifyContent: "center", alignItems: "center"}}
                                onPress={() => _onPressItemMenuTop(item.id)}
                            >
                                <View>
                                    <View style={{
                                        backgroundColor: "#fdad29",
                                        padding: 8,
                                        borderRadius: 10
                                    }}>
                                        {item.withoutLib ? (
                                            <Image
                                                source={item.image}
                                                resizeMode="contain"
                                                style={[styles.imageItemMenuTopNoLib, {tintColor: "#fff"}]}
                                            />
                                        ) : (
                                            <Icon
                                                as={Ionicons}
                                                name={item.image}
                                                size={6}
                                                color={"#fff"}
                                            />
                                        )}
                                    </View>

                                    {item.numberBadge !== 0 && (
                                        <View style={styles.containerNumberBadge}>
                                            <Text style={styles.textNumberBadge}>
                                                {item.numberBadge}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={{color: "#fff", fontSize: 12, fontWeight: "500", marginTop: 4}}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 8,
                    }}
                    onPress={() => null}
                >
                    <Icon
                        as={Ionicons}
                        name={false ? 'chevron-up-outline' : 'chevron-down-outline'}
                        size={7}
                        color={"#fff"}
                    />
                </TouchableOpacity>

            </View>
        </Card>
    );
}
