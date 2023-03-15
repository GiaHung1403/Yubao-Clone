import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Colors from '@config/Color';
import {
	IQuotationCalculation,
	IQuotationDetail,
	IQuotationTenor,
} from '@models/types';
import { formatVND } from '@utils';

interface IQuotationReducer {
	quotationDetail: IQuotationDetail;
	listTenorQuotation: IQuotationTenor[];
	quotationCalculation: IQuotationCalculation;
}

export default function QuotationResultComponent(props: any) {
	const {
		quotationDetail,
		listTenorQuotation,
		quotationCalculation,
	}: IQuotationReducer = useSelector((state: any) => state.quotation_reducer);

	const { colors } = useTheme();
	const renderTextLabelMain = ({ label, value }) => (
		<View style={{ flex: 1 }}>
			<Text style={{ fontWeight: '600', color: '#666', marginBottom: 4 }}>
				{label}
			</Text>
			<Text style={{ fontSize: 15, fontWeight: '600', color: colors.primary }}>
				{value}
			</Text>
		</View>
	);

	// console.log('====================================');
	// console.log(quotationCalculation);
	// console.log('====================================');

	const renderTextLabelItem = ({ label, value }) => (
		<View style={{ flex: 1, justifyContent: 'space-between' }}>
			<Text style={{ fontWeight: '500', color: '#2e2e2e', marginBottom: 4 }}>
				{label}
			</Text>
			<Text style={{ fontSize: 15, fontWeight: '600', color: '#2c82c9' }}>
				{value}
			</Text>
		</View>
	);

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<Card
				elevation={4}
				style={{ marginHorizontal: 8, marginTop: 8, zIndex: 2 }}
			>
				<View style={{ padding: 8 }}>
					<View style={{ flexDirection: 'row' }}>
						{renderTextLabelMain({
							label: 'RP',
							value: `${
								quotationCalculation?.lblIRR?.replace('%', '') ||
								quotationDetail?.irr ||
								'0'
							}%`,
						})}

						{renderTextLabelMain({
							label: 'Principal',
							value: `${
								quotationCalculation?.lblPMT?.replace('$', '') ||
								formatVND(quotationDetail?.pmt?.replace(/,/g, ''))
							} ${quotationDetail?.cuR_C || 'VND'}`,
						})}
					</View>

					<View style={{ flexDirection: 'row', marginTop: 8 }}>
						{renderTextLabelMain({
							label: 'NPV',
							value: `${
								quotationCalculation?.lblNPV?.replace('$', '') ||
								formatVND(quotationDetail?.npv?.replace(/,/g, ''))
							} ${quotationDetail?.cuR_C || 'VND'}`,
						})}
						{renderTextLabelMain({
							label: 'NPV/FA',
							value: `${
								quotationCalculation?.lblNF?.replace('%', '') ||
								(quotationDetail
									? (
											(parseFloat(quotationDetail?.npv?.replace(/,/g, '')) *
												100) /
											parseFloat(quotationDetail?.acqT_AMT?.replace(/,/g, ''))
									  ).toFixed(2)
									: 0)
							}%`,
						})}
					</View>
				</View>
			</Card>

			{/* <View style={{ flex: 1 }}>
        <FlatList
          data={quotationCalculation?.QuoSteps || listTenorQuotation}
          keyExtractor={(_, index) => index.toString()}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 8 }}
          ListFooterComponent={() => <SafeAreaView style={{ height: 60 }}/>}
          renderItem={({ item }) => {
            return (
              <Card elevation={2} style={{ marginBottom: 8 }}>
                <View style={{ padding: 8 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: Colors.status,
                      marginBottom: 8,
                    }}
                  >
                    Tenor {item.Tenor + 1}
                  </Text>

                  <View style={{ flexDirection: 'row' }}>
                    {renderTextLabelItem({
                      label: 'Monthly rental',
                      value: formatVND(item.Rental.toString().replace(/,/g, '')),
                    })}
                    {renderTextLabelItem({
                      label: 'Cash flow',
                      value: formatVND(
                        item.CashFlow.toString().replace(/,/g, ''),
                      ),
                    })}
                    {renderTextLabelItem({
                      label: 'Beginning balance',
                      value: formatVND(
                        item.BeginBlance.toString().replace(/,/g, ''),
                      ),
                    })}
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 16 }}>
                    {renderTextLabelItem({
                      label: 'Principal',
                      value: formatVND(
                        item.Principle.toString().replace(/,/g, ''),
                      ),
                    })}
                    {renderTextLabelItem({
                      label: 'Principal VAT',
                      value: formatVND(
                        item.PrincipleVAT.toString().replace(/,/g, ''),
                      ),
                    })}
                    {renderTextLabelItem({
                      label: 'Interest',
                      value: formatVND(
                        item.Interest.toString().replace(/,/g, ''),
                      ),
                    })}
                  </View>

                  <View style={{ marginTop: 16 }}>
                    {renderTextLabelItem({
                      label: 'Ratio(%)',
                      value: item.Percentage,
                    })}
                  </View>
                </View>
              </Card>
            );
          }}
        />
      </View> */}
		</View>
	);
}
