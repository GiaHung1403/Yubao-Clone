import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Animated, InteractionManager, TouchableOpacity, View} from 'react-native';
import {Button, Card,useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {getListBookMeeting, getListMeetingRoom} from "@actions/book_meeting_action";
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';

import {Ionicons} from "@expo/vector-icons";
import {IBranch, ICar, IUserSystem} from '@models/types';
import {convertUnixTimeDDMMYYYY, convertUnixTimeNoSpace} from '@utils';

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

export default function BookMeetingFilterComponent(props: any) {
    const dispatch = useDispatch();
    const dataUserSystem: IUserSystem = useSelector(
        (state: any) => state.auth_reducer.dataUserSystem,
    );
    const {colors} = useTheme()

    const {listMeetingRoom} = useSelector(
        (state: any) => state.book_meeting_reducer,
    );

    const [showView, setShowView] = useState(false);
    const [fromDate, setFromDate] = useState(timeFrom);
    const [toDate, setToDate] = useState(timeTo);
    const [bookingIDFilter, setBookingIDFilter] = useState('');
    const [roomFilterSelected, setRoomFilterSelected] = useState("");

    useEffect(() => {
        InteractionManager.runAfterInteractions(async () => {
            dispatch(getListMeetingRoom({
                User_ID: dataUserSystem.EMP_NO,
                Password: "",
                branchID: dataUserSystem.BRANCH_CODE,
            }))

            dispatch(getListBookMeeting({
                User_ID: dataUserSystem.EMP_NO,
                Password: '',
                fromDate: convertUnixTimeNoSpace(fromDate.getTime() / 1000),
                toDate: convertUnixTimeNoSpace(toDate.getTime() / 1000),
                branchID: dataUserSystem.BRANCH_CODE,
                roomID: roomFilterSelected,
                bookingID: bookingIDFilter,
                meetingContent: ""
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
            dispatch(getListBookMeeting({
                User_ID: dataUserSystem.EMP_NO,
                Password: '',
                fromDate: convertUnixTimeNoSpace(fromDate.getTime() / 1000),
                toDate: convertUnixTimeNoSpace(toDate.getTime() / 1000),
                branchID: dataUserSystem.BRANCH_CODE,
                roomID: roomFilterSelected,
                bookingID: bookingIDFilter,
                meetingContent: ""
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
						containerStyle={{ flex: 1 }}
					/>

					<ButtonChooseDateTime
						label={'To date'}
						valueDisplay={convertUnixTimeDDMMYYYY(toDate.getTime() / 1000)}
						value={toDate}
						modalMode={'date'}
						onHandleConfirmDate={setToDate}
						containerStyle={{ flex: 1, marginLeft: 8 }}
					/>
				</View>

				<Animated.View
					style={{ height: anime.height }}
					onLayout={_initContentHeight}
				>
					{/* View Quotation ID and Choose Branch */}
					{showView && (
						<View
							style={{
								flexDirection: 'row',
								paddingHorizontal: 8,
								marginTop: 8,
							}}
						>
							<TextInputCustomComponent
								label="Booking ID"
								placeholder="Booking ID"
								value={bookingIDFilter}
								onChangeText={(text: string) => setBookingIDFilter(text)}
								style={{ flex: 1, marginRight: 8 }}
							/>
							<PickerCustomComponent
								showLabel={true}
								listData={listMeetingRoom}
								label="Meeting Room"
								value={roomFilterSelected}
								style={{ flex: 1 }}
								textStyle={{ maxWidth: 120 }}
								onValueChange={text => setRoomFilterSelected(text)}
							/>
						</View>
					)}
				</Animated.View>

				<Button
					mode="contained"
					uppercase={false}
					style={{ margin: 8, width: 100, alignSelf: 'center' }}
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
