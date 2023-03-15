import { useNavigation, StackActions } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState, useRef } from 'react';
import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	KeyboardAvoidingView,
	Image,
	Keyboard,
	Alert,
	PixelRatio,
	Platform,
	InteractionManager,
} from 'react-native';
import { Avatar, Button, Card, FAB, Modal, Snackbar } from 'react-native-paper';

import { useTheme } from 'react-native-paper';
import Header from '@components/Header';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import { EventEmitterEnum } from '@models/EventEmitterEnum';
import EventEmitter from '@utils/events';
import styles from './styles';
import { IContact, ISpotlight, IUserSystem } from '@models/types';
import AvatarBorder from '@components/AvatarBorder';
import {
	getTicketModule,
	getTicketType,
	postTicketMIS,
	getPIC_MIS,
	createDirectMessage,
	getSpotlight,
	getTicketDetail,
	updateTicketMIS,
} from '@data/api';
import { getListContact } from '@actions/contact_action';
import ImagePicker from 'react-native-image-crop-picker';

import { useDispatch, useSelector } from 'react-redux';
import ImageViewerCustom from '@components/ImageViewerCustom';
import { ModalChooseUserEnum } from '@models/ModalChooseUserEnum';
import { RocketChat } from '@data/rocketchat';
import { generateHash } from '@utils';
import RenderHTMLComponent from '@components/RenderHTMLComponent';
import LoadingFullScreen from '@components/LoadingFullScreen';
interface IPropsItemChip {
	userID: string;
	name: string;
	index: number;
	onPress?: () => void;
}

const optionsCamera = {
	cropping: true,
	compressImageQuality: 0.8,
	width: 1200,
	height: 1600,
	freeStyleCropEnabled: true,
	cropperAvoidEmptySpaceAroundImage: false,
	cropperChooseText: 'Choose',
	cropperCancelText: 'Cancel',
	includeBase64: true,
};

const renderItemChip = ({ userID, name, index, onPress }: IPropsItemChip) => (
	<TouchableOpacity
		key={index.toString()}
		style={{
			marginRight: 8,
			flexDirection: 'row',
			alignItems: 'center',
		}}
		onPress={onPress}
	>
		<View
			style={{
				backgroundColor: '#d5d5d5',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 50,
				flexDirection: 'row',
				paddingVertical: 4,
				paddingHorizontal: 16,
			}}
		>
			<AvatarBorder username={userID} size={25} />
			<Text
				style={{
					color: '#000',
					marginLeft: 8,
				}}
			>
				{name}
			</Text>
		</View>
	</TouchableOpacity>
);

export function TicketDetailScreen(props: any) {
	const { ticketID, listContactPersonSelected } = props.route.params;
	const dispatch = useDispatch();
	const { colors } = useTheme();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [typeSelected, setTypeSelected] = useState('1');
	const [moduleSelected, setModuleSelected] = useState('');
	const [functionSelected, setFunctionSelected] = useState('');
	const [kindSelected, setKindSelected] = useState('');
	const [subject, setSubject] = useState('');
	const [cc, setCC] = useState('');
	const [description, setDescription] = useState('');
	const [PIC_MIS, setPIC_MIS] = useState('');
	const [PIC, setPIC] = useState('');
	const [ticketDetail, setTicketDetail] = useState<any>([]);
	const navigation: any = useNavigation();

	const [type, setType] = useState([{}]);
	const [module, setModule] = useState([{}]);
	const [getFunction, setFunction] = useState([{}]);
	const [kind, setKind] = useState([{}]);
	const [fileUpload, setFileUpload] = useState(undefined);
	const fileUploadRef = useRef<any>();
	const [labelSnackBar, setLabelSnackBar] = useState('');
	const [visibleSnackBar, setVisibleSnackBar] = useState(false);

	const [listContactSelectedConvert, setListContactSelectedConvert] = useState<
		IContact[]
	>([]);

	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const _onPressOpenContactPersonModal = () => {
		const convertListContactSelected = listContactSelectedConvert?.map(
			item => item?.emp_no,
		);
		navigation.navigate('ChooseUserModal', {
			listContactPersonExisted: convertListContactSelected || [],
			deptCode: '0',
			screenBack: 'TicketDetailScreen',
			type: ModalChooseUserEnum.ALL,
		});
	};

	//Choose user
	useEffect(() => {
		if (listContactPersonSelected) {
			const listConvert: IContact[] = listContactPersonSelected?.map(
				contactPersonID => {
					return listContact?.find(
						contactPerson => contactPerson?.emp_no === contactPersonID,
					);
				},
			) as IContact[];
			setListContactSelectedConvert(listConvert.filter(item => item));
		}
	}, [listContactPersonSelected]);

	//Get Type
	useEffect(() => {
		(async function search() {
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

		(async function getData() {
			const data: any = await getTicketType({
				action: 'GET_TYPE_OF_TICKET',
				key_data: '0001',
			});
			const listTypeConvert = data?.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));
			setType(listTypeConvert);
		})();

		setDoneLoadAnimated(true);
	}, []);

	useEffect(() => {
		if (ticketID) {
			(async function getData() {
				const data: any = await getTicketDetail({
					User_ID: dataUserSystem.EMP_NO,
					action: 'GET_TICKET_DETAIL',
					key_data: ticketID,
				});

				setPIC(
					`${data[0]?.OP_EMP_NO}-${data[0]?.op_emp_nm}-${data[0]?.DIV_NM}`,
				);
				setTypeSelected(data[0]?.TIC_TYPE);
				setModuleSelected(data[0]?.TIC_MODULE);
				setFunctionSelected(data[0]?.TIC_FUNC);
				setKindSelected(data[0]?.TIC_FUNC_DTL);
				setSubject(data[0]?.SUBJ);
				setDescription(data[0]?.DESCRIPT);
				setCC(data[0]?.CC);
				setTicketDetail(data);
			})();
		}
	}, [ticketID]);

	useEffect(() => {
		if (cc !== '') {
			if (cc.includes(';')) {
				const temp = cc.split(';');
				const listConvert: IContact[] = temp?.map(email => {
					return listContact?.find(
						contactPerson => contactPerson?.email === email,
					);
				}) as IContact[];
				setListContactSelectedConvert(listConvert.filter(item => item));
			} else {
				setListContactSelectedConvert(
					listContact?.filter(contactPerson => contactPerson?.email === cc),
				);
			}
		}
	}, [listContact]);

	//Get Module
	useEffect(() => {
		if (!typeSelected) {
			return;
		}

		(async function getData() {
			try {
				const data: any = await getTicketModule({
					User_ID: dataUserSystem.EMP_NO,
					key_data: '0001',
					key_data_ext1: typeSelected,
				});

				const listModuleConvert = data?.map(item => ({
					label: item.PGM_NM,
					value: item.PGM_NO,
				}));
				setModule(listModuleConvert);
			} catch (error) {
				console.log({ error });
			}
		})();
		setFunctionSelected('');
		setKindSelected('');
	}, [typeSelected]);

	//Get Function
	useEffect(() => {
		(async function getData() {
			const data = (await getTicketModule({
				User_ID: dataUserSystem.EMP_NO,
				key_data: '0001',
				key_data_ext1: moduleSelected,
			})) as any[];

			const listModuleConvert = data?.map(item => ({
				label: item.PGM_NM,
				value: item.PGM_NO,
			}));
			setFunction(listModuleConvert);
		})();
	}, [moduleSelected]);

	//Get Function_Detail
	useEffect(() => {
		(async function getData() {
			const data: any = await getTicketModule({
				User_ID: dataUserSystem.EMP_NO,
				key_data: '0001',
				key_data_ext1: functionSelected,
			});
			const listModuleConvert = data?.map(item => ({
				label: item.PGM_NM,
				value: item.PGM_NO,
			}));
			setKind(listModuleConvert);
		})();
	}, [functionSelected]);

	//Get PIC_MIS
	useEffect(() => {
		(async function getData() {
			const data: any = await getPIC_MIS({
				User_ID: dataUserSystem.EMP_NO,
				key_data: typeSelected,
				key_data_ext1: typeSelected === '1' ? kindSelected : moduleSelected,
			});
			setPIC_MIS(data?.OP_EMP_NO);
		})();
	}, [kindSelected, moduleSelected]);

	useEffect(() => {
		setCC('');
		listContactSelectedConvert.forEach(item => {
			setCC(value => item.email + ';' + value);
		});
	}, [listContactSelectedConvert]);

	const _onInsertTicket = async () => {
		await postTicketMIS({
			User_ID: dataUserSystem.EMP_NO,
			action: 'INSERT_TICKET',
			key_data: typeSelected,
			key_data_ext1: moduleSelected,
			key_data_ext2: functionSelected,
			product_code: kindSelected,
			content_feedback: description,
			title_feedback: subject,
			pic_mis: PIC_MIS,
			email: cc,
		});
	};

	const _onPressSave = () => {
		if (moduleSelected === '') {
			Alert.alert('Alert', 'Please choose module of system');
			return;
		} else if (typeSelected === 'cdit000012' || typeSelected === 'cdit000011') {
			try {
				Keyboard.dismiss();
				// const data = await postTicketMIS({
				// 	User_ID: dataUserSystem.EMP_NO,
				// 	action: 'INSERT_TICKET',
				// 	key_data: typeSelected,
				// 	key_data_ext1: moduleSelected,
				// 	key_data_ext2: functionSelected,
				// 	product_code: kindSelected,
				// 	content_feedback: description,
				// 	title_feedback: subject,
				// 	pic_mis: PIC_MIS,
				// 	email: cc,
				// });

				_onInsertTicket();
				Alert.alert('Alert', 'Create ticket successful');
				EventEmitter.emit('refTicket');

				setTimeout(() => {
					//setVisibleSnackBar(false);
					navigation.goBack();
				}, 2000);
			} catch (err) {
				// setLabelSnackBar(err.message);
				// setVisibleSnackBar(true);
				setTimeout(() => {
					setVisibleSnackBar(false);
				}, 2000);
			}
		} else if (functionSelected === '' || kindSelected === '') {
			Alert.alert('Alert', 'Please choose function/function detail of system');
			return;
		} else {
			try {
				Keyboard.dismiss();
				// const data = await postTicketMIS({
				// 	User_ID: dataUserSystem.EMP_NO,
				// 	action: 'INSERT_TICKET',
				// 	key_data: typeSelected,
				// 	key_data_ext1: moduleSelected,
				// 	key_data_ext2: functionSelected,
				// 	product_code: kindSelected,
				// 	content_feedback: description,
				// 	title_feedback: subject,
				// 	pic_mis: PIC_MIS,
				// 	email: cc,
				// });
				_onInsertTicket();
				Alert.alert('Alert', 'Create ticket successful');
				EventEmitter.emit('refTicket');

				setTimeout(() => {
					//setVisibleSnackBar(false);
					navigation.goBack();
				}, 2000);
			} catch (err) {
				// setLabelSnackBar(err.message);
				// setVisibleSnackBar(true);
				setTimeout(() => {
					setVisibleSnackBar(false);
				}, 2000);
			}
		}
	};

	const _onPressUpdate = async () => {
		try {
			Keyboard.dismiss();
			const data: any = await updateTicketMIS({
				User_ID: dataUserSystem.EMP_NO,
				action: 'UPDATE_TICKET',
				key_data: typeSelected,
				key_data_ext1: moduleSelected,
				key_data_ext2: functionSelected,
				product_code: kindSelected,
				content_feedback: ticketDetail[0]?.DESCRIPT,
				title_feedback: subject,
				pic_mis: ticketDetail[0]?.IT_PIC,
				ticket_id: ticketDetail[0]?.LOG_ID,
				email: cc,
				remake: ticketDetail[0]?.RMKS,
				status: ticketDetail[0]?.STA,
			});

			Alert.alert('Alert', 'Update ticket successful');
			EventEmitter.emit('refTicket');

			setTimeout(() => {
				//setVisibleSnackBar(false);
				navigation.goBack();
			}, 2000);
		} catch (err) {
			// setLabelSnackBar(err.message);
			// setVisibleSnackBar(true);

			setTimeout(() => {
				setVisibleSnackBar(false);
			}, 2000);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={ticketID ? `Ticket ID ${ticketID}` : 'Create Ticket'} />
			{doneLoadAnimated && ticketDetail ? (
				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						style={{ flex: 1 }}
					>
						<Card elevation={2} style={{ marginHorizontal: 8, marginTop: 8 }}>
							<View style={{ padding: 8 }}>
								{/* View PIC */}
								<TextInputCustomComponent
									label="PIC"
									placeholder=""
									enable={false}
									value={
										ticketID
											? PIC
											: `${dataUserSystem?.EMP_NO} - ${dataUserSystem?.EMP_NM} - ${dataUserSystem?.DIV_NM}`
									}
									onChangeText={(text: string) => null}
									style={{ marginTop: 8 }}
								/>

								{/* View Type and Module */}
								<View
									style={{
										flexDirection: 'row',
										marginTop: 12,
									}}
								>
									<PickerCustomComponent
										showLabel={true}
										listData={type}
										label="Type"
										value={typeSelected}
										style={{ flex: 1, marginRight: 8 }}
										onValueChange={text => setTypeSelected(text)}
									/>

									<PickerCustomComponent
										showLabel={true}
										listData={module}
										label="Module"
										value={moduleSelected}
										style={{ flex: 1 }}
										onValueChange={text => setModuleSelected(text)}
									/>
								</View>

								{/* View Function and Kind */}
								<View
									style={{
										flexDirection: 'row',
										marginVertical: 12,
									}}
								>
									<PickerCustomComponent
										showLabel={true}
										listData={getFunction}
										label="Function"
										enable={typeSelected === '1' ? true : false}
										value={functionSelected}
										style={{ flex: 1, marginRight: 8 }}
										onValueChange={text => setFunctionSelected(text)}
									/>

									<PickerCustomComponent
										showLabel={true}
										listData={kind}
										label="Function Detail"
										enable={typeSelected === '1' ? true : false}
										value={kindSelected}
										style={{ flex: 1 }}
										textStyle={{ maxWidth: 140 }}
										onValueChange={text => setKindSelected(text)}
									/>
								</View>
							</View>
						</Card>

						<Card elevation={2} style={{ marginHorizontal: 8, marginTop: 12 }}>
							<View style={{ padding: 8 }}>
								{/* View Subject, CC, Description and Upload File */}
								<View
									style={{
										marginVertical: 8,
									}}
								>
									{/* View Subject */}
									<TextInputCustomComponent
										label="Subject"
										placeholder="Subject"
										value={subject}
										onChangeText={(text: string) => setSubject(text)}
									/>

									{/* View CC */}
									<View style={{ marginVertical: 8, paddingTop: 20 }}>
										<Text
											style={{
												fontWeight: '600',
												color: '#555',
												marginBottom: 8,
											}}
										>
											CC
										</Text>
										<ScrollView
											horizontal={true}
											showsHorizontalScrollIndicator={false}
										>
											<TouchableOpacity
												style={{
													width: 40,
													height: 40,
													borderRadius: 25,
													backgroundColor: '#dfdfdf',
													justifyContent: 'center',
													alignItems: 'center',
													marginRight: 10,
												}}
												onPress={() => _onPressOpenContactPersonModal()}
											>
												<Text>+</Text>
											</TouchableOpacity>
											{listContactSelectedConvert?.map((contactPerson, index) =>
												renderItemChip({
													userID: contactPerson?.emp_no,
													name: contactPerson?.emp_nm,
													index,
													onPress: () => _onPressOpenContactPersonModal(),
												}),
											)}
										</ScrollView>
									</View>

									{/* View Description */}

									{ticketID === undefined ? (
										<TextInputCustomComponent
											label="Description"
											placeholder=""
											multiline={true}
											value={description}
											onChangeText={(text: string) => setDescription(text)}
											style={{ marginVertical: 12 }}
										/>
									) : (
										<View style={{ marginBottom: 20 }}>
											<Text style={{ marginVertical: 10 }}>Description</Text>
											<View
												style={{
													borderColor: '#666',
													borderWidth: 0.5,
													borderRadius: 4,
													paddingVertical: Platform.OS === 'ios' ? 12 : 6,
													paddingHorizontal: 8,
												}}
											>
												<RenderHTMLComponent value={description} />
											</View>
										</View>
									)}

									{/* View Upload File */}
									<View>
										<Text
											style={{
												fontWeight: '600',
												color: '#555',
												marginBottom: 4,
											}}
										>
											Upload file
										</Text>
										<TouchableOpacity
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												padding: 16,
												borderWidth: 1,
												borderRadius: 4,
												borderColor: '#dfdfdf',
												justifyContent: 'center',
											}}
											onPress={() => {
												fileUpload
													? fileUploadRef.current.onShowViewer(
															[{ url: fileUpload }],
															0,
													  )
													: ImagePicker.openPicker(optionsCamera).then(
															(image: any) => {
																setFileUpload(image.data);
															},
													  );
											}}
										>
											{fileUpload ? (
												<View style={{ width: '100%', position: 'relative' }}>
													<Image
														source={{
															uri: `data:image/jpeg;base64,${fileUpload}`,
														}}
														resizeMode={fileUpload ? 'cover' : 'contain'}
														style={{ width: '100%', height: 70 }}
													/>
													{fileUpload && (
														<TouchableOpacity
															style={{
																position: 'absolute',
																top: -10,
																right: -10,
															}}
															onPress={() => setFileUpload(undefined)}
														>
															<View>
																<Icon
																	as={Ionicons}
																	name={'close-circle-outline'}
																	size={7}
																	color={'red.500'}
																/>
															</View>
														</TouchableOpacity>
													)}
												</View>
											) : (
												<View>
													<Icon
														as={Ionicons}
														name="cloud-upload-outline"
														color={colors.primary}
													/>
												</View>
											)}
										</TouchableOpacity>
									</View>
								</View>

								<View style={{ marginVertical: 8 }}>
									<Button
										mode="contained"
										uppercase={false}
										style={{ flex: 1 }}
										onPress={() =>
											ticketID ? _onPressUpdate() : _onPressSave()
										}
									>
										{ticketID ? 'Update' : 'Save'}
									</Button>
								</View>
							</View>
						</Card>

						<SafeAreaView style={{ height: 60 }} />
					</KeyboardAvoidingView>
				</ScrollView>
			) : (
				<LoadingFullScreen />
			)}

			<FABComponent getDetail={ticketDetail} userInfo={dataUserSystem} />
			<ModalSentMessage />
			<View>
				<ImageViewerCustom
					ref={ref => {
						fileUploadRef.current = ref;
					}}
				/>
			</View>
			<Snackbar
				visible={visibleSnackBar}
				onDismiss={() => null}
				action={{
					label: 'OK',
					onPress: () => {
						setVisibleSnackBar(false);
					},
				}}
			>
				{labelSnackBar}
			</Snackbar>
		</View>
	);
}

const FABComponent = ({ getDetail, userInfo }) => {
	const navigation: any = useNavigation();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const onStateChange = ({ open }) => setIsOpen(open);

	return (
		<FAB.Group
			visible={true}
			open={isOpen}
			icon={isOpen ? 'close' : 'menu'}
			actions={[
				{
					icon: 'chat-processing-outline',
					label: 'Chat with user',
					onPress: () => EventEmitter.emit(EventEmitterEnum.SHOW_MODAL_TICKET),
				},
				{
					icon: 'console',
					label: 'IT Controls',
					onPress: () => {
						if (userInfo?.DEPT_CODE === '0001') {
							navigation.navigate('TicketITControlScreen', {
								detail: getDetail,
							});
						} else {
							Alert.alert('Alert', "Your can't use this function");
						}
					},
				},
				{
					icon: 'clipboard-list-outline',
					label: 'Ticket change log',
					onPress: () =>
						navigation.navigate('LeaveRequestDetailScreen', Object.assign({})),
				},
			]}
			onStateChange={onStateChange}
		/>
	);
};

const ModalSentMessage = () => {
	const [visible, setVisible] = React.useState(false);
	const { colors } = useTheme();
	const [chat, setChat] = useState('');
	const { dataUserRC } = useSelector((state: any) => state.auth_reducer);
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	useEffect(() => {
		EventEmitter.addEventListener(
			EventEmitterEnum.SHOW_MODAL_TICKET,
			showModal,
		);
		EventEmitter.addEventListener(
			EventEmitterEnum.HIDE_MODAL_TICKET,
			hideModal,
		);

		return () => {
			EventEmitter.removeListener(EventEmitterEnum.SHOW_MODAL_TICKET);
			EventEmitter.removeListener(EventEmitterEnum.HIDE_MODAL_TICKET);
		};
	}, []);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const findRoomChatName = async contact => {
		return (await getSpotlight({
			token: dataUserRC.authToken,
			UserID: dataUserRC.userId,
			query: contact,
		})) as ISpotlight;
	};

	const _onPressSentMessage = async () => {
		if (!chat) {
			return;
		}

		const roomChat: ISpotlight = await findRoomChatName(dataUserSystem.EMP_NO);
		try {
			if (!roomChat?.rid) {
				const roomResponse: any = await createDirectMessage({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					usernameStaff: roomChat?.username || dataUserSystem.EMP_NO,
				});

				const objectParam = {
					_id: generateHash(17),
					rid: Object.assign(roomResponse, {
						name: roomChat?.username || dataUserSystem.EMP_NO,
						fname: roomChat?.name || dataUserSystem.EMP_NO,
					})?.rid,
					msg: chat,
				};

				try {
					setChat('');
					await RocketChat.sendMessage(objectParam);
				} catch (error) {
					Alert.alert('Error', 'Cannot send message! Please try again!');
				}
				// navigation.dispatch(StackActions.popToTop());

				navigation.navigate('ChatRoomMessageScreen', {
					room: Object.assign(roomResponse, {
						name: roomChat?.username || dataUserSystem.EMP_NO,
						fname: roomChat?.name || dataUserSystem.EMP_NM,
					}),
				});
				return;
			}

			const objectParam = {
				_id: generateHash(17),
				rid: roomChat?.rid,
				msg: chat,
			};

			try {
				setChat('');
				await RocketChat.sendMessage(objectParam);
			} catch (error) {
				Alert.alert('Error', 'Cannot send message! Please try again!');
			}

			navigation.navigate('ChatRoomMessageScreen', { room: roomChat });
		} catch (error) {
			Alert.alert(
				'Alert',
				'User not existed on database chat! Please contact IT for support!',
			);
		}
	};

	return (
		<Modal
			visible={visible}
			onDismiss={hideModal}
			contentContainerStyle={{ padding: 20, margin: 20 }}
		>
			<Card elevation={2}>
				<View style={{ padding: 8 }}>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 15,
							fontWeight: '600',
							color: '#666',
						}}
					>
						Chat with user
					</Text>
					<Text style={{ fontSize: 13, color: '#666' }}>
						{`*Note: \n - Sent to system will only sent chat to web system \n - Chat will only sent message to function chat on app`}
					</Text>

					<TextInputCustomComponent
						label=""
						placeholder=""
						multiline={true}
						value={chat}
						onChangeText={(text: string) => {
							setChat(text);
						}}
						style={{ marginBottom: 12 }}
					/>

					<View
						style={{
							flexDirection: 'row',
							marginTop: 8,
							justifyContent: 'flex-end',
						}}
					>
						<TouchableOpacity
							style={{ paddingHorizontal: 16, paddingVertical: 8 }}
						>
							<Text style={{ fontWeight: '500', color: colors.primary }}>
								Sent to system
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ paddingHorizontal: 16, paddingVertical: 8 }}
							onPress={() => {
								_onPressSentMessage();
							}}
						>
							<Text style={{ fontWeight: '500', color: Color.approved }}>
								Chat
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Card>
		</Modal>
	);
};
