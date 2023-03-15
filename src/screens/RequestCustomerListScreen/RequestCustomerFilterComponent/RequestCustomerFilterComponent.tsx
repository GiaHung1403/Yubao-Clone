import {AntDesign, Ionicons} from "@expo/vector-icons";
import {Icon} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import {Button, Card , useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {getAssetCheckingRequests} from "@actions/request_customer_action";
import ButtonChooseDateTime from "@components/ButtonChooseDateTime";
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Colors from '@config/Color';
import {IUserSystem} from '@models/types';
import moment from "moment";

const anime = {
    height: new Animated.Value(0),
    contentHeight: 180,
};

let listener = '';

const listStatus: any = [
    {label: 'Choose', value: '0'},
    {label: '2 - In progress', value: '1'},
];

export default function RequestCustomerFilterComponent(props: any) {
    const dateTimePickerRef = useRef<any>(null);
    const dispatch = useDispatch();
    const dataUserSystem: IUserSystem = useSelector(
        (state: any) => state.auth_reducer.dataUserSystem,
    );

    const {colors} = useTheme()
    const [showView, setShowView] = useState(false);
    const [fromDate, setFromDate] = useState(moment().subtract(7, 'days').toDate());
    const [toDate, setToDate] = useState(moment().toDate());
    const [statusFilter, setStatusFilter] = useState('0');
    const [subjectFilter, setSubjectFilter] = useState('');

    useEffect(() => {
        dispatch(getAssetCheckingRequests({User_ID: dataUserSystem?.EMP_NO, Password: ""}));

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
            dispatch(getAssetCheckingRequests({User_ID: dataUserSystem?.EMP_NO, Password: ""}));
        }, 400)
    };

    return (
			<Card elevation={4} style={{ padding: 8 }}>
				{/* View Choose Date */}
				<View
					style={{
						flexDirection: 'row',
					}}
				>
					<ButtonChooseDateTime
						label={'From'}
						modalMode={'date'}
						valueDisplay={moment(fromDate).format('DD/MM/YYYY')}
						value={fromDate}
						onHandleConfirmDate={setFromDate}
						containerStyle={{ flex: 1 }}
					/>

					<ButtonChooseDateTime
						label={'To'}
						modalMode={'date'}
						valueDisplay={moment(toDate).format('DD/MM/YYYY')}
						value={toDate}
						onHandleConfirmDate={setToDate}
						containerStyle={{ flex: 1, marginLeft: 8 }}
					/>
				</View>

				<Animated.View
					style={{ height: anime.height }}
					onLayout={_initContentHeight}
				>
					{/* View Status and OnTime */}
					{showView && (
						<View
							style={{
								flexDirection: 'row',
								marginTop: 16,
							}}
						>
							<PickerCustomComponent
								showLabel={true}
								listData={listStatus}
								label="Status"
								value={statusFilter}
								style={{ flex: 1, marginRight: 8 }}
								onValueChange={text => setStatusFilter(text)}
							/>

							<TextInputCustomComponent
								label="ID"
								placeholder="ID"
								value={subjectFilter}
								onChangeText={(text: string) => setSubjectFilter(text)}
								style={{ flex: 1 }}
							/>
						</View>
					)}

					{showView && (
						<TextInputCustomComponent
							label="Customer Name"
							placeholder="Customer Name"
							value={subjectFilter}
							onChangeText={(text: string) => setSubjectFilter(text)}
							style={{ flex: 1, marginTop: 16 }}
						/>
					)}
				</Animated.View>

				<Button
					mode="contained"
					uppercase={false}
					style={{ margin: 8, marginTop: 16, width: 100, alignSelf: 'center' }}
					onPress={() => _onPressFilter()}
				>
					Search
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
