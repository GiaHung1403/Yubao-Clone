import {AntDesign} from "@expo/vector-icons";
import {Icon} from 'native-base';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Card,useTheme} from 'react-native-paper';

import TextInfoRow from "@components/TextInfoRow";
import Colors from '@config/Color';
import Color from "@config/Color";
import {IQuotation} from '@models/types';

interface IProps {
    quotationInfo: IQuotation;
    index?: number;
    onPress: () => void;
    onPressViewFile: (quotation: IQuotation) => void;
}

export default function QuotationItemComponent(props: IProps) {
    const {quotationInfo, index, onPress, onPressViewFile} = props;
    const [isFavorite, setIsFavorite] = useState(false);
    const{colors} = useTheme()
    return (
			<Card style={{ marginBottom: 8, backgroundColor: '#fff' }}>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						padding: 8,
						alignItems: 'center',
					}}
					onPress={onPress}
				>
					<View style={{ marginLeft: 8, flex: 1 }}>
						<View style={{ flexDirection: 'row', marginBottom: 4 }}>
							<TextInfoRow
								icon={'barcode-outline'}
								value={quotationInfo.quO_ID.toString()}
								styleValue={{ fontWeight: '600', color: colors.primary }}
							/>

							{/* <TouchableOpacity onPress={() => onPressViewFile(quotationInfo)}>
                            <TextInfoRow
                                icon={'print-outline'}
                                isIconRight
                                value={"Offer Letter"}
                                containerStyle={{marginBottom: 4}}
                            />
                        </TouchableOpacity> */}
							<TextInfoRow
								icon={'bookmark-outline'}
								value={
									quotationInfo?.cnid.trim() !== '0'
										? `${quotationInfo?.cnid} (CNID)`
										: 'Not confirm'
								}
								styleValue={{
									color:
										quotationInfo?.cnid.trim() !== '0'
											? Color.approved
											: Color.waiting,
									fontWeight: '600',
								}}
								isIconRight={true}
							/>
						</View>

						<View style={{ flexDirection: 'row', marginBottom: 8 }}>
							<TextInfoRow
								icon={'person-outline'}
								value={`${quotationInfo.leasE_P} - ${quotationInfo.lS_NM}`}
								containerStyle={{ marginBottom: 4 }}
							/>
							<TextInfoRow
								icon={'calendar-outline'}
								value={quotationInfo.quO_DATE}
								isIconRight={true}
							/>
						</View>

						{/* <Icon
                        as={AntDesign}
                        name={isFavorite ? 'star' : 'staro'}
                        color={colors.primary}
                        size={7}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                        }}
                        onPress={() => setIsFavorite(!isFavorite)}
                    /> */}
					</View>
				</TouchableOpacity>
			</Card>
		);
}
