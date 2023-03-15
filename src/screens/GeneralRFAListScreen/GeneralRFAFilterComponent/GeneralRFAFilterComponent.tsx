import Color from "@config/Color";
import {Ionicons} from "@expo/vector-icons";
import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Animated, InteractionManager, TouchableOpacity, View} from 'react-native';
import {Button, Card,useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {getListGeneralRFA} from "@actions/general_rfa_action";
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import {IUserSystem} from '@models/types';
import {convertUnixTimeDDMMYYYY} from '@utils';

interface IDataPicker {
    value: number | string;
    label: string;
}

const timeNow = new Date();
const timeFrom = new Date(
    new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()),
);
const timeTo = new Date();

const anime = {
    height: new Animated.Value(0),
    contentHeight: 100,
};

let listener = '';

export default function GeneralRFAFilterComponent(props: any) {
    const dispatch = useDispatch();
    const dataUserSystem: IUserSystem = useSelector(
        (state: any) => state.auth_reducer.dataUserSystem,
    );

    const [showView, setShowView] = useState(false);
    const [fromDate, setFromDate] = useState(timeFrom);
    const [toDate, setToDate] = useState(timeTo);
    const [reqId, setReqId] = useState('');
    const [subject, setSubject] = useState('');
    const{colors} = useTheme()

    useEffect(() => {
        InteractionManager.runAfterInteractions(async () => {
            dispatch(getListGeneralRFA({
                User_ID: dataUserSystem.EMP_NO,
                fromDate,
                toDate,
                REQ_ID: reqId,
                Subj: subject
            }));
        });

        listener = anime.height.addListener(async ({value}) => {
            if (value === anime.contentHeight && !showView) {
                setShowView(true);
            } else {
                setShowView(false);
            }
        });

        return () => {
            anime.height.removeListener(listener);
            anime.height.setValue(_getMinValue());
        };
    }, []);

    const _initContentHeight = (evt) => {
        if (anime.contentHeight > 0) {
            return;
        }
        anime.contentHeight = evt.nativeEvent.layout.height;
        anime.height.setValue(showView ? _getMaxValue() : _getMinValue());
    };

    const _getMaxValue = () => {
        return anime.contentHeight;
    };

    const _getMinValue = () => {
        return 0;
    };

    const toggle = () => {
        Animated.timing(anime.height, {
            toValue: showView ? _getMinValue() : _getMaxValue(),
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const _onPressFilter = () => {
        if (showView) {
            Animated.timing(anime.height, {
                toValue: _getMinValue(),
                duration: 300,
                useNativeDriver: false,
            }).start();
        }

        setTimeout(() => {
            dispatch(getListGeneralRFA({
                User_ID: dataUserSystem.EMP_NO,
                fromDate,
                toDate,
                REQ_ID: reqId,
                Subj: subject
            }));
        }, 400)
    };

    return (
        <Card elevation={4}>
            {/* View Choose Date */}
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 8,
                    paddingHorizontal: 8,
                }}
            >
                <ButtonChooseDateTime
                    label={'From date'}
                    valueDisplay={convertUnixTimeDDMMYYYY(fromDate.getTime() / 1000)}
                    value={fromDate}
                    modalMode={'date'}
                    onHandleConfirmDate={setFromDate}
                    containerStyle={{flex: 1}}
                />

                <ButtonChooseDateTime
                    label={'To date'}
                    valueDisplay={convertUnixTimeDDMMYYYY(toDate.getTime() / 1000)}
                    value={toDate}
                    modalMode={'date'}
                    onHandleConfirmDate={setToDate}
                    containerStyle={{flex: 1, marginLeft: 8}}
                />
            </View>

            <Animated.View
                style={{height: anime.height}}
                onLayout={_initContentHeight}
            >
                {/* View Subject and Choose Branch */}
                {showView && (
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 8,
                            marginTop: 8,
                        }}
                    >
                        <TextInputCustomComponent
                            label="Request ID"
                            placeholder="Request ID"
                            value={reqId}
                            onChangeText={(text: string) => setReqId(text)}
                            style={{flex: 1, marginRight: 8}}
                        />

                        <TextInputCustomComponent
                            label="Subject"
                            placeholder="Subject"
                            value={subject}
                            onChangeText={(text: string) => setSubject(text)}
                            style={{flex: 1}}
                        />
                    </View>
                )}
            </Animated.View>

            <Button
                mode="contained"
                uppercase={false}
                style={{margin: 8, width: 100, alignSelf: 'center'}}
                onPress={() => _onPressFilter()}
            >
                Filter
            </Button>

            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 8,
                }}
                onPress={() => toggle()}
            >
                <Icon
                    as={Ionicons}
                    name={showView ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={7}
                    color={colors.primary}
                />
            </TouchableOpacity>
        </Card>
    );
}
