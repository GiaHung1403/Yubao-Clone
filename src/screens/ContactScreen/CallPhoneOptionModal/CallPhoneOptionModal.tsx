import Color from "@config/Color";
import {Ionicons} from "@expo/vector-icons";
import {IContact, ISpotlight, IUserLoginRC} from "@models/types";
import {useNavigation} from "@react-navigation/native";
import {callPhoneDefault} from "@utils/callPhone";
import {Icon} from "native-base";
import React, {useImperativeHandle, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import {Portal,useTheme} from "react-native-paper";
import {useSelector} from "react-redux";

function CallPhoneOptionModal(props: any, ref: any) {
    const navigation: any = useNavigation();
    const dataUserRC: IUserLoginRC = useSelector((state: any) => state.auth_reducer.dataUserRC);
    const {colors} = useTheme()
    const [visible, setVisible] = useState<boolean>(false);
    const [contact, setContact] = useState<IContact>();
    const [roomChat, setRoomChat] = useState<ISpotlight>();

    useImperativeHandle(ref, () => ({
        onShowModal: ({contactItem, room}) => {
            showModal();
            setContact(contactItem);
            setRoomChat(room);
        },
    }));

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const onPressCallYubao = () => {
        hideModal();
        navigation.navigate('ChatCallScreen', {
            isVideoCall: false,
            username: dataUserRC.me.username,
            roomID: roomChat?.rid,
        });
    }

    return (
        <Portal>
            <Modal isVisible={visible} onBackdropPress={hideModal}>
                <View style={{
                    backgroundColor: 'white',
                    padding: 12,
                    borderRadius: 4,
                }}
                >
                    {/* {contact?.dept_code !== "9999" && (
                        <View>
                            <TouchableOpacity onPress={() => callPhoneDefault(contact?.cellphone || "")}>
                                <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 16}}>
                                    <Icon as={Ionicons}
                                          name={"person-outline"}
                                          size={6}
                                          marginRight={8}
                                          color={Color.approved}
                                    />
                                    <Text>Personal phone number (
                                        <Text style={{color: Color.approved, fontWeight: "600"}}>
                                            {contact?.cellphone}
                                        </Text>)
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{height: 0.5, width: "100%", backgroundColor: "#dedede"}}/>
                        </View>

                    )} */}

                    <TouchableOpacity onPress={() => callPhoneDefault(`02873016010,${contact?.ext}`)}>
                        <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 16}}>
                            <Icon as={Ionicons}
                                  name={"briefcase-outline"}
                                  size={6}
                                  marginRight={8}
                                  color={colors.primary}
                            />
                            <Text>Ext. number (
                                <Text style={{color: colors.primary, fontWeight: "600"}}>
                                    {contact?.ext.trim()}
                                </Text>)
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{height: 0.5, width: "100%", backgroundColor: "#dedede"}}/>
                    <TouchableOpacity onPress={onPressCallYubao}>
                        <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 16}}>
                            <Icon as={Ionicons}
                                  name={"briefcase-outline"}
                                  size={6}
                                  marginRight={8}
                                  color={Color.status}
                            />
                            <Text>Yubao</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </Portal>
    )
}

export default React.forwardRef(CallPhoneOptionModal);
