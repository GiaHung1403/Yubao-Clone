import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import { readFile } from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import RNImageToPdf from 'react-native-image-to-pdf';
import { Button, Card, Colors, Switch, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListContact } from '@actions/contact_action';
import { getListGeneralRFA } from '@actions/general_rfa_action';
import AvatarBorder from '@components/AvatarBorder';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import Header from '@components/Header';
import ImageViewerCustom from '@components/ImageViewerCustom';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Color from '@config/Color';
import {
	cancelRFA,
	createRFAID,
	getAllTcoByClass,
	insertGeneralRFA,
	sendMailRFA,
} from '@data/api';
import { ModalChooseUserEnum } from '@models/ModalChooseUserEnum';
import {
	IContact,
	ICustomer,
	IGeneralRFA,
	ITcoByClass,
	IUserSystem,
} from '@models/types';
import { LstApprover } from '@models/types/IGeneralRFA';
import { convertUnixTimeDDMMYYYY, convertUnixTimeFull } from '@utils';

import styles from './styles';
import RenderHTMLComponent from '@components/RenderHTMLComponent';
import { uploadFile } from '@data/api/api_consultation';

interface IPropsRouteParams {
	generalRFAItem: IGeneralRFA;
	listContactPersonSelected: string[];
	listApproverSelected: string[];
	idHighestAuthoritySelected: string;
	idOnBehalfSelected: string;
	customerSelected: ICustomer;
}

interface IPropsItemChip {
	userData?: IContact;
	index: number;
	onPress?: () => void;
}

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()),
);

const renderItemChip = ({ userData, index, onPress }: IPropsItemChip) => (
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
			<AvatarBorder username={userData?.emp_no} size={25} />
			<Text
				style={{
					color: '#000',
					marginLeft: 8,
				}}
			>
				{userData?.emp_nm}
			</Text>
		</View>
	</TouchableOpacity>
);

const renderItemChipNoOne = () => (
	<View
		key={'noOne'}
		style={{
			marginRight: 8,
			flexDirection: 'row',
			alignItems: 'center',
		}}
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
			<View
				style={{
					width: 30,
					height: 30,
					borderRadius: 25,
					backgroundColor: '#fff',
					justifyContent: 'center',
					alignItems: 'center',
					marginRight: 8,
				}}
			>
				<Icon as={Ionicons} name={'person-outline'} size={5} />
			</View>

			<Text>No one</Text>
		</View>
	</View>
);

const getColorStatus = (status: number) => {
	switch (status) {
		case 0:
			return Color.reject;
		case 1:
			return Color.approved;
		default:
			return Color.waiting;
	}
};

const getNameStatus = (status: number) => {
	switch (status) {
		case 0:
			return 'Rejected';
		case 1:
			return 'Approved';
		default:
			return 'Waiting';
	}
};

const renderApprover = (item: LstApprover) => (
	<View style={styles.containerItemListApprover}>
		<View
			style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
		>
			<AvatarBorder username={item?.approver_No} size={25} />
			<Text style={styles.textEmployeeName}>
				{item.approver_NN?.trim()} -{' '}
				<Text style={styles.textEmployeePosition}>
					{item.approver_Title?.trim()}
				</Text>{' '}
			</Text>
		</View>

		{item.rmks ? <RenderHTMLComponent value={item.rmks} /> : null}

		<Text style={styles.textSendDate}>
			{item.cnfm_Date
				? convertUnixTimeFull(new Date(item.cnfm_Date).getTime() / 1000)
				: null}
		</Text>
		<View style={styles.containerViewStatus}>
			<Text style={styles.textStatus}>
				{getNameStatus(!item.cnfm_Date ? -1 : item.cnfm_YN)}
			</Text>
			<View
				style={[
					styles.circleStatus,
					{
						backgroundColor: getColorStatus(
							!item.cnfm_Date ? -1 : item.cnfm_YN,
						),
					},
				]}
			/>
		</View>
	</View>
);

const regex = /(<([^>]+)>)/gi;

export function GeneralRFADetailScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const imageViewerRef = useRef<any>();
	const {
		generalRFAItem,
		listContactPersonSelected,
		listApproverSelected,
		idHighestAuthoritySelected,
		idOnBehalfSelected,
	}: IPropsRouteParams = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	const [generalRFAValue, setGeneralRFAValue] = useState(generalRFAItem);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [listRequestType, setListRequestType] = useState<any[]>([]);
	const [requestTypeSelected, setRequestTypeSelected] = useState<string>(
		generalRFAItem?.requestRFA.reQ_TYPE || '',
	);
	const [date, setDate] = useState(new Date());
	const [listEmailCCSelectedConvert, setListEmailCCSelectedConvert] = useState<
		IContact[]
	>([]);
	const [listApproverSelectedConvert, setListApproverSelectedConvert] =
		useState<IContact[]>([]);
	const [highestAuthoritySelected, setHighestAuthoritySelected] =
		useState<IContact>();
	const [onBehalfSelected, setOnBehalfSelected] = useState<IContact>();
	const [subject, setSubject] = useState<string>(generalRFAItem?.subj);
	const [restructure, setRestructure] = useState<boolean>(
		generalRFAItem?.requestRFA.restucture_YN || false,
	);
	const [content, setContent] = useState<string>(
		generalRFAItem?.requestRFA.rmks.replace(regex, '') || '',
	);
	const [listFileAttach, setListFileAttach] = useState<any>([]);
	const [loadingAttachFile, setLoadingAttachFile] = useState(false);
	const [loadingSave, setLoadingSave] = useState<boolean>(false);
	const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
	const [loadingCancel, setLoadingCancel] = useState<boolean>(false);
	const [loadingSendMail, setLoadingSendMail] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
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

			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const listRequestTypeResponse = (await getAllTcoByClass({
				classNo: 'cdln000055',
			})) as ITcoByClass[];
			const listRequestTypeConvert = listRequestTypeResponse
				.filter(item => item.c_No !== 'RFA_WFH')
				.map(item => ({
					label: item.stnD_C_NM,
					value: item.c_No,
				}));
			setListRequestType(listRequestTypeConvert);

			const listConvertCC: IContact[] = generalRFAItem?.requestRFA.cC_EMP_EMAIL
				?.split(';')
				.map(
					item =>
						listContact?.find(contactPerson => contactPerson?.email === item) ||
						null,
				) as IContact[];
			setListEmailCCSelectedConvert(listConvertCC?.filter(item => item));

			const highestFind = generalRFAItem?.lstApprover.find(
				item => item.highest_YN,
			);
			const itemConvertHighest: IContact = listContact?.find(
				contactPerson => contactPerson?.emp_no === highestFind?.approver_No,
			) as IContact;
			setHighestAuthoritySelected(itemConvertHighest);

			const onBehalfFind = generalRFAItem?.lstApprover.find(
				item => item.onbehalf_Highest_YN,
			);
			const itemConvertOnBehalf: IContact = listContact?.find(
				contactPerson => contactPerson?.emp_no === onBehalfFind?.approver_No,
			) as IContact;
			setOnBehalfSelected(itemConvertOnBehalf);

			const listConvertApprover: IContact[] = generalRFAItem?.lstApprover
				.filter(item => !item.highest_YN && !item.onbehalf_Highest_YN)
				?.map(
					item =>
						listContact?.find(
							contactPerson => contactPerson?.emp_no === item.approver_No,
						) || null,
				) as IContact[];
			setListApproverSelectedConvert(listConvertApprover);
		});
	}, [listContact]);

	/* Check list email cc selected */
	useEffect(() => {
		if (listContactPersonSelected !== undefined) {
			const listConvert: IContact[] = listContactPersonSelected?.map(
				contactPersonID => {
					return listContact?.find(
						contactPerson => contactPerson?.emp_no === contactPersonID,
					);
				},
			) as IContact[];

			setListEmailCCSelectedConvert(listConvert);
		}
	}, [listContactPersonSelected, listContact]);

	/* Check highest authority selected */
	useEffect(() => {
		if (idHighestAuthoritySelected !== undefined) {
			const itemConvert: IContact = listContact?.find(
				contactPerson => contactPerson?.emp_no === idHighestAuthoritySelected,
			) as IContact;

			setHighestAuthoritySelected(itemConvert);
		}
	}, [idHighestAuthoritySelected, listContact]);

	/* Check on behalf selected */
	useEffect(() => {
		if (idOnBehalfSelected !== undefined) {
			const itemConvert: IContact = listContact?.find(
				contactPerson => contactPerson?.emp_no === idOnBehalfSelected,
			) as IContact;

			setOnBehalfSelected(itemConvert);
		}
	}, [idOnBehalfSelected, listContact]);

	/* Check list approver selected */
	useEffect(() => {
		if (listApproverSelected !== undefined) {
			const listConvert: IContact[] = listApproverSelected?.map(
				contactPersonID => {
					return (
						listContact?.find(
							contactPerson => contactPerson?.emp_no === contactPersonID,
						) || { EMP_NO: contactPersonID }
					);
				},
			) as IContact[];

			setListApproverSelectedConvert(listConvert);
		}
	}, [listApproverSelected, listContact]);

	const getListContactSelected = type => {
		switch (type) {
			case ModalChooseUserEnum.HIGHEST:
				return idHighestAuthoritySelected ? [idHighestAuthoritySelected] : [];
			case ModalChooseUserEnum.ON_BEHALF:
				return idOnBehalfSelected ? [idOnBehalfSelected] : [];
			case ModalChooseUserEnum.RELATED:
				return listApproverSelectedConvert?.map(item => item.emp_no);
			case ModalChooseUserEnum.ALL:
				return listEmailCCSelectedConvert?.map(item => item.emp_no);
			default:
				return listEmailCCSelectedConvert?.map(item => item.emp_no);
		}
	};

	const _onPressOpenContactPersonModal = type => {
		const convertListContactSelected = getListContactSelected(type);
		navigation.navigate('ChooseUserModal', {
			listContactPersonExisted: convertListContactSelected || [],
			screenBack: 'GeneralRFADetailScreen',
			type,
		});
	};

	const createParamApprover = responseRequestID => {
		const listApprover =
			listApproverSelectedConvert?.map(item => ({
				action: 'INSERT_TCO_ONLINE_APPROVER',
				key_ID: responseRequestID.req_ID,
				approver_No: item.emp_no,
				function_Name: 'RFA',
				highest_YN: false,
				onbehalf_Highest_YN: false,
			})) || [];

		const highestAuthority = highestAuthoritySelected
			? [
					{
						action: 'INSERT_TCO_ONLINE_APPROVER',
						key_ID: responseRequestID.req_ID,
						approver_No: highestAuthoritySelected?.emp_no,
						function_Name: 'RFA',
						highest_YN: true,
						onbehalf_Highest_YN: false,
					},
			  ]
			: [];

		const onBehalf = onBehalfSelected
			? [
					{
						action: 'INSERT_TCO_ONLINE_APPROVER',
						key_ID: responseRequestID.req_ID,
						approver_No: onBehalfSelected?.emp_no,
						function_Name: 'RFA',
						highest_YN: false,
						onbehalf_Highest_YN: true,
					},
			  ]
			: [];

		return [...listApprover, ...highestAuthority, ...onBehalf];
	};

	const _onPressSendMail = async () => {
		setLoadingSendMail(true);
		try {
			const lstApproverParams = createParamApprover({
				req_ID: generalRFAValue.requestRFA.reQ_ID,
			});
			await sendMailRFA({
				User_ID: dataUserSystem.EMP_NO,
				req_id: generalRFAValue.requestRFA.reQ_ID,
				lstApproverParams,
			});

			dispatch(
				getListGeneralRFA({
					User_ID: dataUserSystem.EMP_NO,
					fromDate: timeFrom,
					toDate: timeNow,
					REQ_ID: '',
					Subj: '',
				}),
			);
			setLoadingSendMail(false);
			navigation.goBack();
		} catch (e: any) {
			setLoadingSendMail(false);
			Alert.alert('Error', e.message);
		}
	};

	const _onPressCancel = async () => {
		setLoadingCancel(true);
		try {
			const lstApproverParams = createParamApprover({
				req_ID: generalRFAValue.requestRFA.reQ_ID,
			});
			await cancelRFA({
				User_ID: dataUserSystem.EMP_NO,
				req_id: generalRFAValue.requestRFA.reQ_ID,
				lstApproverParams,
			});

			dispatch(
				getListGeneralRFA({
					User_ID: dataUserSystem.EMP_NO,
					fromDate: timeFrom,
					toDate: timeNow,
					REQ_ID: '',
					Subj: '',
				}),
			);
			setLoadingCancel(false);
			navigation.goBack();
		} catch (e: any) {
			setLoadingCancel(false);
			Alert.alert('Error', e.message);
		}
	};

	const _onPressButtonSave = async ({ flag }) => {
		if (flag === 'D') {
			setLoadingDelete(true);
		} else {
			setLoadingSave(true);
		}

		try {
			const responseRequestID = generalRFAValue
				? { req_ID: generalRFAValue.requestRFA.reQ_ID }
				: ((await createRFAID({ User_ID: dataUserSystem.EMP_NO })) as any);
			const ccName = listEmailCCSelectedConvert?.reduce(
				(value, item) => value + `${item.emp_no} - ${item.emp_nm};`,
				'',
			);
			const ccEmail = listEmailCCSelectedConvert?.reduce(
				(value, item) => value + `${item.email};`,
				'',
			);

			const lstApproverParams = createParamApprover(responseRequestID);

			const deviceOS = await DeviceInfo.getBaseOs();

			if (listFileAttach.length > 0) {
				await axios.post('http://yubao.chailease.com.vn/upload/upload_file', {
					// listPdfBase64: listFileAttach.map(item => item.base64),
					// fileName: `${responseRequestID.req_ID}_Attachment`,
					imageBase64: listFileAttach.map(item => item.base64),
					fileName: `${responseRequestID.req_ID}_Attachment`,
					type: 'png',
				});
			}

			//convert file from Yubao to Host
			// await uploadFile({
			// 	file_name: fileName,
			// 	From_Folder: `export/APP/CF/${fileName}.png`,
			// 	To_Folder: `PM_DOC/APP_ATT/`,
			// 	type_file: 'png',
			// });

			await insertGeneralRFA({
				User_ID: dataUserSystem.EMP_NO,
				reQ_ID: responseRequestID.req_ID,
				subj: subject,
				content,
				cc: ccName,
				cC_EMP_EMAIL: ccEmail,
				flag,
				restucture_YN: restructure,
				reQ_TYPE: requestTypeSelected,
				devicE_OS: deviceOS === 'unknown' ? 'IOS' : deviceOS,
				lstApproverParams,
				fileAttach: generalRFAValue?.attach_Files || listFileAttach.length > 0,
			});

			dispatch(
				getListGeneralRFA({
					User_ID: dataUserSystem.EMP_NO,
					fromDate: timeFrom,
					toDate: timeNow,
					REQ_ID: '',
					Subj: '',
				}),
			);

			if (flag === 'D') {
				setLoadingDelete(false);
			} else {
				setLoadingSave(false);
			}

			navigation.goBack();
		} catch (e: any) {
			if (flag === 'D') {
				setLoadingDelete(false);
			} else {
				setLoadingSave(false);
			}
			Alert.alert('Error', e.message);
		}
	};

	const myAsyncPDFFunction = async listImage => {
		try {
			const options = {
				imagePaths: listImage,
				name: 'Image-To-PDF',
				// maxSize: {
				//     // optional maximum image dimension - larger images will be resized
				//     width: 900,
				//     height: Math.round((deviceHeight() / deviceWidth()) * 900),
				// },
				quality: 0.5, // optional compression paramter
			};
			const pdf = await RNImageToPdf.createPDFbyImages(options);
			const base64 = await readFile(pdf.filePath, 'base64');
			return {
				base64,
				name: 'Image-To-PDF',
				uri: pdf.filePath,
			};
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	const _onPressChooseImage = () => {
		setLoadingAttachFile(true);
		ImagePicker.openPicker({
			multiple: true,
			includeBase64: true,
		})
			.then(async images => {
				const imagesConvert = await myAsyncPDFFunction(
					images.map(image => {
						let uriRename = '';
						if (Platform.OS === 'android') {
							uriRename = image.path.replace('file:', '');
						} else {
							uriRename = image.path;
						}
						return uriRename;
					}),
				);
				setListFileAttach(listFileOld => {
					const listNew = [].concat(listFileOld) as any[];
					listNew.push(imagesConvert);
					return listNew;
				});

				setLoadingAttachFile(false);
			})
			.catch(() => {
				setLoadingAttachFile(false);
			});
	};
	const { colors } = useTheme();

	const _onPressChooseFile = async () => {
		setLoadingAttachFile(true);
		try {
			const results = await DocumentPicker.pickMultiple({
				type: [DocumentPicker.types.pdf],
			});
			const listFilePicked = [] as any[];
			for (const response of results) {
				let uriRename = '';
				if (Platform.OS === 'ios') {
					uriRename = response.uri.replace('file:', '');
				} else {
					uriRename = response.uri;
				}
				const base64Data = await readFile(uriRename, 'base64');
				listFilePicked.push({
					base64: base64Data,
					name: response.name,
					uri: uriRename,
				});
			}

			setListFileAttach(listFileOld => {
				return listFileOld.concat(listFilePicked) as any[];
			});

			setLoadingAttachFile(false);
		} catch (err) {
			setLoadingAttachFile(false);
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'General RFA Detail'} />

			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<ScrollView style={{ flex: 1, padding: 8 }}>
						<Card style={{ padding: 8 }}>
							<View
								style={{
									flexDirection: 'row',
									marginBottom: 12,
								}}
							>
								<ButtonChooseDateTime
									label={'Date'}
									valueDisplay={convertUnixTimeDDMMYYYY(
										new Date().getTime() / 1000,
									)}
									modalMode={'datetime'}
									value={date}
									onHandleConfirmDate={(dateValue: Date) => setDate(dateValue)}
									containerStyle={{ flex: 1 }}
								/>
							</View>

							<PickerCustomComponent
								showLabel={true}
								listData={listRequestType}
								label="Request Type"
								value={requestTypeSelected}
								enable={!generalRFAValue || generalRFAValue?.sT_C === '5'}
								style={{ flex: 1, marginBottom: 12 }}
								textStyle={{ maxWidth: '100%' }}
								onValueChange={text => setRequestTypeSelected(text)}
							/>

							<View
								style={{
									marginBottom: 12,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<Text style={{ color: '#555', fontWeight: '500' }}>
									Restructure
								</Text>
								<Switch
									value={restructure}
									onValueChange={value => setRestructure(value)}
								/>
							</View>

							{/*Email CC*/}
							<View style={{ marginBottom: 12 }}>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
								>
									Email C/C
								</Text>
								<ScrollView
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									{(!generalRFAValue || generalRFAValue?.sT_C === '5') && (
										<TouchableOpacity
											style={{
												width: 40,
												height: 40,
												borderRadius: 25,
												backgroundColor: '#dfdfdf',
												justifyContent: 'center',
												alignItems: 'center',
												marginRight: 8,
											}}
											onPress={() =>
												_onPressOpenContactPersonModal(ModalChooseUserEnum.ALL)
											}
										>
											<Text>+</Text>
										</TouchableOpacity>
									)}
									{listEmailCCSelectedConvert?.map((contactPerson, index) =>
										renderItemChip({
											userData: contactPerson,
											index,
											onPress: () =>
												_onPressOpenContactPersonModal(ModalChooseUserEnum.ALL),
										}),
									)}
								</ScrollView>
							</View>
						</Card>

						<Card style={{ padding: 8, marginTop: 8 }}>
							<TextInputCustomComponent
								label="Subject"
								placeholder=""
								multiline
								inputStyle={{
									height: 'auto',
									textAlignVertical: 'top',
								}}
								value={subject}
								style={{ marginBottom: 12 }}
								onChangeText={text => setSubject(text)}
							/>

							{/* <TextInputCustomComponent
								label="Content"
								placeholder=""
								multiline
								inputStyle={{
									height: 'auto',
									maxHeight: 700,
									minHeight: 200,
									textAlignVertical: 'top',
								}}
								value={content}
								onChangeText={text => setContent(text)}
							/> */}
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
									<RenderHTMLComponent
										value={generalRFAItem?.requestRFA.rmks.replace(regex, '')}
									/>
								</View>
							</View>
						</Card>

						<Card elevation={2} style={{ marginTop: 8, flex: 1 }}>
							<View style={{ padding: 8 }}>
								<Text style={{ fontWeight: '500', color: '#333' }}>
									Attach File
								</Text>
								{generalRFAValue?.attach_Files ? (
									<TouchableOpacity
										style={{ justifyContent: 'center', alignItems: 'center' }}
										onPress={() =>
											navigation.navigate('WebviewScreen', {
												url: `https://coreapi.chailease.com.vn/Pdf/external-domain-pdf?&Key_ID=PM_DOC/RFA/${generalRFAValue.attach_Files}`,
												title: generalRFAValue.attach_Files,
											})
										}
									>
										<Image
											source={{
												uri: 'https://img.icons8.com/bubbles/100/000000/pdf-2.png',
											}}
											resizeMode={'contain'}
											style={{ width: 70, height: 70 }}
										/>
										<Text>{generalRFAValue.attach_Files}</Text>
									</TouchableOpacity>
								) : (
									<ScrollView horizontal style={{}}>
										{listFileAttach?.map((item, index) => (
											<TouchableOpacity
												key={index.toString()}
												style={{
													justifyContent: 'center',
													alignItems: 'center',
												}}
												onPress={() =>
													navigation.navigate('WebviewScreen', {
														url: item.uri,
														title: item?.name,
													})
												}
											>
												<Image
													source={{
														uri: 'https://img.icons8.com/bubbles/100/000000/pdf-2.png',
													}}
													resizeMode={'contain'}
													style={{ width: 70, height: 70 }}
												/>
												<Text>{item?.name}</Text>
											</TouchableOpacity>
										))}
									</ScrollView>
								)}
							</View>
							<View style={{ padding: 8 }}>
								<Text style={{ marginBottom: 8, color: '#666' }}>
									** Select 1 or more files/images, the application will
									automatically merge into 1 file pdf
								</Text>
								<Text
									style={{
										marginBottom: 8,
										color: '#9b59b6',
										fontStyle: 'italic',
										fontWeight: '600',
									}}
								>
									** The file upload can't over 15MB
								</Text>
								<View style={{ flexDirection: 'row' }}>
									<TouchableOpacity
										style={{
											flex: 1,
											marginRight: 8,
											backgroundColor:
												generalRFAValue && generalRFAValue?.sT_C !== '5'
													? '#f5f5f5'
													: '#fff',
										}}
										disabled={generalRFAValue && generalRFAValue?.sT_C !== '5'}
										onPress={() => _onPressChooseFile()}
									>
										{loadingAttachFile ? (
											<ActivityIndicator color={colors.primary} />
										) : (
											<View
												style={{
													padding: 8,
													justifyContent: 'center',
													alignItems: 'center',
													borderWidth: 1,
													borderRadius: 4,
													borderColor: Color.approved,
												}}
											>
												<View style={{ width: '100%', position: 'relative' }}>
													<Image
														source={{
															uri: 'https://img.icons8.com/bubbles/100/000000/pdf-2.png',
														}}
														resizeMode={'contain'}
														style={{ width: '100%', height: 70 }}
													/>
												</View>
												<Text
													style={{
														marginTop: 12,
														fontWeight: '500',
														color: '#333',
													}}
												>
													Attach File
												</Text>
											</View>
										)}
									</TouchableOpacity>

									<TouchableOpacity
										style={{
											flex: 1,
											backgroundColor:
												generalRFAValue && generalRFAValue?.sT_C !== '5'
													? '#f5f5f5'
													: '#fff',
										}}
										disabled={generalRFAValue && generalRFAValue?.sT_C !== '5'}
										onPress={() => _onPressChooseImage()}
									>
										{loadingAttachFile ? (
											<ActivityIndicator color={colors.primary} />
										) : (
											<View
												style={{
													padding: 8,
													justifyContent: 'center',
													alignItems: 'center',
													borderWidth: 1,
													borderRadius: 4,
													borderColor: Color.approved,
												}}
											>
												<View style={{ width: '100%', position: 'relative' }}>
													<Image
														source={{
															uri: 'https://img.icons8.com/bubbles/100/000000/image.png',
														}}
														resizeMode={'contain'}
														style={{ width: '100%', height: 70 }}
													/>
												</View>
												<Text
													style={{
														marginTop: 12,
														fontWeight: '500',
														color: '#333',
													}}
												>
													Attach Image
												</Text>
											</View>
										)}
									</TouchableOpacity>
								</View>
							</View>
						</Card>

						<Card elevation={2} style={{ marginTop: 8, flex: 1, padding: 8 }}>
							{/*Highest Authority*/}
							<View style={{ marginVertical: 12 }}>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
								>
									Highest Authority
								</Text>
								<ScrollView
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									{(!generalRFAValue || generalRFAValue?.sT_C === '5') &&
										!highestAuthoritySelected && (
											<TouchableOpacity
												style={{
													width: 40,
													height: 40,
													borderRadius: 25,
													backgroundColor: '#dfdfdf',
													justifyContent: 'center',
													alignItems: 'center',
													marginRight: 8,
												}}
												onPress={() =>
													_onPressOpenContactPersonModal(
														ModalChooseUserEnum.HIGHEST,
													)
												}
											>
												<Text>+</Text>
											</TouchableOpacity>
										)}

									{highestAuthoritySelected
										? renderItemChip({
												userData: highestAuthoritySelected,
												index: 0,
												onPress: () =>
													(!generalRFAValue || generalRFAValue?.sT_C === '5') &&
													_onPressOpenContactPersonModal(
														ModalChooseUserEnum.HIGHEST,
													),
										  })
										: generalRFAValue && generalRFAValue.sT_C !== '5'
										? renderItemChipNoOne()
										: null}
								</ScrollView>
							</View>

							{/*On Behalf*/}
							<View style={{ marginBottom: 12 }}>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
								>
									On Behalf Of Highest Authority
								</Text>
								<ScrollView
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									{(!generalRFAValue || generalRFAValue?.sT_C === '5') &&
										!onBehalfSelected && (
											<TouchableOpacity
												style={{
													width: 40,
													height: 40,
													borderRadius: 25,
													backgroundColor: '#dfdfdf',
													justifyContent: 'center',
													alignItems: 'center',
													marginRight: 8,
												}}
												onPress={() =>
													_onPressOpenContactPersonModal(
														ModalChooseUserEnum.ON_BEHALF,
													)
												}
											>
												<Text>+</Text>
											</TouchableOpacity>
										)}

									{onBehalfSelected
										? renderItemChip({
												userData: onBehalfSelected,
												index: 0,
												onPress: () =>
													_onPressOpenContactPersonModal(
														ModalChooseUserEnum.ON_BEHALF,
													),
										  })
										: generalRFAValue && generalRFAValue.sT_C !== '5'
										? renderItemChipNoOne()
										: null}
								</ScrollView>
							</View>

							{/*List Approver*/}
							<View style={{ marginBottom: 12 }}>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
								>
									Related Dept(s)
								</Text>
								<ScrollView
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									{(!generalRFAValue || generalRFAValue?.sT_C === '5') && (
										<TouchableOpacity
											style={{
												width: 40,
												height: 40,
												borderRadius: 25,
												backgroundColor: '#dfdfdf',
												justifyContent: 'center',
												alignItems: 'center',
												marginRight: 8,
											}}
											onPress={() =>
												_onPressOpenContactPersonModal(
													ModalChooseUserEnum.RELATED,
												)
											}
										>
											<Text>+</Text>
										</TouchableOpacity>
									)}

									{listApproverSelectedConvert?.map((contactPerson, index) =>
										renderItemChip({
											userData: contactPerson,
											index,
											onPress: () =>
												_onPressOpenContactPersonModal(
													ModalChooseUserEnum.RELATED,
												),
										}),
									)}
								</ScrollView>
							</View>
						</Card>

						{generalRFAValue && (
							<Card elevation={2} style={{ marginTop: 8, flex: 1, padding: 8 }}>
								<View>
									<Text
										style={{
											fontWeight: '600',
											color: '#555',
											marginBottom: 8,
										}}
									>
										Related Department(s)' opinion
									</Text>
									{generalRFAValue?.lstApprover.map(item =>
										renderApprover(item),
									)}
								</View>
							</Card>
						)}

						<View style={{ flexDirection: 'row', marginTop: 16 }}>
							{(!generalRFAValue || generalRFAValue?.sT_C === '5') && (
								<Button
									mode="contained"
									style={{ flex: 1, marginRight: 8 }}
									uppercase={false}
									loading={loadingSave}
									onPress={() =>
										_onPressButtonSave({ flag: generalRFAValue ? 'U' : 'I' })
									}
								>
									{loadingSave ? 'Loading...' : 'Save'}
								</Button>
							)}

							{generalRFAValue &&
								generalRFAValue?.sT_C !== '4' &&
								generalRFAValue?.sT_C !== '9' && (
									<Button
										mode="contained"
										style={{
											flex: 1,
											marginRight: 8,
											backgroundColor: Color.approved,
										}}
										uppercase={false}
										loading={loadingSendMail}
										onPress={() => _onPressSendMail()}
									>
										{loadingSendMail ? 'Loading...' : 'Send mail'}
									</Button>
								)}
						</View>

						<View style={{ flexDirection: 'row', marginTop: 8 }}>
							{generalRFAValue &&
								generalRFAValue?.sT_C !== '4' &&
								generalRFAValue?.sT_C !== '9' && (
									<Button
										mode="contained"
										style={{ flex: 1, marginRight: 8, backgroundColor: 'red' }}
										uppercase={false}
										loading={loadingCancel}
										onPress={() =>
											Alert.alert('Notice', 'Do you want cancel RFA?', [
												{
													text: 'Yes',
													style: 'cancel',
													onPress: () => _onPressCancel(),
												},
												{ text: 'No', style: 'default' },
											])
										}
									>
										{loadingCancel ? 'Loading...' : 'Cancel'}
									</Button>
								)}

							{generalRFAValue &&
								generalRFAValue?.sT_C !== '4' &&
								generalRFAValue?.sT_C !== '9' && (
									<Button
										mode="contained"
										style={{ flex: 1, marginRight: 8, backgroundColor: 'red' }}
										uppercase={false}
										loading={loadingDelete}
										onPress={() =>
											Alert.alert('Notice', 'Do you want delete RFA?', [
												{
													text: 'Yes',
													style: 'cancel',
													onPress: () => _onPressButtonSave({ flag: 'D' }),
												},
												{ text: 'No', style: 'default' },
											])
										}
									>
										{loadingDelete ? 'Loading...' : 'Delete'}
									</Button>
								)}
						</View>
						<SafeAreaView style={{ height: 60 }} />
					</ScrollView>
				</KeyboardAvoidingView>
			) : (
				<LoadingFullScreen />
			)}
			<ImageViewerCustom
				ref={ref => {
					imageViewerRef.current = ref;
				}}
			/>
		</View>
	);
}
