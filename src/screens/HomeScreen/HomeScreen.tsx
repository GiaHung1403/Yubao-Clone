import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
	Image,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	Animated,
} from 'react-native';
// import RNCallKeep from 'react-native-callkeep';
import {
	NotificationCompletion,
	Notifications,
} from 'react-native-notifications';
import { Card, FAB, useTheme } from 'react-native-paper';
import { ProgressCircle } from 'react-native-svg-charts';
import { useDispatch, useSelector } from 'react-redux';

import {
	getDelinquent,
	getInsuranceInformed,
	getNPV,
	getRecovery,
	getSummaryProgress,
	setSubTeamSelected,
	setTeamMemberSelected,
} from '@actions/dashboard_action';
import { getListRequestEFlow } from '@actions/eFlow_action';
import { getECoinTotal } from '@actions/e_coin_action';
import { getListRoomRC } from '@actions/room_rc_action';
import { getAllUserRC } from '@actions/user_action';
import HeaderBanner from '@components/HeaderBanner';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import {
	getListSubTeam,
	getListTeamMember,
	getEstablished,
	getDOB,
	getDOB_User,
	getDOB_Individual_Customer,
} from '@data/api';
import {
	timeFromFilterDashboardDefault,
	timeToFilterDashboardDefault,
} from '@data/Constants';
import AsyncStorage from '@data/local/AsyncStorage';
import {
	IDelinquent,
	INpv,
	IRecovery,
	ISubTeam,
	ISummaryProgress,
	ITeamMember,
	IUserLoginRC,
	IUserSystem,
} from '@models/types';
import {
	convertUnixTimeDDMMYYYY,
	convertUnixTimeNoSpace,
	formatVND,
} from '@utils';
import checkVersionApp from '@utils/checkVersionApp';
import openLink from '@utils/openLink';
import styles from './styles';
import { getListRequestEReview } from '@actions/eReview_action';
import moment from 'moment';
import { Dimensions } from 'react-native';

interface IDataDashBoard {
	dataSummaryProgress: ISummaryProgress[];
	dataNPV: INpv;
	dataRecovery: IRecovery;
	dataDelinquent: IDelinquent;
	dataInsuranceInformed: { persent_amt: number };
	teamMemberSelected: ITeamMember;
	subTeamSelected: ISubTeam;
	fromDate: Date;
	toDate: Date;
}

interface IPropColumn {
	value: string;
	percent?: number;
	color: string;
}

let listener = '';
const anime = {
	height: new Animated.Value(0),
	contentHeight: 150,
};

let listenerT = '';
const animeT = {
	height: new Animated.Value(0),
	contentHeight: 150,
};

const animeDBO_User = {
	height: new Animated.Value(0),
	contentHeight: 150,
};

export function HomeScreen(props: any) {
	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const I18n = useContext(LocalizationContext);

	const [showView, setShowView] = useState(false);
	const [showView2, setShowView2] = useState(false);

	const [showViewDBO_User, setShowViewDBO_User] = useState(false);

	useEffect(() => {
		return () => anime.height.removeListener(listener);
	}, []);

	const _initContentHeightT = evt => {
		if (animeT.contentHeight > 0) {
			return;
		}
		animeT.contentHeight = evt.nativeEvent.layout.height;
		animeT.height.setValue(showView2 ? _getMaxValue_T() : _getMinValue());
	};

	const _initContentHeight = evt => {
		if (anime.contentHeight > 0) {
			return;
		}
		anime.contentHeight = evt.nativeEvent.layout.height;
		anime.height.setValue(showView ? _getMaxValue() : _getMinValue());
	};

	const _initContentHeightDBO_User = evt => {
		if (animeDBO_User.contentHeight > 0) {
			return;
		}
		animeDBO_User.contentHeight = evt.nativeEvent.layout.height;
		animeDBO_User.height.setValue(
			showViewDBO_User ? _getMaxValue_DBO_Userr() : _getMinValue(),
		);
	};

	const _getMaxValue = () => {
		return anime.contentHeight;
	};

	const _getMaxValue_T = () => {
		return animeT.contentHeight;
	};

	const _getMaxValue_DBO_Userr = () => {
		return animeDBO_User.contentHeight;
	};

	const _getMinValue = () => {
		return 0;
	};

	const toggle = () => {
		setShowView(!showView);
		Animated.timing(anime.height, {
			toValue: showView ? _getMinValue() : _getMaxValue(),
			duration: 300,
			useNativeDriver: false,
		}).start();

		// listener = anime.height.addListener(async ({ value }) => {
		// 	if (value === anime.contentHeight && !showView) {
		// 		setShowView(true);
		// 		return;
		// 	}
		// });
	};

	const toggleT = () => {
		setShowView2(!showView2);
		Animated.timing(animeT.height, {
			toValue: showView2 ? _getMinValue() : _getMaxValue_T(),
			duration: 300,
			useNativeDriver: false,
		}).start();

		// listenerT = animeT.height.addListener(async ({ value }) => {
		// 	if (value === animeT.contentHeight && !showView) {
		// 		setShowView2(true);
		// 		return;
		// 	}
		// });
	};

	const toggleDBO_User = () => {
		setShowViewDBO_User(!showViewDBO_User);
		Animated.timing(animeDBO_User.height, {
			toValue: showViewDBO_User ? _getMinValue() : _getMaxValue_DBO_Userr(),
			duration: 300,
			useNativeDriver: false,
		}).start();

		// listenerT = animeT.height.addListener(async ({ value }) => {
		// 	if (value === animeT.contentHeight && !showView) {
		// 		setShowView2(true);
		// 		return;
		// 	}
		// });
	};

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const [listEstb, setlistEstb] = useState<any>([]);
	const [listDOB, setlistDOB] = useState<any>([]);
	const [listDOB_User, setListDOB_User] = useState<any>([]);

	const {
		dataSummaryProgress,
		dataNPV,
		dataRecovery,
		dataDelinquent,
		dataInsuranceInformed,
		teamMemberSelected,
		subTeamSelected,
		fromDate,
		toDate,
	}: IDataDashBoard = useSelector((state: any) => state.dashboard_reducer);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			// try {
			// 	await checkVersionApp();
			// } catch (e: any) {
			// 	if (__DEV__) {
			// 		console.log(e);
			// 	}
			// }

			(async function getData() {
				const data: any = await getEstablished({
					User_ID: dataUserSystem.EMP_NO,
					Action: 'GetListEstb',
				});
				setlistEstb(data);
				anime.contentHeight = data.length * 83;

				const data2: any =
					teamMemberSelected?.subTeamSelected?.C_NO === 'HCI1-A'
						? await getDOB_Individual_Customer({
								User_ID: dataUserSystem.EMP_NO,
						  })
						: await getDOB({
								User_ID: dataUserSystem.EMP_NO,
								Action: 'GetListBirth',
						  });

				animeT.contentHeight = data2.length * 83;
				setlistDOB(data2);

				const today = new Date();
				const lastDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
				const data3: any = await getDOB_User({
					User_ID: dataUserSystem.EMP_NO,
					Action: 'GetListUserBirthday',
					// KEY_DATA: moment(today).format('DD.MM'),
					KEY_DATA: '',
				});
				let newList;
				if (today.getDate() == 1) {
					newList = data3.filter(
						item => item?.BIRTHDAY.split('.')[0] >= today.getDate(),
					);
				} else {
					newList = data3.filter(
						item => item?.BIRTHDAY.split('.')[0] >= lastDay.getDate(),
					);
				}
				newList.sort(
					(a, b) =>
						(a.BIRTHDAY.split('.')[0] as any) -
						(b.BIRTHDAY.split('.')[0] as any),
				);
				animeDBO_User.contentHeight = newList.length * 60;
				setListDOB_User(newList);

				// const dataCall = await Voximplant.login({
				// 	username: '00678',
				// 	password: 'Ngothanhntt_@62',
				// });
			})();

			const responseSubTeam: any = await getListSubTeam({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				Dept_Code: dataUserSystem.DEPT_CODE,
				KEY_DATA_EXT1: 'PGLNRT012',
			});

			const listSubTeamFilter: ISubTeam[] = responseSubTeam.filter(
				(subTeam: ISubTeam) => subTeam.TEAM_LEADER === dataUserSystem.EMP_NO,
			);

			const subTeamDefault: ISubTeam =
				listSubTeamFilter.length > 0
					? listSubTeamFilter[0]
					: responseSubTeam[0];

			const responseTeamMember: any = await getListTeamMember({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				Sub_Team_Code: subTeamDefault?.SubTeam,
				Dept_Code: dataUserSystem.DEPT_CODE,
				KEY_DATA_EXT1: 'PGLNRT012',
			});

			const objectData = {
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				MO_ID: responseTeamMember[0]?.EMP_NO || '0',
				FROM_DATE: convertUnixTimeNoSpace(
					timeFromFilterDashboardDefault.getTime() / 1000,
				),
				TO_DATE: convertUnixTimeNoSpace(
					timeToFilterDashboardDefault.getTime() / 1000,
				),
				Sub_Team: subTeamDefault?.C_NO || 0,
				LEVEL_TP:
					subTeamDefault?.LEVEL_TP === 0
						? '1'
						: subTeamDefault?.LEVEL_TP || '1',
			};
			// console.log(objectData,'home');

			dispatch(
				setSubTeamSelected({
					subTeamSelected: subTeamDefault,
				}),
			);

			dispatch(
				setTeamMemberSelected({
					teamMemberSelected: responseTeamMember[0],
				}),
			);

			dispatch(getSummaryProgress(objectData));

			dispatch(getNPV(objectData));

			dispatch(getRecovery(objectData));

			dispatch(getDelinquent(objectData));

			dispatch(getInsuranceInformed(objectData));

			dispatch(getListRoomRC());

			dispatch(
				getAllUserRC({
					UserID: dataUserRC?.userId,
					token: dataUserRC?.authToken,
				}),
			);

			dispatch(
				getListRequestEFlow({
					User_ID: dataUserSystem.EMP_NO,
					Status: '',
					Kind: '',
					RequestID: '',
					ProposedBy: '',
					LesseeName: '',
					Description: '',
				}),
			);

			dispatch(
				getListRequestEReview({
					User_ID: dataUserSystem.EMP_NO,
					Status: '',
					Kind: '',
					RequestID: '',
					ProposedBy: '',
					LesseeName: '',
					Description: '',
				}),
			);

			dispatch(
				getECoinTotal({
					User_ID: dataUserSystem.EMP_NO,
				}),
			);

			// const bannerSnapshot = await firestore().collection('Config').doc("Banner").collection("Home").get();
			// setBanner(bannerSnapshot[0].data())
		});

		// RNCallKeep.addEventListener('answerCall', () => {
		// 	RNCallKeep.endAllCalls();
		// 	AsyncStorage.getRoomIDVideoCall().then(rid => {
		// 		return navigation.navigate('ChatCallScreen', {
		// 			isVideoCall: false,
		// 			username: dataUserRC.me.username,
		// 			roomID: rid,
		// 		});
		// 	});
		// });

		Notifications.events().registerNotificationOpened(
			(
				notification,
				completion: (response: NotificationCompletion) => void,
			) => {
				const data = notification?.payload?.customData;
				const dataChat = notification?.payload?.ejson;
				if (data) {
					const dataParse = JSON.parse(data);
					if (dataParse.function === 'Quiz') {
						navigation.navigate('QuizScreen');
					} else if (dataParse.function === 'Voting') {
						navigation.navigate('VotingListScreen');
					} else if (dataParse.function === 'E-flow') {
						navigation.navigate('EFlowSearchScreen', {});
					} else {
						navigation.navigate('NotificationScreen');
					}
				} else if (dataChat) {
					navigation.navigate('ChatRoomListScreen');
				}
			},
		);

		Notifications.getInitialNotification().then(notification => {
			const data = notification?.payload?.customData;
			const dataChat = notification?.payload?.ejson;
			if (data) {
				const dataParse = JSON.parse(data);
				if (dataParse.function === 'Quiz') {
					navigation.navigate('QuizScreen');
				} else if (dataParse.function === 'Voting') {
					navigation.navigate('VotingListScreen');
				} else if (dataParse.function === 'E-flow') {
					navigation.navigate('EFlowSearchScreen', {});
				} else {
					navigation.navigate('NotificationScreen');
				}
			} else if (dataChat) {
				navigation.navigate('ChatRoomListScreen');
			}
		});
		// return () => RNCallKeep.removeEventListener('answerCall');
	}, []);

	const toFixNumber = (value: string) => {
		return Number(parseFloat(value).toFixed(2));
	};

	const _onPressGuideline = async file => {
		await openLink(file.link);
	};

	const renderColumnChart = ({ value, percent, color }: IPropColumn) => (
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

	const renderInfoFilterRow = ({ color, label, value }) => (
		<View style={styles.containerInfoFilterRow}>
			<View style={[styles.circleColor, { backgroundColor: color }]} />

			<Text style={styles.textLabelInfoFilter}>
				{label}:{' '}
				<Text style={[styles.textValueInfoFilter, { color }]}>{value}</Text>
			</Text>
		</View>
	);

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
				onPress={() =>
					navigation.navigate({
						name: 'CommenceDetailModal' as never,
						params: {
							dataSummaryProgress,
						},
					})
				}
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
							<Text
								style={[
									styles.textValueRightItemCommenceNPV,
									{ color: colors.primary },
								]}
							>
								{value}
							</Text>
							<Text style={styles.textLabelRightItemCommenceNPV}>
								Total Amount
							</Text>
						</View>

						<View style={[styles.viewRightItemCommenceNPV, { marginTop: 20 }]}>
							<Text
								style={[
									styles.textValueRightItemCommenceNPV,
									{ color: colors.primary },
								]}
							>
								{percentFormat}%
							</Text>
							<Text style={styles.textLabelRightItemCommenceNPV}>Achieved</Text>
						</View>
					</View>
				</View>
			</Card>
		);
	};

	return (
		<View style={styles.container}>
			<HeaderBanner />
			<View style={styles.containerBody}>
				{/* <View
					style={[
						{
							backgroundColor: colors.primary,
							position: 'absolute',
							top: windowHeight / 3,
							left: windowWidth - 35,
							// left: windowWidth / 4,
							zIndex: 1,
							height: 60,
							width: 55,
							borderBottomLeftRadius: 25,
						},
						{
							transform: [{ rotateY: '45deg' }, { rotateZ: '45deg' }],
						},
					]}
				></View>
				<TouchableOpacity
					style={{
						backgroundColor: colors.primary,
						position: 'absolute',
						top: windowHeight / 3.19,
						left: windowWidth - 18,
						zIndex: 1,
						height: 100,
						width: 50,
						borderBottomLeftRadius: 70,
						borderTopLeftRadius: 70,
					}}
				></TouchableOpacity> */}

				<ScrollView
					style={styles.containerScrollView}
					showsVerticalScrollIndicator={false}
				>
					{/*<ScrollView horizontal showsHorizontalScrollIndicator={false}>*/}
					{/*    {listGuideline.map((item, index) => (*/}
					{/*        <Card key={index.toString()} elevation={2} style={{margin: 8}}>*/}
					{/*            <View style={{padding: 8}}>*/}
					{/*                <TouchableOpacity onPress={() => _onPressGuideline(item)}>*/}
					{/*                    <View style={{flexDirection: "row", alignItems: "center"}}>*/}
					{/*                        <Image*/}
					{/*                            source={IC_FILE_COLOR}*/}
					{/*                            resizeMode="contain"*/}
					{/*                            style={[styles.iconCommenceNPV, {marginRight: 8}]}*/}
					{/*                        />*/}
					{/*                        <Text>{item.name}</Text>*/}
					{/*                    </View>*/}
					{/*                </TouchableOpacity>*/}
					{/*            </View>*/}
					{/*        </Card>*/}

					{/*    ))}*/}
					{/*</ScrollView>*/}

					{/*<Card elevation={2} style={{marginBottom: 8, marginHorizontal: 8}}>*/}
					{/*    <View style={{padding: 8}}>*/}
					{/*        <View style={{flexDirection: "row", alignItems: "center"}}>*/}
					{/*            <Image*/}
					{/*                source={{uri: "https://img.icons8.com/bubbles/300/000000/trust.png"}}*/}
					{/*                resizeMode="contain"*/}
					{/*                style={[styles.iconCommenceNPV, {marginRight: 8, marginTop: 20}]}*/}
					{/*            />*/}
					{/*            <View style={{flex: 1}}>*/}
					{/*                <Text style={{fontSize: 16, fontWeight: "600", color: '#555', textAlign: "center"}}>ỦNG HỘ TÀI XẾ*/}
					{/*                    CILC</Text>*/}
					{/*                <TouchableOpacity style={{marginTop: 8, flexDirection: "row"}} onPress={() => Clipboard.setString("0071001486565")}>*/}
					{/*                    <Text style={{flex: 1}}>STK:</Text>*/}
					{/*                    <Text style={{fontWeight: "600", color: Color.approved}}>Vu Minh Hien -*/}
					{/*                        0071001486565</Text>*/}
					{/*                    <Icon type={"Ionicons"} name={"copy-outline"} style={{ fontSize: 16, color: colors.primary, marginLeft: 4 }} />*/}
					{/*                </TouchableOpacity>*/}

					{/*                <View style={{marginTop: 4, flexDirection: "row"}}>*/}
					{/*                    <Text style={{flex: 1}}>Ngân hàng:</Text>*/}
					{/*                    <Text style={{fontWeight: "600", color: Color.approved}}>Vietcombank HCM</Text>*/}
					{/*                </View>*/}

					{/*                <View style={{marginTop: 4, flexDirection: "row"}}>*/}
					{/*                    <Text style={{}}>Nội dung: </Text>*/}
					{/*                    <Text style={{fontWeight: "600", color: colors.primary, flex: 1, textAlign: "right"}}>“Họ Tên người ủng hộ - Ủng hộ tài xế*/}
					{/*                        CILC”</Text>*/}
					{/*                </View>*/}

					{/*                <View style={{marginTop: 4, flexDirection: "row"}}>*/}
					{/*                    <Text style={{}}>Ví dụ: </Text>*/}
					{/*                    <Text style={{ color: colors.primary, flex: 1, textAlign: "right", fontStyle: "italic"}}>“Trần Hà My - Ủng hộ tài xế CILC”</Text>*/}
					{/*                </View>*/}
					{/*            </View>*/}
					{/*        </View>*/}
					{/*    </View>*/}
					{/*</Card>*/}

					<Card elevation={2} style={styles.cardFilter}>
						<View style={styles.containerFilter}>
							<View style={styles.containerInfoFilter}>
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
									value: `${convertUnixTimeDDMMYYYY(
										fromDate.getTime() / 1000,
									)} - ${convertUnixTimeDDMMYYYY(toDate.getTime() / 1000)}`,
								})}
							</View>

							<View>
								<FAB
									icon="filter-variant-plus"
									onPress={() => {
										navigation.navigate('FilterDashboardModal');
									}}
								/>
							</View>
						</View>
					</Card>

					{/* View Commence & NPV */}
					<View style={styles.containerCommenceNPV}>
						{/* View Commence Card */}
						{renderCardCommenceNPV({
							stylesCard: { marginRight: 8 },
							iconUrl: 'https://img.icons8.com/bubbles/344/money-bag.png',
							labelCard: 'Commence',
							value: formatVND(
								dataSummaryProgress?.reduce(
									(value, item) => value + item.acml_amt,
									0,
								),
							),
							percent:
								(dataSummaryProgress &&
									dataSummaryProgress[0]?.persent_acml_target?.toFixed(2)) ||
								`${(
									(dataSummaryProgress?.reduce(
										(value, item) => value + item.acml_amt,
										0,
									) /
										dataSummaryProgress?.reduce(
											(value, item) => value + item.acml_target,
											0,
										)) *
									100
								)?.toFixed(2)}`,
						})}

						{/* View NPV Card */}
						{renderCardCommenceNPV({
							stylesCard: {},
							iconUrl:
								'https://img.icons8.com/bubbles/344/economic-improvement.png',
							labelCard: 'NPV',
							value: formatVND(
								dataSummaryProgress?.reduce(
									(value, item) => value + item.npv_amt,
									0,
								),
							),
							percent:
								(dataSummaryProgress &&
									dataSummaryProgress[0]?.persent_npv?.toFixed(2)) ||
								`${(
									(dataSummaryProgress?.reduce(
										(value, item) => value + item.npv_amt,
										0,
									) /
										dataSummaryProgress?.reduce(
											(value, item) => value + item?.npV_Target,
											0,
										)) *
									100
								)?.toFixed(2)}`,
						})}
					</View>

					{/* View chart Tele/Visit/Consultation */}
					<Card
						elevation={2}
						style={{ marginTop: 8, marginHorizontal: 8 }}
						onPress={() =>
							navigation.navigate({
								name: 'SummaryReportDetailModal' as never,
								params: {
									dataSummaryProgress,
									Title: 'Consultation',
								},
							})
						}
					>
						<View style={{ padding: 8 }}>
							{/* View note */}
							<View style={{ marginBottom: 12, flexDirection: 'row' }}>
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
										Achievement
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
									<Text style={{ fontSize: 12, color: '#555' }}>Target</Text>
								</View>
							</View>

							{/* View chart */}
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'flex-end',
								}}
							>
								{/* Chart Tele */}
								<View style={{ flex: 1, alignItems: 'center' }}>
									<View
										style={{ flexDirection: 'row', alignItems: 'flex-end' }}
									>
										{renderColumnChart({
											value: formatVND(
												dataSummaryProgress?.reduce(
													(value, item) => value + item.no_tele,
													0,
												),
											),
											percent: parseFloat(
												toFixNumber(
													(
														(dataSummaryProgress?.reduce(
															(value, item) => value + item.no_tele,
															0,
														) *
															100) /
														dataSummaryProgress?.reduce(
															(value, item) => value + item.acml_target_tele,
															0,
														)
													).toString(),
												).toString(),
											),
											color: colors.primary,
										})}
										{renderColumnChart({
											value: formatVND(
												dataSummaryProgress?.reduce(
													(value, item) => value + item.acml_target_tele,
													0,
												),
											),
											color: '#2c82c9',
										})}
									</View>
									<Text style={styles.labelChartColumn}>Tele</Text>
								</View>
								{/* Chart Visit */}
								<View style={{ flex: 1, alignItems: 'center' }}>
									<View
										style={{ flexDirection: 'row', alignItems: 'flex-end' }}
									>
										{renderColumnChart({
											value: formatVND(
												dataSummaryProgress?.reduce(
													(value, item) => value + item.no_visit,
													0,
												),
											),
											percent: parseFloat(
												toFixNumber(
													(
														(dataSummaryProgress?.reduce(
															(value, item) => value + item.no_visit,
															0,
														) *
															100) /
														dataSummaryProgress?.reduce(
															(value, item) => value + item.acml_target_visit,
															0,
														)
													).toString(),
												).toString(),
											),
											color: colors.primary,
										})}
										{renderColumnChart({
											value: formatVND(
												dataSummaryProgress?.reduce(
													(value, item) => value + item.acml_target_visit,
													0,
												),
											),
											color: '#2c82c9',
										})}
									</View>
									<Text style={styles.labelChartColumn}>Visit</Text>
								</View>
								{/* Chart CF */}
								<View style={{ flex: 1, alignItems: 'center' }}>
									<View
										style={{ flexDirection: 'row', alignItems: 'flex-end' }}
									>
										{renderColumnChart({
											value: formatVND(
												dataSummaryProgress?.reduce(
													(value, item) => value + item.no_cons,
													0,
												),
											),
											percent: parseFloat(
												toFixNumber(
													(
														(dataSummaryProgress?.reduce(
															(value, item) => value + item.no_cons,
															0,
														) *
															100) /
														dataSummaryProgress?.reduce(
															(value, item) => value + item.acml_target_cons,
															0,
														)
													).toString(),
												).toString(),
											),
											color: colors.primary,
										})}
										{renderColumnChart({
											value: formatVND(
												dataSummaryProgress?.reduce(
													(value, item) => value + item.acml_target_cons,
													0,
												),
											),
											color: '#2c82c9',
										})}
									</View>
									<Text style={styles.labelChartColumn}>Consultation</Text>
								</View>
							</View>
						</View>
					</Card>

					{/* View Recovery and Delinquent */}
					<View
						style={{ flexDirection: 'row', marginTop: 8, marginHorizontal: 8 }}
					>
						{/* Card Recovery */}
						<Card
							elevation={2}
							style={{ flex: 1, marginRight: 8, paddingVertical: 8 }}
							onPress={() =>
								navigation.navigate({
									name: 'RecoveryDetailModal' as never,
									params: {
										dataSummaryProgress,
										Title: 'Recovery Detail',
										IsRevovery: true,
									},
								})
							}
						>
							<View style={{ flexDirection: 'row' }}>
								<Image
									source={{
										uri: 'https://img.icons8.com/bubbles/344/refund.png',
									}}
									resizeMode="contain"
									style={styles.iconCommenceNPV}
								/>
								<View
									style={{ marginLeft: 8, justifyContent: 'center', flex: 1 }}
								>
									<Text style={styles.valueRecoveryDelinquent}>
										{`${toFixNumber(
											dataRecovery?.recovery?.toString() || '0',
										)}%`}
									</Text>
									<Text style={[styles.labelRecoveryDelinquent]}>
										Rental Recovery
									</Text>
								</View>
							</View>

							<Text
								style={{
									fontSize: 11,
									marginTop: 8,
									marginLeft: 8,
									color: '#666',
								}}
							>
								RR = Receipt / Payable Amount
							</Text>
						</Card>

						{/* Card Delinquent */}
						<Card
							elevation={2}
							style={{ flex: 1 }}
							onPress={() =>
								navigation.navigate({
									name: 'RecoveryDetailModal' as never,
									params: {
										dataSummaryProgress,
										Title: 'Delinquent Report Detail',
										IsRevovery: false,
									},
								})
							}
						>
							<View
								style={{ flexDirection: 'row', padding: 8, paddingVertical: 8 }}
							>
								<Image
									source={{
										uri: 'https://img.icons8.com/bubbles/344/tax.png',
									}}
									resizeMode="contain"
									style={styles.iconCommenceNPV}
								/>
								<View
									style={{ marginLeft: 8, justifyContent: 'center', flex: 1 }}
								>
									<Text style={styles.valueRecoveryDelinquent}>
										{`${toFixNumber(
											dataDelinquent?.persent_Overdue?.toString() || '0',
										)}%`}
									</Text>
									<Text style={styles.labelRecoveryDelinquent}>Delinquent</Text>
								</View>
							</View>
						</Card>
					</View>

					{/* View Customer Resource and Insurance Informed */}
					<View
						style={{ marginTop: 8, flexDirection: 'row', marginHorizontal: 8 }}
					>
						{/* Card Customer Resource */}
						<Card
							elevation={2}
							style={{ flex: 1, marginRight: 8 }}
							onPress={() =>
								navigation.navigate({
									name: 'CustomerResourceDetailModal' as never,
									params: {
										dataSummaryProgress,
									},
								})
							}
						>
							<View style={{ padding: 8, flex: 1 }}>
								<View style={{ marginBottom: 16, flexDirection: 'row' }}>
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
											<Text
												style={{ fontWeight: 'bold', color: colors.primary }}
											>
												{dataNPV?.customer_Old || '0'}%
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
												{dataNPV?.customer_New || '0'}%
											</Text>
										</Text>
									</View>
								</View>

								<View style={{ flex: 1 }}>
									<ProgressCircle
										style={{ height: 70 }}
										progress={dataNPV?.customer_Old / 100}
										progressColor={colors.primary}
										backgroundColor="#2c82c9"
										strokeWidth={8}
									/>
								</View>

								<Text style={styles.labelCustomerInsurance}>
									Customer Resource
								</Text>
							</View>
						</Card>

						{/* Card Insurance Informed */}
						<Card
							elevation={2}
							style={{ flex: 1 }}
							onPress={() =>
								navigation.navigate({
									name: 'InsuranceDetailModal' as never,
									params: {
										dataSummaryProgress,
									},
								})
							}
						>
							<View style={{ padding: 8 }}>
								<View style={{ marginBottom: 16, flexDirection: 'row' }}>
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
										<Text style={{ fontSize: 12, color: '#555' }}>Actual</Text>
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
										<Text style={{ fontSize: 12, color: '#555' }}>Target</Text>
									</View>
								</View>

								<View
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<View
										style={{ flexDirection: 'row', alignItems: 'flex-end' }}
									>
										{renderColumnChart({
											value: dataInsuranceInformed?.persent_amt?.toString(),
											percent: dataInsuranceInformed?.persent_amt,
											color: colors.primary,
										})}
										{renderColumnChart({
											value: '90%',
											color: '#2c82c9',
										})}
									</View>
								</View>

								<Text style={styles.labelCustomerInsurance}>
									Insurance Informed
								</Text>
							</View>
						</Card>
					</View>

					<View style={{ marginTop: 8, marginHorizontal: 8 }}>
						<Card style={{ padding: 8, backgroundColor: colors.primary }}>
							<Text
								style={{
									textAlign: 'center',
									color: '#fff',
									fontWeight: '600',
								}}
							>
								Generate And Email Payment
							</Text>
						</Card>
					</View>

					{/* View Payment Notice Scheduled */}
					<View
						style={{ marginTop: 8, flexDirection: 'row', marginHorizontal: 8 }}
					>
						{/* Card Fuji */}
						<Card
							elevation={2}
							style={{ flex: 1, marginRight: 8, paddingVertical: 8 }}
							onPress={() =>
								navigation.navigate({
									name: 'EmailPaymentScreen' as never,
									params: {
										type: 'Fuji',
									},
								})
							}
						>
							<View style={{ flexDirection: 'row', paddingLeft: 8 }}>
								<Image
									source={{
										uri: 'https://img.icons8.com/bubbles/2x/money-transfer.png',
									}}
									resizeMode="contain"
									style={styles.iconCommenceNPV}
								/>
								<View
									style={{ marginLeft: 8, justifyContent: 'center', flex: 1 }}
								>
									<Text
										style={[styles.labelRecoveryDelinquent, { marginLeft: 20 }]}
									>
										Fuji
									</Text>
								</View>
							</View>
						</Card>

						{/* Card Normal */}
						<Card
							elevation={2}
							style={{ flex: 1 }}
							onPress={() =>
								navigation.navigate({
									name: 'EmailPaymentScreen' as never,
									params: {
										type: 'Normal',
									},
								})
							}
						>
							<View
								style={{ flexDirection: 'row', padding: 8, paddingVertical: 8 }}
							>
								<Image
									source={{
										uri: 'https://img.icons8.com/bubbles/2x/money-transfer.png',
									}}
									resizeMode="contain"
									style={styles.iconCommenceNPV}
								/>
								<View
									style={{ marginLeft: 8, justifyContent: 'center', flex: 1 }}
								>
									<Text style={styles.labelRecoveryDelinquent}>Normal</Text>
								</View>
							</View>
						</Card>
					</View>

					<View style={{ marginTop: 8, marginHorizontal: 8 }}>
						<Card>
							<View
								style={{
									flexDirection: 'row',
									marginTop: 8,
									justifyContent: 'center',
								}}
							>
								<Text
									style={[styles.labelRecoveryDelinquent, { color: 'black' }]}
								>
									List Customers has Established Date
								</Text>
							</View>

							<Animated.View
								style={{ height: anime.height }}
								onLayout={_initContentHeight}
							>
								{showView && (
									<View style={{ marginTop: 8, marginHorizontal: 6 }}>
										<View style={{}}>
											{listEstb.map((item, index) => {
												return (
													<View style={{ alignItems: 'center' }}>
														{index > 0 ? (
															<View
																style={{
																	flexDirection: 'row',
																	alignItems: 'center',
																	marginTop: 10,
																}}
															>
																<View
																	style={{
																		flex: 1,
																		height: 0.5,
																		backgroundColor: 'black',
																	}}
																/>
															</View>
														) : null}

														<View
															style={{
																flexDirection: 'row',
																marginVertical: 10,
																justifyContent: 'space-between',
															}}
														>
															<View style={{ flexDirection: 'row' }}>
																<Icon
																	as={Ionicons}
																	name={'barcode-outline'}
																	size={7}
																	color={colors.primary}
																/>
																<Text
																	style={{
																		marginRight: 85,
																		alignSelf: 'center',
																	}}
																>
																	{item?.LESE_ID}
																</Text>
															</View>
															<View style={{ flexDirection: 'row' }}>
																<Text
																	style={{
																		alignSelf: 'center',
																		marginLeft: 85,
																		marginRight: 5,
																	}}
																>
																	{item?.BIRTHDAY}
																</Text>
																<Icon
																	as={Ionicons}
																	name={'calendar-outline'}
																	size={7}
																	color={colors.primary}
																/>
															</View>
														</View>
														<Text
															style={{
																color: colors.primary,
																fontWeight: '600',
															}}
														>
															{item?.LS_NM}
														</Text>
													</View>
												);
											})}
										</View>
									</View>
								)}
							</Animated.View>

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
									name={
										showView ? 'chevron-up-outline' : 'chevron-down-outline'
									}
									size={7}
									color={colors.primary}
								/>
							</TouchableOpacity>
						</Card>
					</View>

					<View style={{ marginTop: 8, marginHorizontal: 8 }}>
						<Card>
							<View
								style={{
									flexDirection: 'row',
									marginTop: 8,
									justifyContent: 'center',
								}}
							>
								<Text
									style={[styles.labelRecoveryDelinquent, { color: 'black' }]}
								>
									{teamMemberSelected?.subTeamSelected?.C_NO === 'HCI1-A'
										? 'List DOB of individual Customer'
										: 'List DOB of the Representative'}
								</Text>
							</View>

							<Animated.View
								style={{ height: animeT.height }}
								onLayout={_initContentHeightT}
							>
								{showView2 && (
									<View style={{ marginTop: 8, marginHorizontal: 6 }}>
										<View style={{}}>
											{listDOB.map((item, index) => {
												return (
													<View style={{ alignItems: 'center' }}>
														{index > 0 ? (
															<View
																style={{
																	flexDirection: 'row',
																	alignItems: 'center',
																	marginTop: 10,
																}}
															>
																<View
																	style={{
																		flex: 1,
																		height: 0.5,
																		backgroundColor: 'black',
																	}}
																/>
															</View>
														) : null}

														<View
															style={{
																flexDirection: 'row',
																marginVertical: 10,
																justifyContent: 'space-between',
															}}
														>
															<View style={{ flexDirection: 'row' }}>
																<Icon
																	as={Ionicons}
																	name={'barcode-outline'}
																	size={7}
																	color={colors.primary}
																/>
																<Text
																	style={{
																		marginRight: 85,
																		alignSelf: 'center',
																	}}
																>
																	{item?.LESE_ID || item?.lese_ID}
																</Text>
															</View>
															<View style={{ flexDirection: 'row' }}>
																<Text
																	style={{
																		alignSelf: 'center',
																		marginLeft: 85,
																		marginRight: 5,
																	}}
																>
																	{item?.BIRTHDAY || item?.birthday}
																</Text>
																<Icon
																	as={Ionicons}
																	name={'calendar-outline'}
																	size={7}
																	color={colors.primary}
																/>
															</View>
														</View>
														<Text
															style={{
																color: colors.primary,
																fontWeight: '600',
															}}
														>
															{item?.LS_NM || item?.ls_Nm?.trim()}
														</Text>
													</View>
												);
											})}
										</View>
									</View>
								)}
							</Animated.View>

							<TouchableOpacity
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									paddingVertical: 8,
								}}
								onPress={() => toggleT()}
							>
								<Icon
									as={Ionicons}
									name={
										showView2 ? 'chevron-up-outline' : 'chevron-down-outline'
									}
									size={7}
									color={colors.primary}
								/>
							</TouchableOpacity>
						</Card>
					</View>

					{/* List DBO User */}
					<View
						style={{ marginTop: 8, marginHorizontal: 8, overflow: 'scroll' }}
					>
						<Card>
							<View
								style={{
									flexDirection: 'row',
									marginTop: 8,
									justifyContent: 'center',
								}}
							>
								<Text
									style={[styles.labelRecoveryDelinquent, { color: 'black' }]}
								>
									Happy birthday to our colleagues recently !!
								</Text>
								<Image
									source={{
										uri: 'https://img.icons8.com/bubbles/344/birthday.png',
									}}
									resizeMode="contain"
									style={{ height: 35, width: 35 }}
								/>
							</View>

							<Animated.View
								style={{ height: animeDBO_User.height }}
								onLayout={_initContentHeightDBO_User}
							>
								{showViewDBO_User && (
									<View style={{ marginTop: 8, marginHorizontal: 6 }}>
										<View style={{}}>
											{listDOB_User.map((item, index) => {
												const today = new Date();
												const newBirthDay = item?.BIRTHDAY.split('.');

												return (
													<TouchableOpacity
														style={{
															alignItems: 'center',
															borderBottomColor: '#e3e3e3',
															borderBottomWidth: 1,
															backgroundColor:
																newBirthDay[0] == today.getDate()
																	? '#FFFFCC'
																	: undefined,
														}}
														onPress={() => {
															// navigation.navigate('UserInfoScreen', {
															// 	userID: item?.EMP_NO,
															// 	//room: await checkRoomChatExisted(item),
															// });
															null;
														}}
													>
														<View
															style={{
																flexDirection: 'row',
																marginVertical: 15,
																// alignSelf: 'stretch',
															}}
														>
															<View
																style={{
																	flex: 1,
																	flexDirection: 'row',
																	marginHorizontal: 8,
																	alignItems: 'center',
																}}
															>
																<Icon
																	as={Ionicons}
																	name={'barcode-outline'}
																	size={7}
																	color={colors.primary}
																/>
																<Text
																	style={{
																		flex: 1,
																		marginLeft: 8,
																	}}
																>
																	{item?.EMP_NM} -{' '}
																	{item?.DIV_NM.split('Department')}
																</Text>
															</View>

															<View
																style={{
																	marginRight: 8,
																	flexDirection: 'row',
																	alignSelf: 'flex-start',
																}}
															>
																<Text
																	style={{
																		alignSelf: 'center',
																		// marginLeft: 85,
																		marginRight: 5,
																	}}
																>
																	{newBirthDay[0]}.{newBirthDay[1]}
																</Text>
																<Icon
																	as={Ionicons}
																	name={'calendar-outline'}
																	size={7}
																	color={colors.primary}
																/>
															</View>
														</View>
														{/* <View style={{ flexDirection: 'row' }}>
															<Text
																style={{
																	flex: 1,
																	// color: colors.primary,
																	// fontWeight: '600',
																	alignSelf: 'flex-start',
																	marginLeft: 10,
																}}
															>
																{item?.DIV_NM.split('Department')}
															</Text>
															<Icon
																as={Ionicons}
																name={'chatbubble-ellipses-outline'}
																size={7}
																color={colors.primary}
																style={{ alignSelf: 'center', marginRight: 10 }}
															/>
														</View> */}
													</TouchableOpacity>
												);
											})}
										</View>
									</View>
								)}
							</Animated.View>

							<TouchableOpacity
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									paddingVertical: 8,
								}}
								onPress={() => toggleDBO_User()}
							>
								<Icon
									as={Ionicons}
									name={
										showViewDBO_User
											? 'chevron-up-outline'
											: 'chevron-down-outline'
									}
									size={7}
									color={colors.primary}
								/>
							</TouchableOpacity>
						</Card>
					</View>

					{/*<Card elevation={2} style={{marginTop: 12, marginHorizontal: 8}}*/}
					{/*      onPress={() => openLink("https://www.facebook.com/chaileasevietnam/posts/1926388270870958")}>*/}
					{/*    <View style={{borderRadius: 4, overflow: "hidden"}}>*/}
					{/*        <Image*/}
					{/*            source={{uri: "https://firebasestorage.googleapis.com/v0/b/chailease-chat.appspot.com/o/banner%2Fbanner_home_campaign.jpg?alt=media&token=a02946b6-c5e3-44f3-a4cd-c7eb5f2177e8"}}*/}
					{/*            resizeMode={"cover"}*/}
					{/*            style={{width: "100%", height: 180 * rem}}/>*/}
					{/*    </View>*/}
					{/*</Card>*/}
					<SafeAreaView style={{ height: 60 }} />
				</ScrollView>
			</View>
		</View>
	);
}
