import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { ReactElement, ReactNode } from 'react';
import { View, FlatList, Text, SafeAreaView } from 'react-native';

interface IProps {
	HeaderOutList?: (params?: unknown) => ReactElement;
	ListHeaderComponent?: () => ReactElement;
	loading: boolean;
	data: any;
	showsVerticalScrollIndicator?: boolean;
	renderItem: ({ item, index }) => ReactElement;
	refreshControl?: ReactElement;
}

function FlatListWithHeaderCustom(props: IProps) {
	const {
		HeaderOutList,
		loading,
		data,
		showsVerticalScrollIndicator,
		ListHeaderComponent,
		renderItem,
		refreshControl,
	} = props;

	return (
		<View
			style={{
				flex: 1,
				paddingHorizontal: 8,
				paddingTop: 8,
			}}
		>
			<View style={{ zIndex: 1, paddingTop: 8 }}>{HeaderOutList?.()}</View>

			{!loading ? (
				<FlatList
					style={{ paddingTop: 8, flex: 1 }}
					data={data}
					showsVerticalScrollIndicator={showsVerticalScrollIndicator}
					keyExtractor={(_, index) => index.toString()}
					refreshControl={refreshControl}
					keyboardShouldPersistTaps="handled"
					ListHeaderComponent={() => (
						<View style={{ marginBottom: 8 }}>
							{ListHeaderComponent?.()}
							<View
								style={{
									flexDirection: 'row',
									marginTop: 2,
									alignItems: 'center',
								}}
							>
								<Icon
									as={Ionicons}
									name={'bar-chart-outline'}
									size={5}
									marginRight={1}
									color={'#777'}
								/>
								<Text>
									<Text style={{ fontSize: 12, color: '#666' }}>
										Total record:
									</Text>{' '}
									<Text style={{ fontWeight: '600', color: Color.main }}>
										{data?.length}
									</Text>
								</Text>
							</View>
						</View>
					)}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={renderItem}
				/>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}

export default FlatListWithHeaderCustom;
