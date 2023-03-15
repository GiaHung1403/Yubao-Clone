import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	InteractionManager,
	RefreshControl,
	SafeAreaView,
	View,
} from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { resetQuotationResult } from '@actions/quotation_action';
import Header from '@components/Header';
import { IQuotation } from '@models/types';
import openLink from '@utils/openLink';
import QuotationFilterComponent from './QuotationFilterComponent';
import QuotationItemComponent from './QuotationItemComponent';
import Color from '@config/Color';
import EventEmitter from '@utils/events';

interface IQuotationReducer {
	listQuotation: IQuotation[];
	loading: boolean;
}

export function QuotationScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();

	const { listQuotation, loading }: IQuotationReducer = useSelector(
		(state: any) => state.quotation_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const { colors } = useTheme();

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressItem = (item: IQuotation) => {
		dispatch(resetQuotationResult());
		navigation.navigate('QuotationDetailScreen', {
			QUO_ID: item.quO_ID,
			quO_RPT: item?.quO_RPT,
		});
	};

	const _onPressViewFileItem = (item: IQuotation) => {
		openLink(item.quO_RPT).then();
		// navigation.navigate('WebviewScreen', {
		//   title: `${item.quO_ID}`,
		//   url: item.quO_RPT,
		//   isShowButton: true
		// });
	};

	const _onPressNewQuotation = () => {
		dispatch(resetQuotationResult());
		navigation.navigate('QuotationDetailScreen', {
			quotationInfo: null,
		});
	};
	// console.log('====================================');
	// console.log(listQuotation);
	// console.log('====================================');

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Quotation Information" />
			</View>

			<View style={{ flex: 1 }}>
				<View style={{ marginHorizontal: 8, zIndex: 2, marginTop: 8 }}>
					<QuotationFilterComponent />
				</View>

				{doneLoadAnimated && !loading ? (
					<FlatList
						keyboardShouldPersistTaps="handled"
						style={{ paddingHorizontal: 8, paddingTop: 8 }}
						data={listQuotation}
						keyExtractor={(_, index) => index.toString()}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={() => EventEmitter.emit('onRefreshQuotation')}
							/>
						}
						renderItem={({ item, index }) => (
							<QuotationItemComponent
								quotationInfo={item}
								index={index}
								onPress={() => _onPressItem(item)}
								onPressViewFile={() => _onPressViewFileItem(item)}
							/>
						)}
					/>
				) : (
					<View
						style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
					>
						<ActivityIndicator />
					</View>
				)}

				<SafeAreaView
					style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
				>
					<FAB icon="plus" onPress={() => _onPressNewQuotation()} />
				</SafeAreaView>
			</View>
		</View>
	);
}
