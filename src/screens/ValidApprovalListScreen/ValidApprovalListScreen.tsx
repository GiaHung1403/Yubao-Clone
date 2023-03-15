import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
	Animated,
	FlatList,
	Image,
	InteractionManager,
	Platform,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {
	Button,
	Card,
	Chip,
	IconButton,
	Searchbar,
	useTheme,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { ValidApprovalItem } from './ValidApprovalItem';
import ValidApprovalFilterModal from './ValidApprovalFilterModal';
import Color from '@config/Color';

import {
	fromDateValidAtom,
	textAPNOAtom,
	textCNIDAtom,
	textcustomerNameAtom,
	toDateValidAtom,
	typeValidAprvAtom,
} from 'atoms/valid_aprv.atom';
import { useAtom } from 'jotai';
import { getList_Valid_Aprv } from '@data/api';
import { IUserSystem } from '@models/types';
import moment from 'moment';

import ListFilterButton from './ListFillterButton';

export function ValidApprovalListScreen(props: any) {
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(true);
	const [listValidAprv, setListValidAprv] = useState<any[]>([{}]);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { colors } = useTheme();

	//Atom
	const [firstQuery, setFirstQuery] = useAtom(textcustomerNameAtom);
	const [CNID] = useAtom(textCNIDAtom);
	const [APNO] = useAtom(textAPNOAtom);
	const [filterSelected] = useAtom(typeValidAprvAtom);
	const [fromDate] = useAtom(fromDateValidAtom);
	const [toDate] = useAtom(toDateValidAtom);

	const hideModal = useRef<any>();

	const _onOpenModal = () => hideModal.current.showModal(true);
	const _onCloseModal = () => hideModal.current.showModal(false);
	useEffect(() => {
		return () => {
			setListValidAprv([{}]);
			setDoneLoadAnimated(false);
		};
	}, []);

	useEffect(() => {
		const timeOutSearch = setTimeout(() => onRefresh(filterSelected), 500);
		return () => clearTimeout(timeOutSearch);
	}, [firstQuery, APNO, CNID, fromDate, toDate]);

	// console.log('render list');

	const onRefresh = async item => {
		setDoneLoadAnimated(true);
		const data: any = await getList_Valid_Aprv({
			User_ID: '00426', //dataUserSystem.EMP_NO,
			fromDate: moment(fromDate).format('DDMMYYYY'),
			toDate: moment(toDate).format('DDMMYYYY'),
			CustomerName: firstQuery,
			APNO: APNO,
			CNID: CNID,
			Valid_Type: item,
		});
		setListValidAprv(data);
		setDoneLoadAnimated(false);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Valid Approval'} />
			</View>
			<View
				style={{
					flex: 1,
				}}
			>
				<View style={{ paddingVertical: 8 }}>
					<Searchbar
						placeholder={'Customer Name'}
						onChangeText={query => setFirstQuery(query)}
						value={firstQuery}
						style={{ elevation: 2, marginHorizontal: 8 }}
						inputStyle={{ fontSize: 13 }}
					/>

					<View
						style={{
							flexDirection: 'row',
							marginTop: 8,
							marginLeft: 8,
						}}
					>
						<Card elevation={2}>
							<IconButton
								icon="filter-outline"
								color={Color.main}
								size={20}
								onPress={() => {
									setTimeout(() => {
										hideModal.current.showModal(true);
									}, 100);
								}}
							/>
						</Card>
						<ListFilterButton onRefresh={onRefresh} />
					</View>
				</View>
				{!doneLoadAnimated ? (
					<FlatList
						keyboardShouldPersistTaps="handled"
						style={{ paddingTop: 8 }}
						data={listValidAprv.slice(0, 10)}
						keyExtractor={(_, index) => index.toString()}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={doneLoadAnimated}
								onRefresh={() => onRefresh(filterSelected)}
							/>
						}
						showsVerticalScrollIndicator={false}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<ValidApprovalItem
								dataItem={item}
								onFilter={() => onRefresh(filterSelected)}
							/>
						)}
					/>
				) : (
					<LoadingFullScreen size={'large'} />
				)}
			</View>
			<ValidApprovalFilterModal
				ref={ref => {
					hideModal.current = ref;
				}}
				onClose={_onCloseModal}
				// hideModal={hideModal}
				onOpen={_onOpenModal}
				onFilter={onRefresh}
			/>
		</View>
	);
}
