import { getInsuranceContracts } from '@actions/insurance_action';
import AvatarBorder from '@components/AvatarBorder';
import Header from '@components/Header';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import { InsuranceContractType } from '@models/InsuranceContractEnum';
import { IInsuranceContract, IUserSystem } from '@models/types';
import { useNavigation } from '@react-navigation/native';
import { callPhoneDefault } from '@utils/callPhone';
import { formatVND } from '@utils/formatMoney';
import {
	fromDateInsuranceAtom,
	keyQueryInsuranceAtom,
	toDateInsuranceAtom,
	typeInsuranceAtom,
} from 'atoms/insurance-support.atom';
import { useAtom } from 'jotai';
import moment from 'moment';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	Card,
	Chip,
	IconButton,
	Searchbar,
	useTheme,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

interface IProps {}
interface IInsuranceReducer {
	insuranceContracts: IInsuranceContract[];
	loading: boolean;
}

const listFilterChip = [
	{ id: InsuranceContractType.ALL, label: 'Contracts', icon: 'file-outline' },
	{
		id: InsuranceContractType.FOLLOWING,
		label: 'Following',
		icon: 'focus-auto',
	},
	{
		id: InsuranceContractType.NOT_YET_RENEW,
		label: 'Not yet renew',
		icon: 'alarm-off',
	},
];

const listContractType = {
	'01': 'Leased',
	'02': 'Mortgage Asset',
	'03': 'Leased/Mortgage Asset',
	'04': 'Non-Leased Asset',
	'05': 'Guarantor Ins',
	'06': 'Guarantor Ins Ver2',
	'99': 'Life',
};

function HightLightTextComponent({ label, value, colorValue }) {
	return (
		<View
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				flex: 1,
			}}
		>
			<Text
				style={{
					color: '#666666',
					fontSize: 12,
					marginBottom: 4,
				}}
			>
				{label}
			</Text>
			<Text
				style={{
					fontWeight: '600',
					color: colorValue,
				}}
			>
				{value}
			</Text>
		</View>
	);
}

function ItemInsuranceContract({
	contract,
	onPressItem,
}: {
	contract: IInsuranceContract;
	onPressItem: () => void;
}) {
	const _onPressEmailIcon = (email?: string) => {
		Linking.openURL(`mailto:${email}`)
			.then()
			.catch(err => Alert.alert('Thông báo', err.message));
	};

	return (
		<Card
			elevation={1}
			style={{
				marginBottom: 8,
				marginHorizontal: 8,
				padding: 8,
			}}
			onPress={onPressItem}
		>
			<Text
				style={{
					marginBottom: 8,
					color: Color.approved,
					fontWeight: '600',
				}}
			>
				{contract.LS_NM}
			</Text>

			<View style={{ marginBottom: 8, flexDirection: 'row' }}>
				<TextInfoRow
					icon={'barcode-outline'}
					value={`${contract.INSR_NO}`}
					styleValue={{}}
					containerStyle={{
						flex: 2,
					}}
				/>
				<TextInfoRow
					icon={'briefcase-outline'}
					isIconRight
					value={contract.INSR_CODE}
					styleValue={{}}
					containerStyle={{
						flex: 1,
					}}
				/>
			</View>

			<View style={{ marginBottom: 8, flexDirection: 'row' }}>
				<TextInfoRow
					icon={'document-text-outline'}
					value={`${contract.APNO}`}
					styleValue={{}}
					containerStyle={{
						flex: 1,
					}}
				/>
				<TextInfoRow
					icon={'pricetag-outline'}
					isIconRight
					value={listContractType[contract.CONTRACT_TP]}
					styleValue={{}}
					containerStyle={{
						flex: 1,
					}}
				/>
			</View>

			<View style={{ marginBottom: 8, flexDirection: 'row' }}>
				<TextInfoRow
					icon={'cash-outline'}
					value={`${formatVND(contract.INSR_AMT)} ${contract.CUR_C}`}
					styleValue={{ color: Color.main, fontWeight: '600' }}
					containerStyle={{
						flex: 1,
					}}
				/>
			</View>

			<View
				style={{
					flexDirection: 'row',
					backgroundColor: `${Color.main}30`,
					padding: 8,
					borderRadius: 4,
					marginBottom: 12,
				}}
			>
				<HightLightTextComponent
					label="Insured Date"
					value={moment(contract.INSR_DATE).format('DD/MM/YYYY')}
					colorValue={Color.approved}
				/>

				<HightLightTextComponent
					label="Expired Date"
					value={moment(contract.INSR_MTRT).format('DD/MM/YYYY')}
					colorValue={'orange'}
				/>
			</View>

			{/* Guarantor Information */}
			{['05', '06'].includes(contract.CONTRACT_TP) ? (
				<View style={{ marginBottom: 8 }}>
					<Text
						style={{
							marginBottom: 4,
							// fontWeight: '600',
							color: Color.draft,
							fontSize: 12,
						}}
					>
						Guarantor Information
					</Text>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: `${Color.approved}30`,
							padding: 8,
							borderRadius: 4,
						}}
					>
						<View style={{ flexDirection: 'row', marginRight: 8 }}>
							<AvatarBorder username={contract.CP_NM || 'A'} size={35} />
							<View
								style={{
									marginLeft: 8,
									justifyContent: 'space-between',
									marginVertical: 2,
								}}
							>
								<Text style={{ marginBottom: 4 }}>{contract.CP_NM}</Text>
								<Text>{contract.IDNO}</Text>
							</View>
						</View>
					</View>
				</View>
			) : null}

			{/* Contact person */}
			<View style={{ marginBottom: 8 }}>
				<Text
					style={{
						marginBottom: 4,
						// fontWeight: '600',
						color: Color.draft,
						fontSize: 12,
					}}
				>
					Contact Person
				</Text>
				<View
					style={{
						flexDirection: 'row',
						backgroundColor: `${Color.status}30`,
						padding: 8,
						borderRadius: 4,
						alignItems: 'center',
					}}
				>
					<AvatarBorder username={contract.IMG} size={35} />
					<View
						style={{
							marginLeft: 8,
							marginVertical: 2,
							flex: 1,
						}}
					>
						<Text style={{ marginBottom: 4 }}>{contract.CONTACT_NM}</Text>
						<Text>{contract.EMAIL}</Text>
					</View>

					<View
						style={{
							padding: 8,
							backgroundColor: '#fff',
							borderRadius: 20,
							marginRight: 8,
							marginLeft: 4,
						}}
					>
						<Icon
							as={Ionicons}
							name="call-outline"
							color={Color.main}
							size={5}
							onPress={() => callPhoneDefault(`02873016010,${contract?.EXT}`)}
						/>
					</View>

					<View
						style={{
							padding: 8,
							backgroundColor: '#fff',
							borderRadius: 20,
						}}
					>
						<Icon
							as={Ionicons}
							name="mail-outline"
							color={Color.main}
							size={5}
							onPress={() => _onPressEmailIcon(contract.EMAIL)}
						/>
					</View>
				</View>
			</View>

			{/* Hotline insurance company */}
			<View>
				<Text
					style={{
						marginBottom: 4,
						// fontWeight: '600',
						color: Color.draft,
						fontSize: 12,
					}}
				>
					Hotline insurance company
				</Text>

				<TouchableOpacity
					style={{ flexDirection: 'row', alignItems: 'center' }}
					onPress={() => callPhoneDefault(contract.HOTLINE)}
					disabled={!contract.HOTLINE}
				>
					<View
						style={{
							padding: 8,
							backgroundColor: `${Color.main}30`,
							borderRadius: 20,
							marginRight: 8,
						}}
					>
						<Icon
							as={Ionicons}
							name="call-outline"
							color={Color.main}
							size={5}
						/>
					</View>

					<Text>{contract.HOTLINE || 'Not available'}</Text>
				</TouchableOpacity>
			</View>
		</Card>
	);
}

export function InsuranceSupportScreen(props: IProps) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { insuranceContracts, loading }: IInsuranceReducer = useSelector(
		(state: any) => state.insurance_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	const [filterSelected, setFilterSelected] = useAtom(typeInsuranceAtom);
	const [fromDate] = useAtom(fromDateInsuranceAtom);
	const [toDate] = useAtom(toDateInsuranceAtom);
	const [firstQuery, setFirstQuery] = useAtom(keyQueryInsuranceAtom);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	/* Query when key in search and choose filter  */
	useEffect(() => {
		if (firstQuery) {
			const timeOutSearch = setTimeout(() => {
				const fromDefault = moment().subtract(1, 'years');
				const timeDiff = fromDate.diff(fromDefault, 'days');
				let fromDateFilter = timeDiff < 0 ? fromDate : fromDefault;

				if (timeDiff === 0) {
					if (filterSelected === InsuranceContractType.FOLLOWING) {
						fromDateFilter = moment().add(1, 'months');
					}

					if (filterSelected === InsuranceContractType.NOT_YET_RENEW) {
						fromDateFilter = moment().subtract(1, 'months');
					}
				}

				dispatch(
					getInsuranceContracts({
						userId: dataUserSystem.EMP_NO,
						fromDate: fromDateFilter.format('DDMMYYYY'),
						toDate: toDate.format('DDMMYYYY'),
						searchKey: firstQuery,
						filter: filterSelected,
					}),
				);
			}, 500);

			return () => clearTimeout(timeOutSearch);
		} else {
			let fromDateFilter = moment().subtract(1, 'months');
			let toDateFilter = toDate;

			if (filterSelected === InsuranceContractType.FOLLOWING) {
				fromDateFilter = moment();
				toDateFilter = moment().add(1, 'months');
			}

			if (filterSelected === InsuranceContractType.NOT_YET_RENEW) {
				fromDateFilter = moment().subtract(1, 'months');
				toDateFilter = moment();
			}

			dispatch(
				getInsuranceContracts({
					userId: dataUserSystem.EMP_NO,
					fromDate: fromDateFilter.format('DDMMYYYY'),
					toDate: toDateFilter.format('DDMMYYYY'),
					searchKey: firstQuery,
					filter: filterSelected,
				}),
			);
		}
	}, [firstQuery, fromDate, toDate, filterSelected]);

	const getDataInsuranceContracts = ({ searchKey, filter }) => {
		dispatch(
			getInsuranceContracts({
				userId: dataUserSystem.EMP_NO,
				fromDate,
				toDate,
				searchKey,
				filter,
			}),
		);
	};

	const _onPressFilter = () => {
		navigation.navigate({ name: 'InsuranceFilterModal' });
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Insurance Support'} />
			</View>

			<View style={{ paddingVertical: 8 }}>
				<Searchbar
					placeholder={'Search Ins Contract by Plate No, LA'}
					onChangeText={setFirstQuery}
					value={firstQuery}
					style={{ elevation: 2, marginHorizontal: 8 }}
					inputStyle={{ fontSize: 13 }}
				/>

				<View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 8 }}>
					<Card elevation={2}>
						<IconButton
							icon="filter-outline"
							color={Color.main}
							size={20}
							onPress={_onPressFilter}
						/>
					</Card>

					<ScrollView
						style={{
							paddingLeft: 8,
							flexDirection: 'row',
							alignSelf: 'center',
						}}
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						{listFilterChip.map(item => {
							const isSelected = filterSelected == item.id;
							return (
								<View key={item.id} style={{ marginRight: 8 }}>
									<Chip
										icon={item.icon}
										selected={isSelected}
										style={
											isSelected ? { backgroundColor: `${Color.main}30` } : {}
										}
										onPress={() => setFilterSelected(item.id)}
									>
										{item.label}
									</Chip>
								</View>
							);
						})}
					</ScrollView>
				</View>
			</View>

			<View style={{ flex: 1 }}>
				{doneLoadAnimated ? (
					<FlatList
						data={insuranceContracts}
						style={{ flex: 1 }}
						keyExtractor={(_, index) => index.toString()}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={() => null}
							/>
						}
						ListFooterComponent={() => <View style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<ItemInsuranceContract
								contract={item}
								onPressItem={() =>
									navigation.navigate('InsuranceSupportDetailScreen', {
										ins_apNo: item.INSR_APNO,
										notice_no: item.NOTICE_NO,
										apno: item.APNO,
										isIndividual: ['05', '06'].includes(item.CONTRACT_TP),
									})
								}
							/>
						)}
					/>
				) : null}
			</View>
		</View>
	);
}
