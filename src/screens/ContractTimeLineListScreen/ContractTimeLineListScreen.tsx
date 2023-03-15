import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	Keyboard,
	SafeAreaView,
	View,
} from 'react-native';
import { FAB, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Header from '@components/Header';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { IContractTimeline, IUserSystem } from '@models/types';
import ContractTimeLineComponent from './ContractTimeLineComponent';
import TimeLineFilterComponent from './TimeLineFilterComponent/TimeLineFilterComponent';
import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';

interface IContract_TimelineReducer {
	listContractTimeline: IContractTimeline[];
	loading: boolean;
}

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()),
);

export function ContractTimeLineListScreen(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const route = useRoute();
	const dispatch = useDispatch();
	// const [loading, setLoading] = useState(false);

	const { listContractTimeline, loading }: IContract_TimelineReducer =
		useSelector((state: any) => state.contract_timeline_reducer);

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	const I18n = useContext(LocalizationContext);
	const textCustomerList = 'Contract Timeline';
	const textSearch = 'Search by Name, CNID';

	const [fromDate, setFromDate] = useState(timeFrom);
	const [toDate, setToDate] = useState(timeNow);

	const isVN = I18n.locale === 'vi';

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			!loading ? setDoneLoadAnimated(true) : setDoneLoadAnimated(false);
		});
	}, [loading]);

	// const onRefresh = async () => {
	// 	setTimeout(
	// 		() =>
	// 			dispatch(
	// 				getListContract_Timeline({
	// 					// emp_No: '00048',
	// 					// s_Start_Date: '01112022',
	// 					// s_End_Date: '01112022',
	// 					// cnid: '',
	// 					// apno: '',
	// 					// customerName: '',
	// 					emp_No: '00048',
	// 					s_Start_Date: moment(fromDate).format('DDMMYYYY'),
	// 					s_End_Date: moment(toDate).format('DDMMYYYY'),
	// 					cnid: CNID,
	// 					apno: contractNo,
	// 					customerName: customerName,
	// 				}),
	// 			),
	// 		400,
	// 	);
	// };

	const _onPressItem = (item: IContractTimeline) => {
		Keyboard.dismiss();
		['Step 4', 'Step 9'].includes(item.prg_step)
			? navigation.navigate('ContractTimeLineDetailScreen', {
					contractInfo: item,
					step: item.prg_step.split(' ')[1],
			  })
			: navigation.navigate('FullListContractTimeLineScreen', {
					contractInfo: item,
			  });
		//  : Alert.alert('Alert', 'Comming Soon!!!');

		return;
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={textCustomerList} />
			</View>

			<View style={{ flex: 1 }}>
				<View style={{ marginHorizontal: 8, zIndex: 2, marginTop: 8 }}>
					<TimeLineFilterComponent
						fromDate={fromDate}
						toDate={toDate}
						onSetFromDate={date => setFromDate(date)}
						onSetToDate={date => setToDate(date)}
					/>
				</View>

				{doneLoadAnimated ? (
					<FlatList
						keyboardShouldPersistTaps="handled"
						style={{ paddingTop: 8 }}
						data={listContractTimeline}
						keyExtractor={(_, index) => index.toString()}
						// refreshControl={
						// 	<RefreshControl
						// 		tintColor={colors.primary}
						// 		colors={[colors.primary, Color.waiting, Color.approved]}
						// 		refreshing={loading}
						// 		onRefresh={onRefresh}
						// 	/>
						// }
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<ContractTimeLineComponent
								dataItem={item}
								onPressItem={() => _onPressItem(item)}
								step={index}
							/>
						)}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View>
		</View>
	);
}
