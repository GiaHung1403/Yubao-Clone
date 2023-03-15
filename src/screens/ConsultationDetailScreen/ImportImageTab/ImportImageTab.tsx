import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Image,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import { Button, Card, Colors, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Color from '@config/Color';

import { getListFileRC } from '@actions/document_action';
import ImageViewerCustom from '@components/ImageViewerCustom';
import ModalLoadingTop from '@components/ModalLoadingTop';
import * as api_consultation from '@data/api/api_consultation';
import { RocketChat } from '@data/rocketchat';
import {
	IConsultationDetail,
	ICreditProgressCF,
	ICustomer,
	IGuarantor,
	IUserLoginRC,
	IUserSystem,
	IValidCFSentMailResult,
} from '@models/types';
import { useDimensions } from '@react-native-community/hooks';
import EventEmitter from '@utils/events';
import openLink from '@utils/openLink';
import axios from 'axios';
import moment from 'moment';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { flex } from 'styled-system';
import ChooseGalleryModal from './ChooseGalleryModal';

interface IPropsRouteParams {
	consultationID: string;
	customerSelected: ICustomer;
	consultationItem: IConsultationDetail;
}

const listVehicleCaseYN = [
	{ label: 'Choose', value: '-1' },
	{ label: 'Yes', value: '1' },
	{ label: 'No', value: '0' },
];

const listCurrency = [
	{ label: 'VND', value: 'VND' },
	{ label: 'USD', value: 'USD' },
];

const listUnderCommissionProgram = [
	{ label: 'Choose', value: '2' },
	{ label: 'No', value: '0' },
	{ label: 'Vehicle Commission', value: '1' },
];

const listFundingPurposeData = [
	{ label: 'Choose', value: 'Choose' },
	{ label: 'New Orders', value: 'New Orders' },
	{ label: 'Replace the old vehicles', value: 'Replace the old vehicles' },
	{ label: 'Working Capital', value: 'Working Capital' },
	{ label: 'Other', value: 'Please keying the other Funding Purpose...' },
];

const listCreditProgressRadio = [
	{ label: 'Yes', value: 'Y' },
	{ label: 'No', value: 'N' },
	{ label: 'Not set', value: '-' },
];

const listID = [{ label: 'Choose', value: '0' }];

let MyCloud_id = '';

let file_Type: any = '';

export default function ImportImageTab(props: any) {
	const navigation: any = useNavigation();
	const widthScreen = useDimensions().window.width;
	const { colors } = useTheme();
	const dispatch = useDispatch();
	const {
		consultationID,
		customerSelected,
		consultationItem,
	}: IPropsRouteParams = props;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [item, setItem] = useState<any>(0);
	const [listItem, setListItem] = useState<any>([{}]);
	const [fileUpload, setFileUpload] = useState<any>(undefined);
	const fileUploadRef = useRef<any>();
	const [folder, setFolder] = useState<string>('');
	const [listFile, setListFile] = useState<any>(undefined);

	const [buttonLoading, setButtonLoading] = useState<boolean>(false);

	const modalGalleryRef = useRef<any>();

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

	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	useEffect(() => {
		(async function getListData() {
			const data: any = await api_consultation.getListItem({
				user: dataUserSystem.EMP_NO,
				CNID: consultationItem.cnid,
			});
			const lisItem = data.map(value => ({
				label: value.STND_C_NM,
				value: value.C_NO,
			}));
			setListItem(lisItem);
		})();
		get_MyCloud();
	}, []);

	const _open_Gallrey = () => {
		fileUpload
			? fileUploadRef.current.onShowViewer([{ url: fileUpload }], 0)
			: ImagePicker.openPicker(optionsCamera).then((image: any) => {
					const fileName = image.filename.split('.')[0].replaceAll(' ', '_');
					setFileUpload({ base64: image.data, type: 'jpg', name: fileName });
					file_Type = 'jpg';
					modalGalleryRef.current.onShowModal(false);
			  });
	};

	const _onPress_File = async () => {
		try {
			const results = await DocumentPicker.pickMultiple({
				type: [DocumentPicker.types.allFiles],
			});

			const response = await ReactNativeBlobUtil.fetch('GET', results[0]?.uri);
			file_Type = results[0].name.split('.');
			const getType = file_Type[file_Type.length - 1];

			setFileUpload({
				base64: response.base64(),
				type: getType,
				name: results[0].name.split('.')[0].replaceAll(' ', '_'),
			});

			modalGalleryRef.current.onShowModal(false);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	};

	const _open_MyCloud = () => {
		navigation.navigate('ChatRoomStoredScreen', {
			room: MyCloud_id,
			isUpload: true,
		});
	};
	const get_MyCloud = async () => {
		const testData: any = await RocketChat.searchDirectory({
			text: 'My Cloud',
			type: 'users',
		});

		MyCloud_id = testData?.result[0]._id;
		dispatch(
			getListFileRC({
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
				type: 'd',
				roomId: MyCloud_id,
			}),
		);
		_getFile_Upload();
		setDoneLoadAnimated(true);
	};

	const _onPress_UpLoad = async (base64, fileName, type) => {
		if (folder === '') {
			Alert.alert(`You haven't choose Folder to upload`);
			return;
		}

		if (fileUpload === undefined) {
			Alert.alert(`You haven't choose File to upload`);
			return;
		}
		setButtonLoading(true);
		try {
			await axios.post('http://yubao.chailease.com.vn/upload/upload_file', {
				imageBase64: base64,
				functionName: 'CF',
				fileName,
				type,
			});
			// console.log(moment(new Date()).format('hhmmss'));

			await api_consultation.uploadFile({
				file_name: fileName,
				From_Folder: `export/APP/CF/${fileName}.${type}`,
				To_Folder: `export/FILE_CONTROL/${consultationID}/CF/${folder}/`,
				type_file: type,
			});
			setFileUpload(undefined);
			// console.log(moment(new Date()).format('hhmmss'));

			await api_consultation.insert_Upload_File({
				user: dataUserSystem.EMP_NO,
				CNID: consultationItem.cnid,
				folder_Name: `E:/CILC/EXPORT/FILE_CONTROL/${consultationID}/CF/${folder}/`,
				file_Name: `${fileName}.${type}`,
				item_Type: item,
			});

			Alert.alert('Alert', 'Upload successfully');
			_getFile_Upload();
			setButtonLoading(false);
		} catch (error: any) {
			Alert.alert('Error', error);
			setButtonLoading(false);
		}
	};

	EventEmitter.addEventListener('getFileUpload', item => {
		setFileUpload({ base64: item?.base64, type: item?.type, name: item?.name });
		file_Type = item?.type;
	});

	const getFolder = async item => {
		const linkFolder: any = await api_consultation.getFolderConsultation({
			user: dataUserSystem.EMP_NO,
			item,
		});

		setFolder(linkFolder[0].folder_Nm);
	};

	const genItemName = () => {
		const date = moment(new Date()).format('DDMMyyyy');
		const time = moment(new Date()).format('HHmmss');
		return `${fileUpload?.name}_${date}_${time}`;
	};

	const _getFile_Upload = async () => {
		const data: any = await api_consultation.getFile_Upload({
			user: dataUserSystem.EMP_NO,
			CNID: consultationItem.cnid,
		});

		const temp: any = data.reduce(function (accumulator, obj) {
			let key = obj['FOLDER_NM'];
			if (key === obj.FOLDER_NM) {
				accumulator[key] = [
					...(accumulator[key] || []),
					`http://124.158.8.254:9898/export/APP/CF/${obj.FILE_NAME}`,
				];
			}
			return accumulator;
		}, {});

		const result = Object.keys(temp).map(key => ({
			NAME: key,
			ListImage: temp[key],
		}));
		setListFile(result);
	};

	const itemFolder = ({ image, name, file, _onPress }) => {
		return (
			<TouchableOpacity
				style={{ flexDirection: 'row', alignItems: 'center' }}
				onPress={_onPress}
			>
				<Image
					source={{
						uri: image,
					}}
					// resizeMode="contain"
					style={{
						width: 50,
						height: 50,
						borderTopLeftRadius: 4,
						borderBottomLeftRadius: 4,
					}}
				/>
				<View style={{ maxWidth: 300, marginHorizontal: 8 }}>
					<Text
						style={{
							color: 'black',
						}}
					>
						{name.trim()}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const checkType = item => {
		let fielName: any = '';
		(function getFileName() {
			const temp = item.split('/');
			fielName = temp[temp.length - 1];
		})();

		switch (true) {
			case item?.includes('docx'):
				return (
					<View>
						{itemFolder({
							image:
								'https://img.icons8.com/bubbles/344/microsoft-word-2019.png',
							name: fielName,
							file: item,
							_onPress: () => {
								openLink(item);
							},
						})}
					</View>
				);
				break;

			case item?.includes('jpg'):
				return (
					<View>
						<View>
							{itemFolder({
								image: item,
								name: fielName,
								file: item,
								_onPress: () => {
									fileUploadRef.current.onShowViewer([{ url: item }], 0);
								},
							})}
						</View>
					</View>
				);
				break;

			case item?.includes('png'):
				return (
					<View>
						<View>
							{itemFolder({
								image: item,
								name: fielName,
								file: item,
								_onPress: () => {
									fileUploadRef.current.onShowViewer([{ url: item }], 0);
								},
							})}
						</View>
					</View>
				);
				break;

			case item?.includes('xlsx'):
				return (
					<View>
						{itemFolder({
							image:
								'https://img.icons8.com/bubbles/2x/microsoft-excel-2019.png',
							name: fielName,
							file: item,
							_onPress: () => {
								openLink(item);
							},
						})}
					</View>
				);
				break;

			case item?.includes('pdf'):
				return (
					<View>
						{itemFolder({
							image: 'https://img.icons8.com/bubbles/344/pdf-2.png',
							name: fielName,
							file: item,
							_onPress: () => {
								openLink(item);
							},
						})}
					</View>
				);
				break;
			default:
				break;
		}
	};

	const checkTypeView = item => {
		switch (item.type) {
			case 'docx':
				return (
					<View>
						{itemFolder({
							image:
								'https://img.icons8.com/bubbles/344/microsoft-word-2019.png',
							name: item?.name,
							file: item,
							_onPress: () => {
								null;
							},
						})}
					</View>
				);
				break;

			case 'xlsx':
				return (
					<View>
						{itemFolder({
							image:
								'https://img.icons8.com/bubbles/2x/microsoft-excel-2019.png',
							name: item?.name,
							file: item,
							_onPress: () => {
								null;
							},
						})}
					</View>
				);
				break;

			case 'pdf':
				return (
					<View>
						{itemFolder({
							image: 'https://img.icons8.com/bubbles/344/pdf-2.png',
							name: item?.name,
							file: item,
							_onPress: () => {
								null;
							},
						})}
					</View>
				);
				break;
			default:
				return (
					<View>
						<View>
							{itemFolder({
								image: `data:image/jpeg;base64,${item.base64}`,
								name: item?.name,
								file: item,
								_onPress: () => {
									null;
								},
							})}
						</View>
					</View>
				);
				break;
		}
	};

	const _deleteFile = () => {
		try {
			Alert.alert('Alert', 'Are you sure delete this file?', [
				{ text: 'No' },
				{
					text: 'Yes',
					onPress: async () => {
						null;
					},
					style: 'destructive',
				},
			]);
		} catch (error: any) {
			Alert.alert('Error', error.message);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<View style={{ flex: 1, padding: 8 }}>
						<Card style={{ padding: 8 }}>
							<View style={{ flexDirection: 'row', marginBottom: 10 }}>
								<TextInputCustomComponent
									label="Choose Folder"
									placeholder=""
									style={{ flex: 1, marginRight: 10 }}
									value={consultationID}
									enable={true}
									// onChangeText={text => setFundingPurposeText(text)}
								/>
								<TextInputCustomComponent
									label="Function Name"
									placeholder=""
									style={{ flex: 1 }}
									value={'CF'}
									enable={true}
									// onChangeText={text => setFundingPurposeText(text)}
								/>
							</View>
							<PickerCustomComponent
								showLabel={true}
								listData={listItem}
								label="Items"
								value={item}
								style={{}}
								textStyle={{ maxWidth: 110 }}
								onValueChange={text =>
									setTimeout(() => {
										setItem(text);
										getFolder(text);
									}, 300)
								}
							/>
						</Card>
						<Card style={{ padding: 8, marginTop: 8 }}>
							<View>
								<Text
									style={{
										fontWeight: '600',
										color: '#555',
										marginBottom: 4,
									}}
								>
									Upload file{' '}
									{
										<Text
											style={{
												marginBottom: 8,
												color: '#9b59b6',
												fontStyle: 'italic',
												fontWeight: '600',
											}}
										>
											(** The file upload can't over 15MB)
										</Text>
									}
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
									// onPress={() => {
									// 	fileUpload
									// 		? fileUploadRef.current.onShowViewer(
									// 				[{ url: fileUpload }],
									// 				0,
									// 		  )
									// 		: ImagePicker.openPicker(optionsCamera).then(
									// 				(image: any) => {
									// 					setFileUpload(image.data);
									// 				},
									// 		  );
									// }}

									onPress={async () =>
										modalGalleryRef.current.onShowModal(true)
									}
								>
									{fileUpload ? (
										<View style={{ width: '100%', position: 'relative' }}>
											{/* <Image
												source={{
													uri:
														fileUpload.type === 'pdf'
															? 'https://img.icons8.com/bubbles/344/pdf-2.png'
															: `data:image/jpeg;base64,${fileUpload.base64}`,
												}}
												resizeMode={
													fileUpload && fileUpload.type != 'pdf'
														? 'cover'
														: 'contain'
												}
												style={{ width: '100%', height: 70 }}
											/> */}
											{checkTypeView(fileUpload)}
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
						</Card>
						<Button
							mode="contained"
							style={{ marginTop: 10 }}
							uppercase={false}
							loading={buttonLoading}
							disabled={buttonLoading}
							onPress={() =>
								_onPress_UpLoad(
									fileUpload?.base64,
									genItemName(),
									fileUpload?.type,
								)
							}
						>
							{'Upload'}
						</Button>
						<View>
							<ImageViewerCustom
								ref={ref => {
									fileUploadRef.current = ref;
								}}
							/>
						</View>
						<SafeAreaView style={{ height: 60 }} />
					</View>
					<ChooseGalleryModal
						ref={modalGalleryRef}
						onPress_File={_onPress_File}
						onPress_Gallrey={_open_Gallrey}
						onPress_MyCloud={_open_MyCloud}
					/>

					<ScrollView
						style={{
							flex: 1,
							marginTop: fileUpload
								? DeviceInfo.hasNotch()
									? 140
									: 70
								: DeviceInfo.hasNotch()
								? 70
								: 8,
						}}
						horizontal={false}
						showsVerticalScrollIndicator={false}
					>
						{listFile
							? listFile?.map((item, index) => (
									// <Card
									// 	elevation={2} //: 0
									// 	key={item.NAME}
									// 	style={{ marginHorizontal: 8, marginBottom: 8 }}
									// >
									<View
										key={index.toString()}
										style={{
											padding: 8,
											backgroundColor: true ? '#fff' : Colors.lightGreen100,
											borderRadius: 4,
										}}
									>
										<Text style={{ marginBottom: 8 }}>{item?.NAME}</Text>
										<ScrollView
											style={{ flexDirection: 'row' }}
											horizontal={true}
											showsHorizontalScrollIndicator={false}
										>
											{item?.ListImage.map((image, index) => (
												<View
													key={index.toString()}
													style={{ marginTop: 8, flex: 1 }}
												>
													<Card
														style={{
															marginBottom: 8,
															marginLeft: index === 0 ? 0 : 8,
															marginTop: 1,
														}}
													>
														{checkType(image)}
													</Card>
													<TouchableOpacity
														style={{
															position: 'absolute',
															right: -3,
														}}
														onPress={() => _deleteFile()}
													>
														<View>
															<Icon
																as={Ionicons}
																name={'close-circle-outline'}
																size={5}
																color={'red.500'}
															/>
														</View>
													</TouchableOpacity>
												</View>
											))}
										</ScrollView>
									</View>
									// </Card>
							  ))
							: null}
					</ScrollView>
				</KeyboardAvoidingView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
