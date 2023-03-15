import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
    Image,
    InteractionManager,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import { useTheme } from "react-native-paper";
import {setDataUserRC, setDataUserSystem} from '@actions/auth_action';
import AvatarBorder from '@components/AvatarBorder';
import Header from '@components/Header';
import Color from "@config/Color";
import {LocalizationContext} from '@context/LocalizationContext';
import {getCheckInTime} from '@data/api';
import {DATE_UPDATE, VERSION_APP_STAFF} from '@data/Constants';
import AsyncStorage from '@data/local/AsyncStorage';
import {RocketChat} from '@data/rocketchat';
import {ITimeCheckIn, IUserLoginRC, IUserSystem} from '@models/types';
import {formatVND} from '@utils';
import checkVersionApp from "@utils/checkVersionApp";
import styles from './styles';
import messaging from '@react-native-firebase/messaging';


const IC_ARROW_RIGHT = require('@assets/icons/ic_arrow_right.png');
const IC_CHECK_IN = require('@assets/icons/ic_check_in.png');
const IC_VERSION = require('@assets/icons/ic_version.png');
const IC_CHAICOIN = require('@assets/icons/ic_chaicoin.png');

interface IAuthReducer {
    dataUserSystem: IUserSystem;
    dataUserRC: IUserLoginRC;
}

const timeNow = new Date();

export function MenuScreen(props: any) {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const{colors} = useTheme()
    const I18n = React.useContext(LocalizationContext);
    const {dataUserSystem, dataUserRC}: IAuthReducer = useSelector(
        (state: any) => state.auth_reducer,
    );

    const eCoinTotal: IUserLoginRC = useSelector(
        (state: any) => state.e_coin_reducer.eCoinTotal,
    );

    const [listCheckInTime, setListCheckInTime] = useState<ITimeCheckIn[]>([]);

    const textAccount = 'Account';
    const textLogout = 'Logout';

    useEffect(() => {
        InteractionManager.runAfterInteractions(async () => {
            const {password}: any = await Keychain.getGenericPassword();

            const responseCheckInTime: any = await getCheckInTime({
                User_ID: dataUserSystem.EMP_NO,
                Password: password,
                fromDate: moment(timeNow).format("DDMMYYYY") ,
                toDate: moment(timeNow).format("DDMMYYYY"),
            });

            setListCheckInTime(responseCheckInTime);
        });

    }, []);

    useEffect(() => {
        if (!dataUserRC && !dataUserSystem) {
            navigation.navigate('LoginScreen');
        }
    }, [dataUserRC, dataUserSystem]);

    const listFeatures = [
        {
            isNewSession: true,
            name: 'User Info',
            image: 'person-outline',
            id: 'userInfo',
        },
        {
            name: 'Setting',
            image: 'settings-outline',
            id: 'setting',
        },
        {
            name: 'Help',
            image: 'help-circle-outline',
            id: 'help',
        },
    ];

    const _onPressItem = (item: any) => {
        switch (item.id) {
            case 'userInfo':
                navigation.navigate('UserInfoScreen', {userID: dataUserSystem.EMP_NO});
                break;
            case 'setting':
                navigation.navigate('SettingScreen');
                break;
            case 'help':
                // navigation.navigate("HelpScreen");
                break;
            default:
                break;
        }
    };

    const _onPressLogout = () => {
        Alert.alert('Alert', 'Are you sure??', [
            {text: 'Cancel'},
            {
                text: 'OK',
                onPress: async () => {
                    const deviceToken = await AsyncStorage.getDeviceTokenRC();
                    try {
                        // FIXME: check why logout show err "You've been logged out by the server. Please log in again."
                        await RocketChat.removePushToken({token: deviceToken});
                        await RocketChat.logout({});
                    } catch (e: any) {
                        Alert.alert('Error', e.message);
                    }

                    await AsyncStorage.logOut();
                    messaging().unsubscribeFromTopic(`user_${dataUserSystem.EMP_NO}`);
                    dispatch(setDataUserSystem({dataUser: null}));
                    dispatch(setDataUserRC({dataUser: null}));
                },
            },
        ]);
    };

    const _onPressTimeCheckIn = () => {
        navigation.navigate('TimeCheckInScreen');
    };

    return (
			<View style={styles.container}>
				<View style={styles.containerHeader}>
					<Header title={textAccount} hiddenBack />
				</View>

				<FlatList
					style={styles.containerList}
					data={listFeatures}
					keyExtractor={(item, index) => item.id}
					extraData={dataUserSystem}
					ListFooterComponent={() => (
						<View>
							<TouchableOpacity
								style={styles.buttonLogout}
								onPress={() => _onPressLogout()}
							>
								<Text style={styles.labelButtonLogout}>{textLogout}</Text>
							</TouchableOpacity>
						</View>
					)}
					ListHeaderComponent={() => (
						<View>
							<TouchableOpacity
								style={styles.containerHeaderList}
								onPress={() =>
									navigation.navigate('UserInfoScreen', {
										userID: dataUserSystem.EMP_NO,
									})
								}
							>
								<AvatarBorder username={dataUserRC?.me.username} size={60} />

								<View style={styles.containerInfoUser}>
									<Text style={styles.textUsername}>
										{dataUserSystem?.FST_NM} {dataUserSystem?.LST_NM}
									</Text>
									<Text style={[styles.textEmail, { color: '#8a8a8a' }]}>
										{dataUserSystem?.EMAIL}
									</Text>
								</View>
							</TouchableOpacity>

							<View
								style={{
									paddingHorizontal: 16,
									paddingVertical: 16,
									backgroundColor: '#fff',
									marginTop: 8,
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<Image
									source={IC_VERSION}
									style={{ width: 30, height: 30, marginRight: 12 }}
									resizeMode="contain"
								/>
								<View style={{ flex: 1 }}>
									<Text style={{ fontSize: 12, color: '#333' }}>
										{`Last update at: ${moment(DATE_UPDATE).format(
											'DD/MM/YYYY',
										)}`}
									</Text>

									<Text style={{ fontSize: 12, color: '#333', marginTop: 4 }}>
										{`Version `}
										<Text style={{ fontWeight: 'bold' }}>
											{VERSION_APP_STAFF}
										</Text>
									</Text>
								</View>

								<TouchableOpacity onPress={async () => await checkVersionApp()}>
									<View
										style={{ justifyContent: 'center', alignItems: 'center' }}
									>
										<Icon
											as={Ionicons}
											name={'sync-outline'}
											size={6}
											color={Color.approved}
										/>
										<Text>Check version</Text>
									</View>
								</TouchableOpacity>
							</View>

							<TouchableOpacity
								style={{
									paddingHorizontal: 16,
									paddingVertical: 8,
									backgroundColor: '#fff',
									marginTop: 8,
									flexDirection: 'row',
									alignItems: 'center',
								}}
								onPress={_onPressTimeCheckIn}
							>
								<Image
									source={IC_CHECK_IN}
									resizeMode="contain"
									style={{ width: 24, height: 24, marginRight: 16 }}
								/>
								<View style={{ flex: 1 }}>
									<View style={{ alignContent: 'center' }}>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													color: '#3e3e3e',
													fontSize: 13,
													minWidth: 120,
												}}
											>
												Check In Time:{' '}
											</Text>
											<Text
												style={{
													fontWeight: '600',
													color: colors.primary,
												}}
											>
												{listCheckInTime?.length > 0
													? listCheckInTime[0].checkin
													: 'No checking!'}
											</Text>
										</View>
									</View>
									<View style={{ alignContent: 'center', marginTop: 8 }}>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													color: '#3e3e3e',
													fontSize: 13,
													minWidth: 120,
												}}
											>
												Check Out Time:{' '}
											</Text>
											<Text
												style={{
													fontWeight: '600',
													color: colors.primary,
												}}
											>
												{listCheckInTime?.length > 0
													? listCheckInTime[0].checkout
													: 'No checking!'}
											</Text>
										</View>
									</View>
								</View>

								<Image
									source={IC_ARROW_RIGHT}
									resizeMode="contain"
									style={styles.iconRightItem}
								/>
							</TouchableOpacity>

							<View
								style={{
									backgroundColor: '#fff',
									marginTop: 8,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<TouchableOpacity
									style={styles.containerItem}
									onPress={() => navigation.navigate('ECoinScreen')}
								>
									<Image
										source={IC_CHAICOIN}
										resizeMode={'contain'}
										style={{ width: 24, height: 24 }}
									/>
									<Text style={styles.textNameItem}>My E-points</Text>

									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Text style={{ fontWeight: '700', color: '#fdad29' }}>
											{formatVND(eCoinTotal)} point
										</Text>
										<Image
											source={IC_ARROW_RIGHT}
											resizeMode="contain"
											style={styles.iconRightItem}
										/>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					)}
					renderItem={({ item, index }) => (
						<View style={{ marginTop: item.isNewSession ? 8 : 0 }}>
							{item.isNewSession ? null : <View style={styles.viewLine} />}

							<TouchableOpacity
								style={styles.containerItem}
								disabled={item.id === 'userInfo' && !dataUserSystem}
								onPress={() => _onPressItem(item)}
							>
								<Icon
									as={Ionicons}
									name={item.image}
									size={7}
									color={'#3e3e3e'}
								/>
								<Text style={styles.textNameItem}>{item.name}</Text>

								<Image
									source={IC_ARROW_RIGHT}
									resizeMode="contain"
									style={styles.iconRightItem}
								/>
							</TouchableOpacity>
						</View>
					)}
				/>
			</View>
		);
}
