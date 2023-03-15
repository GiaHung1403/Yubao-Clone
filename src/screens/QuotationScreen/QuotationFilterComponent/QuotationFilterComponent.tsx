import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListQuotation } from '@actions/quotation_action';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { getListSubTeam, getListTeamMember } from '@data/api';
import { ISubTeam, ITeamMember, IUserSystem } from '@models/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import EventEmitter from '@utils/events';

let timeNow = new Date();
let timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() - 7),
);

const anime = {
	height: new Animated.Value(0),
	contentHeight: 250,
};

let listener = '';

const listConfirmYN: any = [
	{ label: 'All', value: '2' },
	{ label: 'Yes', value: '1' },
	{ label: 'No', value: '0' },
];

export default function QuotationFilterComponent(props: any) {
	const dispatch = useDispatch();
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { colors } = useTheme();

	const [showView, setShowView] = useState(false);
	const [fromDate, setFromDate] = useState(timeFrom);
	const [toDate, setToDate] = useState(timeNow);
	const [quotationIDFilter, setQuotationIDFilter] = useState('');
	const [branchFilter, setBranchFilter] = useState('-1');
	const [customerIDFilter, setCustomerIDFilter] = useState('');
	const [customerNameFilter, setCustomerNameFilter] = useState('');
	const [marketingTeamFilter, setMarketingTeamFilter] = useState('');
	const [marketingOfficerFilter, setMarketingOfficerFilter] = useState(
		dataUserSystem.EMP_NO,
	);
	const [confirmYNFilter, setConfirmYNFilter] = useState('2');
	const [listMarketingTeam, setListMarketingTeam] = useState<ISubTeam[]>([]);
	const [listMarketingOfficer, setListMarketingOfficer] = useState<
		ITeamMember[]
	>([]);

	useEffect(() => {
		(async function getDataMarketingTeam() {
			const responseSubTeam: any = await getListSubTeam({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				Dept_Code: dataUserSystem.DEPT_CODE,
				KEY_DATA_EXT1: 'PGLNSL002',
			});

			const listMarketingTeamMap = responseSubTeam.map((team: ISubTeam) => ({
				label: team.STND_C_NM,
				value: team.SubTeam,
			}));

			setListMarketingTeam(listMarketingTeamMap);
			setMarketingTeamFilter(
				listMarketingTeamMap.length > 0 ? listMarketingTeamMap[0].value : '',
			);
		})();
		return () => anime.height.removeListener(listener);
	}, []);

	EventEmitter.addEventListener('onRefreshQuotation', () => _onPressFilter());

	useEffect(() => {
		const willFocusSubscription = navigation.addListener('focus', async () => {
			try {
				_onPressFilter();
			} catch (error) {
				console.log('inside error');
				console.log(error);
			} finally {
			}
		});
		return willFocusSubscription;
	}, [navigation, fromDate, toDate]);

	useEffect(() => {
		(async function getDataMarketingOfficer() {
			if (marketingTeamFilter) {
				const responseTeamMember: any = await getListTeamMember({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					Sub_Team_Code: marketingTeamFilter,
					Dept_Code: dataUserSystem.DEPT_CODE,
					KEY_DATA_EXT1: 'PGLNSL002',
				});

				const listMarketingOfficerMap = responseTeamMember.map(
					(member: ITeamMember) => ({
						label: member.EMPNM,
						value: member.EMP_NO,
					}),
				);
				setListMarketingOfficer(listMarketingOfficerMap);
				setMarketingOfficerFilter(listMarketingOfficerMap[0].value);
			}
		})();
	}, [marketingTeamFilter]);

	useEffect(() => {
		dispatch(
			getListQuotation({
				FROM_DATE: moment(fromDate).format('DDMMYYYY'),
				TO_DATE: moment(toDate).format('DDMMYYYY'),
				KEY_ID: quotationIDFilter,
				LESE_ID: customerIDFilter,
				LS_NM: customerNameFilter,
				SUB_TEAM: marketingTeamFilter,
				MK_EMP_NO: marketingOfficerFilter,
				CONFIRM_YN: confirmYNFilter,
				BRANCH_CODE: branchFilter,
			}),
		);
	}, [marketingOfficerFilter]);

	const _initContentHeight = evt => {
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

		if (showView) {
			setShowView(false);
		}

		listener = anime.height.addListener(async ({ value }) => {
			if (value === anime.contentHeight && !showView) {
				setShowView(true);
				return;
			}
		});
	};

	const _onPressFilter = () => {
		// toggle();
		if (showView) {
			Animated.timing(anime.height, {
				toValue: _getMinValue(),
				duration: 300,
				useNativeDriver: false,
			}).start();
		}
		if (showView) {
			setShowView(false);
		}
		setTimeout(() => {
			dispatch(
				getListQuotation({
					FROM_DATE: moment(fromDate).format('DDMMYYYY'),
					TO_DATE: moment(toDate).format('DDMMYYYY'),
					KEY_ID: quotationIDFilter,
					LESE_ID: customerIDFilter,
					LS_NM: customerNameFilter,
					SUB_TEAM: marketingTeamFilter,
					MK_EMP_NO: marketingOfficerFilter,
					CONFIRM_YN: confirmYNFilter,
					BRANCH_CODE: branchFilter,
				}),
			);
		}, 400);
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
					label={'From'}
					modalMode={'date'}
					valueDisplay={moment(fromDate).format('DD/MM/YYYY')}
					value={fromDate}
					onHandleConfirmDate={setFromDate}
					containerStyle={{ flex: 1, marginRight: 8 }}
				/>

				<ButtonChooseDateTime
					label={'To'}
					modalMode={'date'}
					valueDisplay={moment(toDate).format('DD/MM/YYYY')}
					value={toDate}
					onHandleConfirmDate={setToDate}
					containerStyle={{ flex: 1 }}
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
							label="Quotation ID"
							placeholder="Quotation ID"
							value={quotationIDFilter}
							onChangeText={(text: string) => setQuotationIDFilter(text)}
							style={{ flex: 1, marginRight: 8 }}
						/>
						<PickerCustomComponent
							showLabel={true}
							listData={listConfirmYN}
							label="Confirm Y/N"
							value={confirmYNFilter}
							style={{ flex: 1 }}
							onValueChange={text => setConfirmYNFilter(text)}
						/>
					</View>
				)}

				{/* View Customer ID and Customer Name */}
				{showView && (
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							marginTop: 8,
						}}
					>
						<TextInputCustomComponent
							label="Customer ID"
							placeholder="Customer ID"
							value={customerIDFilter}
							onChangeText={(text: string) => setCustomerIDFilter(text)}
							style={{ flex: 1, marginRight: 8 }}
						/>
						<TextInputCustomComponent
							label="Customer Name"
							placeholder="Customer Name"
							value={customerNameFilter}
							onChangeText={(text: string) => setCustomerNameFilter(text)}
							style={{ flex: 1 }}
						/>
					</View>
				)}

				{/* View Choose Marketing Team and Marketing Officer */}
				{showView && (
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							marginTop: 8,
						}}
					>
						{/*TODO: max width*/}
						<PickerCustomComponent
							showLabel={true}
							listData={listMarketingTeam}
							label="Marketing Team"
							value={marketingTeamFilter}
							style={{ flex: 1, marginRight: 8 }}
							onValueChange={text => setMarketingTeamFilter(text)}
						/>

						<PickerCustomComponent
							showLabel={true}
							listData={listMarketingOfficer}
							label="Marketing Officer"
							value={marketingOfficerFilter}
							style={{ flex: 1 }}
							onValueChange={text => setMarketingOfficerFilter(text)}
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
