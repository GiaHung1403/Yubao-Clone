import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';

import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { getNPVDetail } from '@data/api';
import { IUserSystem, IContact } from '@models/types';
import styles from '@screens/HomeScreen/styles';
import { useSelector, useDispatch } from 'react-redux';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { ProgressCircle } from 'react-native-svg-charts';
import moment from 'moment';
import { getListContact } from '@actions/contact_action';
import * as Keychain from 'react-native-keychain';

export function CustomerResourceDetailModal(props: any) {
	const navigation: any = useNavigation();
	const { dataSummaryProgress, Title } = props.route.params;
	const [doneAnimation, setDoneLoadAnimated] = useState<boolean>(false);
	const { colors } = useTheme();
	const { teamMemberSelected, fromDate, toDate, dataDelinquent, dataNPV }: any =
		useSelector((state: any) => state.dashboard_reducer);

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { subTeamSelected } = useSelector(
		(state: any) => state.dashboard_reducer,
	);

	const [listCommencement, setListCommencement] = useState<any[]>([]);

	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);
	const dispatch = useDispatch();

	const renderColumnChart = ({ value, percent, color }) => (
		<View
			style={{
				alignItems: percent ? 'flex-end' : 'flex-start',
				marginRight: percent ? 4 : 0,
			}}
		>
			<Text
				style={{
					fontSize: 11,
					fontWeight: '600',
					color,
				}}
			>
				{value}
			</Text>
			{percent ? (
				<Text
					style={{
						fontSize: 11,
						fontWeight: '600',
						color: colors.primary,
						marginVertical: 2,
					}}
				>
					({percent === Infinity ? 100 : percent}%)
				</Text>
			) : null}

			<View
				style={{
					width: 16,
					height:
						value && parseInt(value, 10) > 0
							? 60 *
									((percent === undefined || percent === Infinity
										? 100
										: percent || 1) /
										100) || 1
							: 1,
					borderRadius: 4,
					backgroundColor: color,
				}}
			/>
		</View>
	);

	useEffect(() => {
		(async function getData() {
			const data: any = await getNPVDetail({
				User_ID: dataUserSystem?.EMP_NO,
				Password: '',
				FROM_DATE: moment(fromDate).format('DDMMYYYY'),
				TO_DATE: moment(toDate).format('DDMMYYYY'),
				Sub_Team: subTeamSelected?.C_NO || 0,
			});

			setListCommencement(data);
			setDoneLoadAnimated(true);
		})();
	}, []);

		useEffect(() => {
			(async function search() {
				const credentials: any = await Keychain.getGenericPassword();
				const { password } = credentials;

				dispatch(
					getListContact({
						User_ID: dataUserSystem.EMP_NO,
						Password: '',
						query: '',
						Dept_Code: '0',
						Branch: '-1',
						subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
					}),
				);
			})();
		}, []);


	const _onPressButtonOK = () => {
		return null;
	};
	const getCreateName = value => {
		let createName: IContact[];
		createName = listContact?.filter(item => item.emp_no.includes(value));
		return createName[0]?.emp_nm;
	};


	const toFixNumber = (value: string) => {
		return Number(parseFloat(value).toFixed(2));
	};

	const renderCardCommenceNPV = ({
		stylesCard,
		iconUrl,
		labelCard,
		value,
		percent,
	}) => {
		const percentFormat = percent === 'NaN' ? '0' : percent;

		return (
			<Card
				elevation={2}
				style={[styles.cardItemCommenceNVP, stylesCard]}
				onPress={() => navigation.navigate('CommenceDetailModal')}
			>
				<View style={styles.containerItemCommenceNPV}>
					<View style={{ alignItems: 'center' }}>
						<Image
							source={{
								uri: iconUrl,
							}}
							resizeMode="contain"
							style={styles.iconCommenceNPV}
						/>

						<Text style={styles.labelCommenceNPV}>{labelCard}</Text>
					</View>

					<View style={styles.viewRightItemCommenceNPV}>
						<View style={styles.viewValueRightItemCommenceNPV}>
							<Text style={styles.textValueRightItemCommenceNPV}>{value}</Text>
							<Text style={styles.textLabelRightItemCommenceNPV}>
								Total Amount
							</Text>
						</View>

						<View style={[styles.viewRightItemCommenceNPV, { marginTop: 20 }]}>
							<Text style={styles.textValueRightItemCommenceNPV}>
								{percentFormat}%
							</Text>
							<Text style={styles.textLabelRightItemCommenceNPV}>Achieved</Text>
						</View>
					</View>
				</View>
			</Card>
		);
	};

	const renderInfoFilterRow = ({ color, label, value }) => (
		<View style={styles.containerInfoFilterRow}>
			<View style={[styles.circleColor, { backgroundColor: color }]} />

			<Text style={styles.textLabelInfoFilter}>
				{label}:{' '}
				<Text style={[styles.textValueInfoFilter, { color }]}>{value}</Text>
			</Text>
		</View>
	);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
			{/* View Header */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: 8,
					borderBottomColor: '#ddd',
					borderBottomWidth: 1,
				}}
			>
				<Button
					uppercase={false}
					style={{}}
					onPress={() => navigation.goBack()}
				>
					Close
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					Customer Resource Detail
				</Text>
				<Button uppercase={false} style={{}} onPress={() => _onPressButtonOK()}>
					{'OK'}
				</Button>
			</View>

			<View style={{ flex: 1 }}>
				<View style={{ padding: 8 }}>
					{renderInfoFilterRow({
						color: colors.primary,
						label: 'Team',
						value:
							(subTeamSelected?.STND_C_NM !== 'Choose' &&
								subTeamSelected?.STND_C_NM) ||
							'Company',
					})}

					{renderInfoFilterRow({
						color: Color.status,
						label: 'MO',
						value:
							!teamMemberSelected || teamMemberSelected?.EMP_NO === '0'
								? 'All Member'
								: teamMemberSelected?.EMPNM,
					})}

					{renderInfoFilterRow({
						color: '#2c82c9',
						label: 'Period',
						value: `${moment(fromDate).format('DD/MM/YYYY')} - ${moment(
							toDate,
						).format('DD/MM/YYYY')}`,
					})}
				</View>

				{/* Card Customer Resource */}
				<Card elevation={2} style={{ marginRight: 8 }}>
					<View style={{ padding: 8 }}>
						<View
							style={{
								marginBottom: 16,
								flexDirection: 'row',
								alignSelf: 'center',
							}}
						>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<View
									style={{
										backgroundColor: colors.primary,
										width: 12,
										height: 12,
										borderRadius: 6,
										marginRight: 8,
									}}
								/>
								<Text style={{ fontSize: 12, color: '#555' }}>
									Old:{' '}
									<Text style={{ fontWeight: 'bold', color: colors.primary }}>
										{dataNPV?.Customer_Old || '0'}%
									</Text>
								</Text>
							</View>

							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginLeft: 16,
								}}
							>
								<View
									style={{
										backgroundColor: '#2c82c9',
										width: 12,
										height: 12,
										borderRadius: 6,
										marginRight: 8,
									}}
								/>
								<Text style={{ fontSize: 12, color: '#555' }}>
									New:{' '}
									<Text style={{ fontWeight: 'bold', color: '#2c82c9' }}>
										{dataNPV?.Customer_New || '0'}%
									</Text>
								</Text>
							</View>
						</View>

						<View style={{}}>
							<ProgressCircle
								style={{ height: 70 }}
								progress={dataNPV?.Customer_Old / 100}
								progressColor={colors.primary}
								backgroundColor="#2c82c9"
								strokeWidth={8}
							/>
						</View>

						<Text style={styles.labelCustomerInsurance}>Customer Resource</Text>
					</View>
				</Card>


			</View>
		</View>
	);
}
