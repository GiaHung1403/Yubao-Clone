import axios from "axios";
import React, {useEffect, useState} from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    View
} from "react-native";
import {readFile} from "react-native-fs";
import RNImageToPdf from 'react-native-image-to-pdf';
import {Button, Card, Checkbox , useTheme} from "react-native-paper";
import {useSelector} from "react-redux";

import Header from "@components/Header";
import TextInputCustomComponent from "@components/TextInputCustomComponent";
import Color from "@config/Color";
import {submitDataVRC} from "@data/api";
import {IUserSystem} from "@models/types";
import {removeVietnameseTones} from "@utils";

const deviceHeight = () => Dimensions.get('screen').height;
const deviceWidth = () => Dimensions.get('screen').width;

export function VRCResultScreen(props: any) {
    const {resultFront, resultBack, APNO, assetSelected, imageFront, imageBack} = props.route.params;

    const {colors} = useTheme()
    const dataUserSystem: IUserSystem = useSelector(
        (state: any) => state.auth_reducer.dataUserSystem,
    );

    const [loading, setLoading] = useState(false);
    const [isCheckedSaveImage, setCheckedSaveImage] = useState(false);
    const [isCheckedShowLog, setCheckedShowLog] = useState(false);
    const [cavetNo, setCavetNo] = useState("");
    const [licensePlates, setLicensePlates] = useState("");
    const [brand, setBrand] = useState("");
    const [modelCode, setModelCode] = useState("");
    const [engineNumber, setEngineNumber] = useState("");
    const [chassisNumber, setChassisNumber] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const textFrontRemoveTones = removeVietnameseTones(resultFront);
        const textBackRemoveTones = removeVietnameseTones(resultBack);

        const listTextFrontSplit: string[] = textFrontRemoveTones.split(/[\n|]+/);
        const listTextBackSplit: string[] = textBackRemoveTones.split(/[\n|]+/);

        if (textFrontRemoveTones.toUpperCase().includes("GIAY HEN")) {
            handleResultAppointment(listTextFrontSplit);
        } else if (
            textFrontRemoveTones
                .toUpperCase()
                .includes("CHUNG NHAN CHAT LUONG AN TOAN KY THUAT")
        ) {
            handleResultTechnicalSafe(listTextFrontSplit);
        } else if (textFrontRemoveTones.toUpperCase().includes("CHUYEN DUNG")) {
            handleResultFrontCavet(listTextFrontSplit);
            handleResultBackCavet(listTextBackSplit);
        } else if (
            textFrontRemoveTones.toUpperCase().includes("KIEM DINH AN TOAN")
        ) {
            handleResultSafeTesting(listTextFrontSplit);
        } else {
            handleResultFrontCavetNormal(listTextFrontSplit);
            handleResultBackCavetNormal(listTextBackSplit);
        }
    }, [resultFront, resultBack]);

    const handleResultAppointment = listText => {
        for (const text of listText) {
            if (text.includes("Bien kiem soat")) {
                const index = text.indexOf("soat:");
                const textSplitLabel = text.substr(index + 5);
                const indexSpace = textSplitLabel.indexOf(" ");
                const result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                setLicensePlates(result);
            }
            if (text.includes("Nhan hieu")) {
                const index = text.indexOf("hieu:");
                const textSplitLabel = text.substr(index + 5);
                const indexSpace = textSplitLabel.indexOf(" ");
                const result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                setBrand(result);
            }
            if (text.includes("So loai")) {
                const index = text.indexOf("loai:");
                const result = text.substr(index + 5);
                setModelCode(result);
            }
            if (text.includes("So may")) {
                const index = text.indexOf("may:");
                const textSplitLabel = text.substr(index + 4);
                const indexSpace = textSplitLabel.indexOf(" ");
                const result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                setEngineNumber(result);
            }
            if (text.includes("So khung")) {
                const index = text.indexOf("khung:");
                const result = text.substr(index + 6);
                setChassisNumber(result);
            }
        }
    };

    const handleResultSafeTesting = listText => {
        const indexModel = listText.findIndex(item => item.includes("Ma hieu"));
        const itemModel = listText[indexModel];
        const indexDotModel = itemModel.indexOf(":");
        let resultModel = itemModel.substr(indexDotModel + 2);
        if (!resultModel) {
            resultModel = listText[indexModel + 1]
        }
        setModelCode(resultModel);

        for (const text of listText) {
            if (text.toLowerCase().includes("ten doi tuong")) {
                const index = text.indexOf(":");
                let result = text.substr(index + 2);
                if (!result) {
                    const indexName = listText.findIndex(item =>
                        item.includes("ten doi tuong"),
                    );
                    result = listText[indexName + 1]
                }
                setName(result);
            }
            if (text.includes("SK")) {
                const index = text.indexOf("SK:");
                const textSplitLabel = text.substr(index + 4);
                const indexSpace = textSplitLabel.indexOf(" ");
                const result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                setChassisNumber(result);
            }
            if (text.includes("SM")) {
                const index = text.indexOf("SM:");
                const result = text.substr(index + 4);
                setEngineNumber(result);
            }
        }
    };

    const handleResultTechnicalSafe = listText => {
        for (const text of listText) {
            if (text.includes("So (")) {
                let index = text.indexOf("(Nº)");
                if (index === -1) {
                    index = text.indexOf(" (N)");
                }
                const textSplitLabel = text.substr(index + 6);
                setCavetNo(textSplitLabel);
            }
            if (text.includes("TCM's type") || text.includes("TCM’s type")) {
                const index = text.indexOf("type)");
                const textSplitLabel = text.substr(index + 7);
                setName(textSplitLabel);
            } else if (text.includes("(TCM)")) {
                const index = text.indexOf("TCM):");
                let textSplitLabel = text.substr(index + 6);
                if (!textSplitLabel) {
                    const indexName = listText.findIndex(item => item.includes("(TCM)"));
                    textSplitLabel = listText[indexName + 1];
                }
                setName(textSplitLabel);
            }
            if (text.includes("Trade mark")) {
                const index = text.indexOf("mark");
                const textSplitLabel = text.substr(index + 7);
                setBrand(textSplitLabel);
            } else if (text.includes("Mark")) {
                const index = text.indexOf("Mark)");
                const textSplitLabel = text.substr(index + 7);
                setBrand(textSplitLabel);
            }
            if (text.includes("Model code")) {
                const index = text.indexOf("code)");
                const result = text.substr(index + 7);
                setModelCode(result);
            }
            if (text.includes("So khung")) {
                const index = text.indexOf("Chassis");
                const textSplitLabel = text.substr(index + 12).trimStart();
                const indexSpace = textSplitLabel.indexOf(" ");
                let result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                if (!result) {
                    const indexChassis = listText.findIndex(item =>
                        item.includes("Chassis"),
                    );
                    result = listText[indexChassis + 1];
                }
                setChassisNumber(result);
            }
            if (text.includes("So dong co") || text.includes("S6 dong co")) {
                const index = text.indexOf("Engine");
                const textSplitLabel = text.substr(index + 11).trimStart();
                const indexSpace = textSplitLabel.indexOf(" ");
                const result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                setEngineNumber(result);
            }
        }
    };

    const handleResultFrontCavet = listText => {
        const indexLabelPlates = listText.findIndex(item =>
            item.includes("Bien so dang ky"),
        );
        const listIncludePlates = listText.slice(indexLabelPlates);
        const resultPlates = listIncludePlates.find(item => item.includes("-"));
        setLicensePlates(resultPlates);

        for (const text of listText) {
            if (text.includes("So")) {
                const index = text.indexOf("So");
                let textSplitLabel = text.substr(index + 3).trimStart();
                if (!textSplitLabel) {
                    const indexHP = listText.findIndex(item =>
                        item.includes("Hanh phuc"),
                    );
                    textSplitLabel = listText[indexHP + 2].split(" ")[0];
                    if (!textSplitLabel || textSplitLabel.includes("So")) {
                        textSplitLabel = listText[indexHP + 1].split(" ")[0];
                    }
                }
                setCavetNo(textSplitLabel);
                break;
            }
        }
    };

    const handleResultBackCavet = listText => {
        const indexProperty = listText.findIndex(text =>
            text.toUpperCase().includes("DAC DIEM"),
        );
        const indexLabelBrand = listText.findIndex(text =>
            text.includes("Nhan hieu"),
        );
        const indexKg = listText.findIndex(text => text.includes("Kich thuoc"));
        const listIncludePlates = listText.slice(0, indexKg);


        if (indexLabelBrand - indexProperty === 2) {
            const itemBrand = listText[indexLabelBrand];

            const index = itemBrand.indexOf("hieu:");
            const textSplitLabel = itemBrand.substr(index + 5).trimStart();
            const indexSpace = textSplitLabel.indexOf(" ");
            const result = textSplitLabel.substr(
                0,
                indexSpace > -1 ? indexSpace : undefined,
            );
            setBrand(`${listText[indexProperty + 1]} ${result}`);
        } else {
            const itemBrand = listText[indexLabelBrand];
            const index = itemBrand.indexOf("hieu");
            const textSplitLabel = itemBrand.substr(index + 6).trimStart();
            const indexSpace = textSplitLabel.indexOf(" ");
            const result = textSplitLabel.substr(
                0,
                indexSpace > -1 ? indexSpace : undefined,
            );
            setBrand(result);
        }
        for (const text of listText) {
            if (text.includes("So dong co")) {
                const index = text.indexOf("co");
                const textSplitLabel = text.substr(index + 4).trimStart();
                const indexSpace = textSplitLabel.indexOf(" ");
                let result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                if (!result) {
                    for (const textValue of listIncludePlates) {
                        const regex = /\d/;
                        if (textValue.includes("-") && regex.test(textValue)) {
                            result = textValue;
                            break;
                        }
                    }
                }
                setEngineNumber(result);
            }
            if (text.toLowerCase().includes("so khung")) {
                const index = text.indexOf("khung");
                const textSplitLabel = text.substr(index + 6).trimStart();
                const indexSpace = textSplitLabel.indexOf(" ");
                let result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                if (!result) {
                    for (const textValue of listIncludePlates) {
                        const regex = /\d/;
                        if (textValue.includes("-") && regex.test(textValue)) {
                            result = textValue;
                        }
                    }
                }
                setChassisNumber(result);
            }
        }
    };

    const handleResultFrontCavetNormal = listText => {
        for (const text of listText) {
            if (text.includes("Number")) {
                const index = text.indexOf("Number)");
                const textSplitLabel = text.substr(index + 8).trimStart();
                const resultNoSpace = textSplitLabel.replace(/ /g, "");
                const result1 = resultNoSpace.substr(0, 2);
                const result2 = resultNoSpace.substr(2);
                setCavetNo(`${result1} ${result2}`);
            }
        }
    };

    const handleResultBackCavetNormal = listText => {
        const indexLabelPlates = listText.findIndex(item =>
            item.toLowerCase().includes("bien so dang ky"),
        );
        const listIncludePlates = listText.slice(indexLabelPlates);
        const listNotIncludePlates = listText.slice(0, indexLabelPlates);
        const resultPlates = listIncludePlates.find(item => item.includes("-"));
        const indexSpacePlate = resultPlates.indexOf(" ");
        setLicensePlates(resultPlates.substr(
            0,
            indexSpacePlate > -1 ? indexSpacePlate : undefined,
        ));

        for (const text of listNotIncludePlates) {
            if (text.includes("Brand") || text.includes("Band")) {
                const index = text.indexOf("and)");
                const textSplitLabel = text.substr(index + 5).trimStart();
                const indexSpace = textSplitLabel.indexOf(" ");
                const result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                setBrand(result);
            }
            if (text.includes("Model code")) {
                const index = text.indexOf("code)");
                const textSplitLabel = text.substr(index + 6).trimStart();
                const indexSpace = textSplitLabel.indexOf(" ");
                const result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                setModelCode(result);
            }
            if (text.toLowerCase().includes("engine")) {
                const index = text.indexOf(")");
                const textSplitLabel = text.substr(index + 2).trimStart();
                const indexSpace = textSplitLabel.indexOf(" ");
                let result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                if (!result) {
                    const indexLabelEngine = listText.findIndex(item =>
                        item.includes("Engine"),
                    );
                    result = listText[indexLabelEngine + 2];
                }

                setEngineNumber(result);
            }
            if (text.includes("Chassis")) {
                const index = text.indexOf(")");
                const textSplitLabel = text.substr(index + 2).trimStart();
                const indexSpace = textSplitLabel.indexOf(" ");
                let result = textSplitLabel.substr(
                    0,
                    indexSpace > -1 ? indexSpace : undefined,
                );
                if (!result) {
                    const indexLabelAddress = listText.findIndex(item =>
                        item.includes("(Address)"),
                    );
                    const valueItemIncludesChassis = listText[indexLabelAddress - 1];
                    const listValue = valueItemIncludesChassis.split(" ");

                    const regex = /\d/;
                    result = listValue.find(
                        char =>
                            char.length === 12 && regex.test(char) && !char.includes("-"),
                    );
                }
                setChassisNumber(result);
            }
        }
    };

    const _onPressSave = async () => {
        setLoading(true);

        const imagePaths: any = [];
        if (imageFront) imagePaths.push(imageFront);
        if (imageBack) imagePaths.push(imageBack)
        try {
            const options = {
                imagePaths: imagePaths.map(image => {
                    return Platform.OS === "android" ? "file:" : "" + image.path;
                }),
                name: 'PDF_File_Convert',
                maxSize: {
                    // optional maximum image dimension - larger images will be resized
                    width: 900,
                    height: Math.round((deviceHeight() / deviceWidth()) * 900),
                },
                quality: 0.5, // optional compression paramter
            };
            const pdf = await RNImageToPdf.createPDFbyImages(options);
            let base64Data = await readFile(pdf.filePath, "base64");

            if (Platform.OS === "android") {
                base64Data = `data:application/pdf;base64,` + base64Data;
            }

            if (isCheckedSaveImage) {
                await axios.post('http://124.158.8.254:3030/upload/upload_image_vrc', {
                    imageBase64: base64Data,
                    fileName: `${APNO}_${assetSelected?.ASTS_ID}` + assetSelected?.isMortgage ? "_SECU" : "",
                });
            }

            await submitDataVRC({
                isMortgageAssets: assetSelected?.isMortgage,
                empNo: dataUserSystem.EMP_NO,
                assetID: assetSelected?.ASTS_ID,
                APNO,
                model: modelCode,
                serialNO: cavetNo,
                brand,
                plateNo: licensePlates,
                chassisNo: chassisNumber,
                engineNo: engineNumber
            });

            setLoading(false);
            Alert.alert("Success", "Save info success!");
        } catch (e: any) {
            setLoading(false);
            Alert.alert("Error", e.message());
        }
    }

    return (
        <View style={{flex: 1}}>
            <Header title={"Result Scan"}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'android' ? undefined : 'padding'}
                style={{flex: 1}}
            >
                <ScrollView style={{flex: 1}}>
                    <View style={{padding: 8}}>
                        <Card style={{padding: 8, marginBottom: 10}}>
                            <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 8}}>
                                <Text style={{fontWeight: "600"}}>APNO</Text>
                                <Text style={{color: colors.primary, fontWeight: "600"}}>{APNO}</Text>
                            </View>

                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={{fontWeight: "600", flex: 1}}>Asset</Text>
                                <Text style={{
                                    color: Color.approved,
                                    fontWeight: "600",
                                    flex: 3,
                                    textAlign: "right"
                                }}>{assetSelected?.ASTS_NM}</Text>
                            </View>
                        </Card>


                        <Card style={{padding: 8}}>
                            <TextInputCustomComponent
                                label="Name"
                                placeholder="Name"
                                value={name}
                                style={{marginBottom: 8}}
                                onChangeText={text => setName(text)}
                            />
                            <View style={{flexDirection: "row", marginBottom: 8}}>
                                <TextInputCustomComponent
                                    label="Number"
                                    placeholder="Number"
                                    value={cavetNo}
                                    style={{flex: 1, marginRight: 8}}
                                    onChangeText={text => setCavetNo(text)}
                                />

                                <TextInputCustomComponent
                                    label="Plate No"
                                    placeholder="Plate No"
                                    value={licensePlates}
                                    style={{flex: 1}}
                                    onChangeText={text => setLicensePlates(text)}
                                />
                            </View>

                            <View style={{flexDirection: "row", marginBottom: 8}}>
                                <TextInputCustomComponent
                                    label="Brand"
                                    placeholder="Brand"
                                    value={brand}
                                    style={{flex: 1, marginRight: 8}}
                                    onChangeText={text => setBrand(text)}
                                />

                                <TextInputCustomComponent
                                    label="Model Code"
                                    placeholder="Model Code"
                                    value={modelCode}
                                    style={{flex: 1}}
                                    onChangeText={text => setModelCode(text)}
                                />
                            </View>

                            <TextInputCustomComponent
                                label="Engine Number"
                                placeholder="Engine Number"
                                value={engineNumber}
                                style={{marginBottom: 8}}
                                onChangeText={text => setEngineNumber(text)}
                            />

                            <TextInputCustomComponent
                                label="Chassis Number"
                                placeholder="Chassis Number"
                                value={chassisNumber}
                                style={{marginBottom: 8}}
                                onChangeText={text => setChassisNumber(text)}
                            />

                        </Card>

                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Checkbox.Item
                                mode={"android"}
                                position={"leading"}
                                label={"Check to save picture"}
                                labelStyle={{fontSize: 14, color: "#666", fontWeight: "600"}}
                                style={{paddingHorizontal: 0}}
                                status={isCheckedSaveImage ? "checked" : "unchecked"}
                                onPress={() => {
                                    setCheckedSaveImage(!isCheckedSaveImage);
                                }}
                                color={colors.primary}
                                uncheckedColor={"#ddd"}
                            />

                            <Checkbox.Item
                                mode={"android"}
                                position={"trailing"}
                                label={"Show result"}
                                labelStyle={{fontSize: 14, color: "#666", fontWeight: "600"}}
                                style={{paddingHorizontal: 0}}
                                status={isCheckedShowLog ? "checked" : "unchecked"}
                                onPress={() => {
                                    setCheckedShowLog(!isCheckedShowLog);
                                }}
                                color={colors.primary}
                                uncheckedColor={"#ddd"}
                            />
                        </View>

                        {isCheckedShowLog && resultFront ? <View>
                            <Text style={{color: colors.primary, fontWeight: "600", marginBottom: 8}}>Front Text</Text>
                            <Image source={{ uri: imageFront }} style={{ width: "100%", height: 300, marginBottom: 8 }} resizeMode={"contain"} />
                            <Text>{resultFront}</Text>
                        </View> : null}
                        {isCheckedShowLog && resultBack ? <View>
                            <Text style={{color: colors.primary, fontWeight: "600", marginBottom: 8}}>Back Text</Text>
                            <Image source={{ uri: imageBack }} style={{ width: "100%", height: 300, marginBottom: 8 }} resizeMode={"contain"} />
                            <Text>{resultBack}</Text>
                        </View> : null}

                        <Button
                            mode={"contained"}
                            uppercase={false}
                            loading={loading}
                            style={{
                                margin: 8,
                                backgroundColor: colors.primary,
                            }}
                            onPress={() => _onPressSave()}
                        >
                            {loading ? "Loading..." : "Save"}
                        </Button>
                    </View>

                    <SafeAreaView style={{height: 60}}/>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
