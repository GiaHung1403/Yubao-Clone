import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import {getAssetCheckingRequests} from "@actions/request_customer_action";
import Header from '@components/Header';
import ImageViewerCustom from "@components/ImageViewerCustom";
import PickerCustomComponent from "@components/PickerCustomComponent";
import TextInputCustomComponent from "@components/TextInputCustomComponent";
import Color from "@config/Color";
import {
    getAssetsCheckingRequestDetail,
    getListAssetCheckingType,
    insertAssetCheckingRequestMaster, updateRequestDetail,
    updateStatusDetail
} from "@data/api";
import {Ionicons} from "@expo/vector-icons";
import {
    IAssetCheckingRequest,
    IAssetCheckingRequestDetail,
    IAssetCheckingType,
    ICustomer,
    IUserSystem
} from "@models/types";
import {useDimensions} from "@react-native-community/hooks";
import axios from "axios";
import {Icon} from "native-base";
import {Swipeable} from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";
import {Button, Card, Colors, useTheme} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import styles from './styles';

interface IPropsItemChip {
    iconRight?: string,
    name: string,
    index: number,
    isItemSelected: boolean,
    onPress?: () => void
}

interface IPropsRoute {
    customerSelected: ICustomer,
    requestItem: IAssetCheckingRequest,
    CNID: string
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

export function RequestCustomerCreateScreen(props: any) {
    const navigation: any = useNavigation();
    const refSwipe = useRef<any[]>();
    const imageViewerRef = useRef<any>();
    const dispatch = useDispatch();
    const{colors} = useTheme()

    const {customerSelected, CNID, requestItem}: IPropsRoute = props.route.params;
    const widthScreen = useDimensions().window.width;

    const dataUserSystem: IUserSystem = useSelector(
        (state: any) => state.auth_reducer.dataUserSystem,
    );

    const [typeRequest, setTypeRequest] = useState<number[]>([]);
    const [listTypeRequest, setListTypeRequest] = useState<IAssetCheckingType[]>([])
    const [listMasterType, setListMasterType] = useState<any>([
        {label: "Credit checking", value: "1"},
        {label: "Security asset checking for commencement", value: "2"},
    ])
    const [typeMasterSelected, setTypeMasterSelected] = useState<string>(requestItem?.NOTIFY_TYPE || "1")
    const [listRequestDetailOrigin, setListRequestDetailOrigin] = useState<IAssetCheckingRequestDetail[]>([])
    const [listRequestDetail, setListRequestDetail] = useState<IAssetCheckingRequestDetail[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [indexItemLoading, setIndexItemLoading] = useState<number>();
    const [customerData, setCustomerData] = useState<ICustomer>();
    const [subject, setSubject] = useState(requestItem?.SUBJECT || "");
    const [content, setContent] = useState(requestItem?.CONTENT || "");

    useEffect(() => {
        (async function getData() {
            const dataType: any = await getListAssetCheckingType({
                User_ID: dataUserSystem.EMP_NO,
                Password: ""
            });
            const listTypeConvert = dataType.map(item => ({...item, ALLOW_E: true}))
            setListTypeRequest(listTypeConvert);

            if (requestItem) {
                const dataRequestDetail: any = await getAssetsCheckingRequestDetail({
                    User_ID: dataUserSystem.EMP_NO,
                    Password: "",
                    idMaster: requestItem.ID
                })

                const dataRequestConvert = dataRequestDetail.map(item => ({
                    ...item,
                    LINK: item.LINK?.split(";").filter(link => link) || []
                }))
                setListRequestDetail(dataRequestConvert);
                setListRequestDetailOrigin(dataRequestDetail);
            }
        })()

    }, [])

    useEffect(() => {
        if (customerSelected) {
            setCustomerData(customerSelected);
        }
    }, [customerSelected])

    const _onPressCreateRequest = async ({flag}) => {
        try {
            // API Create
            const responseListDetail = await insertAssetCheckingRequestMaster({
                User_ID: dataUserSystem.EMP_NO,
                Password: "",
                customerID: customerData?.LESE_ID || requestItem?.LESE_ID,
                CNID: CNID || requestItem?.CNID,
                requestMasterType: typeMasterSelected,
                subject,
                content,
                flag,
                idMaster: requestItem?.ID
            }) as IAssetCheckingRequestDetail[];

            dispatch(getAssetCheckingRequests({User_ID: dataUserSystem?.EMP_NO, Password: ""}));
            if (flag === "I") {
                // API Update Status
                for (const [index, itemDetail] of responseListDetail.entries()) {
                    if (!listTypeRequest[index].ALLOW_E) {
                        await updateStatusDetail({
                            User_ID: dataUserSystem.EMP_NO,
                            Password: "",
                            status: 0,
                            idDetail: itemDetail.Ident00
                        });
                    }
                }
                navigation.goBack();
            } else {
                Alert.alert("Success", "Save data success!")
            }
        } catch (e: any) {
            Alert.alert("Error", e.message);
        }
    }

    const _onPressChooseImgVideo = async (indexType, indexImage) => {
        const listRequestDetailNew = [...listRequestDetail];
        listRequestDetailNew[indexType].LINK[indexImage]
            ? imageViewerRef.current.onShowViewer(
                [{url: listRequestDetailNew[indexType].LINK[indexImage]}],
                0,
            )
            : ImagePicker.openPicker(optionsCamera).then((image: any) => {
                listRequestDetailNew[indexType].LINK[indexImage] = image.data;
                setListRequestDetail(listRequestDetailNew)
            });
    }

    const _onPressChooseType = ({typeItem, typeIndex}) => {
        setListTypeRequest(listOld => {
            const listTypeNew = [...listOld];
            typeItem.ALLOW_E = !typeItem.ALLOW_E;
            listTypeNew[typeIndex] = typeItem;
            return listTypeNew;
        })
    }

    const _onSwipeableLeftOpen = async (item: IAssetCheckingRequestDetail, index) => {
        refSwipe[index]?.close()
        await updateStatusDetail({
            User_ID: dataUserSystem.EMP_NO,
            Password: "",
            status: item.ALLOW_E ? 0 : 1,
            idDetail: item.Ident00
        });

        setListRequestDetail(listOld => {
            const listTypeNew = [...listOld];
            item.ALLOW_E = !item.ALLOW_E;
            listTypeNew[index] = item;
            return listTypeNew;
        })
    }

    const _onSwipeableRightOpen = async (item: IAssetCheckingRequestDetail, indexContainer) => {
        refSwipe[indexContainer]?.close();
        let links = "";
        for (const [index, image] of item.LINK.entries()) {
            if (image.includes("http")) {
                links = links + `${image};`;
            } else {
                try {
                    const response: any = await axios.post('http://124.158.8.254:3030/upload/upload_image_asset_checking', {
                        imageBase64: image,
                        fileName: `${item.TYPE_ID}_${index}`,
                    });
                    links = links + `${response.data.data};`
                } catch (e: any) {
                    Alert.alert("Error", e.message);
                }
            }
        }

        await updateRequestDetail({
            User_ID: dataUserSystem.EMP_NO,
            Password: "",
            idDetail: item.Ident00,
            links
        })
    }

    const renderItemChip = ({iconRight, name, isItemSelected, index, onPress}: IPropsItemChip) => {
        return (
            <TouchableOpacity
                key={index.toString()}
                style={{
                    marginRight: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: index === 0 ? 0 : 8
                }}
                onPress={onPress}
            >
                <View
                    style={{
                        backgroundColor: isItemSelected ? colors.primary : '#d5d5d5',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 50,
                        flexDirection: 'row',
                        paddingVertical: 6,
                        paddingHorizontal: 16,
                    }}
                >
                    {iconRight &&
                        <Icon as={Ionicons} name={iconRight} color={Color.approved} size={6} onPress={onPress}/>}
                    <Text
                        style={{
                            color: isItemSelected ? "#fff" : '#000',
                            marginLeft: 8,
                        }}
                    >
                        {name}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };

    return (
			<View style={{ flex: 1 }}>
				<Header title={'Request Customer Info'} />

				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					<Card style={{ marginHorizontal: 8, marginTop: 8, padding: 8 }}>
						<PickerCustomComponent
							showLabel={true}
							listData={listMasterType}
							label="Type request"
							value={typeMasterSelected}
							style={{ flex: 1 }}
							onValueChange={text => setTypeMasterSelected(text)}
						/>

						<TextInputCustomComponent
							label="Customer Name"
							placeholder="Customer Name"
							enable={false}
							iconRight={'search-outline'}
							value={customerData?.LS_NM || requestItem?.LS_NM}
							style={{ marginTop: 8 }}
							onPress={() =>
								navigation.navigate('ChooseCustomerModal', {
									idCustomerExisted: customerData?.LESE_ID,
									screenBack: 'RequestCustomerCreateScreen',
								})
							}
						/>

						<TextInputCustomComponent
							label="Consultation"
							placeholder="Consultation"
							enable={false}
							iconRight={'search-outline'}
							value={CNID || requestItem?.CNID}
							style={{ marginTop: 8 }}
							onPress={() =>
								navigation.navigate('ChooseConsultationModal', {
									leseID: customerData?.LESE_ID,
									CNIDOld: CNID,
									screenBack: 'RequestCustomerCreateScreen',
								})
							}
						/>
					</Card>

					<Card style={{ marginHorizontal: 8, marginTop: 8, padding: 8 }}>
						<TextInputCustomComponent
							label="Subject"
							value={subject}
							multiline
							inputStyle={{ height: 20 }}
							onChangeText={setSubject}
						/>
						<TextInputCustomComponent
							label="Content"
							value={content}
							multiline
							inputStyle={{ height: 60 }}
							style={{ marginTop: 8 }}
							onChangeText={setContent}
						/>
					</Card>

					{requestItem ? (
						<View>
							<View style={{ marginTop: 8 }}>
								{listRequestDetail.map((item, index) => (
									<Card
										elevation={item.ALLOW_E ? 2 : 0}
										key={item.NAME}
										style={{ marginHorizontal: 8, marginBottom: 8 }}
									>
										<Swipeable
											ref={(ref: any) => {
												refSwipe[index] = ref;
											}}
											onSwipeableLeftOpen={() =>
												_onSwipeableLeftOpen(item, index)
											}
											onSwipeableRightOpen={() =>
												_onSwipeableRightOpen(item, index)
											}
											renderLeftActions={() => (
												<View
													style={{
														justifyContent: 'center',
														alignItems: 'flex-start',
														flex: 1,
														backgroundColor: item.ALLOW_E
															? Color.approved
															: 'red',
														borderRadius: 4,
													}}
												>
													<Text
														style={{
															color: '#fff',
															fontWeight: '500',
															width: 150,
															textAlign: 'center',
															textAlignVertical: 'center',
														}}
													>
														{item.ALLOW_E ? 'Done' : 'Not Done'}
													</Text>
												</View>
											)}
											renderRightActions={() =>
												item.ALLOW_E ? (
													<View
														style={{
															justifyContent: 'center',
															alignItems: 'flex-end',
															flex: 1,
															backgroundColor: Color.main,
															borderRadius: 4,
														}}
													>
														<Text
															style={{
																color: '#fff',
																fontWeight: '500',
																width: 150,
																textAlign: 'center',
																textAlignVertical: 'center',
															}}
														>
															Save
														</Text>
													</View>
												) : null
											}
										>
											<View
												style={{
													padding: 8,
													backgroundColor: item.ALLOW_E
														? '#fff'
														: Colors.lightGreen100,
													borderRadius: 4,
												}}
											>
												<Text style={{ marginBottom: 8 }}>{item.NAME}</Text>
												<View style={{ flexDirection: 'row' }}>
													{Array.from(
														Array(
															parseInt(item.IMAGE_NUM.toString(), 10),
														).keys(),
													)
														.map((_, indexImage) => indexImage.toString())
														.map((_, indexImage) => (
															<Card
																style={{
																	height: 100,
																	maxWidth: widthScreen / 3 - 8,
																	flex: 1,
																	marginBottom: 8,
																	marginLeft: indexImage === 0 ? 0 : 8,
																}}
																key={indexImage.toString()}
																onPress={() =>
																	item.ALLOW_E
																		? _onPressChooseImgVideo(index, indexImage)
																		: null
																}
															>
																{item.LINK[indexImage] && (
																	<View
																		style={{
																			position: 'absolute',
																			zIndex: 2,
																			top: -7,
																			right: -7,
																		}}
																	>
																		<Icon
																			as={Ionicons}
																			name={'close-circle'}
																			color={'red.500'}
																			size={5}
																			onPress={() => {
																				const listRequestDetailNew = [
																					...listRequestDetail,
																				];
																				listRequestDetailNew[index].LINK.splice(
																					indexImage,
																					1,
																				);
																				setListRequestDetail(
																					listRequestDetailNew,
																				);
																			}}
																		/>
																	</View>
																)}

																<View
																	style={{
																		justifyContent: 'center',
																		alignItems: 'center',
																		flex: 1,
																		borderRadius: 4,
																		overflow: 'hidden',
																	}}
																>
																	{indexItemLoading === index && loading ? (
																		<View>
																			<ActivityIndicator />
																		</View>
																	) : item.LINK[indexImage] ? (
																		<Image
																			source={{
																				uri: item.LINK[indexImage].includes(
																					'http',
																				)
																					? item.LINK[indexImage]
																					: `data:image/png;base64,${item.LINK[indexImage]}`,
																			}}
																			resizeMode="cover"
																			style={{ width: '100%', height: '100%' }}
																		/>
																	) : (
																		<Icon
																			as={Ionicons}
																			name={'image-outline'}
																			color={Color.main}
																		/>
																	)}
																</View>
															</Card>
														))}
												</View>
											</View>
										</Swipeable>
									</Card>
								))}
							</View>

							<View
								style={{
									flexDirection: 'row',
									marginHorizontal: 8,
									marginTop: 12,
								}}
							>
								<Button
									mode={'contained'}
									uppercase={false}
									loading={loading}
									style={{
										flex: 1,
									}}
									onPress={() => _onPressCreateRequest({ flag: 'U' })}
								>
									{loading ? 'Loading...' : 'Save'}
								</Button>
								<Button
									mode={'contained'}
									uppercase={false}
									loading={loading}
									style={{
										flex: 1,
										marginLeft: 8,
										backgroundColor: Color.approved,
									}}
									onPress={() => null}
								>
									Send Notification
								</Button>
							</View>
						</View>
					) : (
						<View>
							<Card
								style={{
									marginHorizontal: 8,
									marginTop: 8,
									padding: 8,
									flexDirection: 'row',
								}}
							>
								{listTypeRequest
									.filter(item => item.NOTIFY_TYPE === typeMasterSelected)
									.map((item, index) =>
										renderItemChip({
											name: item.NAME,
											isItemSelected: item.ALLOW_E,
											index,
											onPress: () =>
												_onPressChooseType({
													typeItem: item,
													typeIndex: index,
												}),
										}),
									)}
							</Card>

							<Button
								mode={'contained'}
								uppercase={false}
								loading={loading}
								style={{
									marginHorizontal: 8,
									marginTop: 12,
									backgroundColor: Color.approved,
								}}
								onPress={() => _onPressCreateRequest({ flag: 'I' })}
							>
								{loading ? 'Loading...' : 'Create'}
							</Button>
						</View>
					)}

					<SafeAreaView style={{ height: 60 }} />
				</ScrollView>

				<ImageViewerCustom
					ref={ref => {
						imageViewerRef.current = ref;
					}}
				/>
			</View>
		);
}
