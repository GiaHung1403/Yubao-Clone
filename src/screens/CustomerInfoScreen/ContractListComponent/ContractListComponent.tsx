import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	Dimensions,
	FlatList,
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-svg-charts';
import { useDispatch, useSelector } from 'react-redux';

import { getListContract } from '@actions/contract_action';
import ItemContract from '@components/ItemContract';
import LoadingFullScreen from '@components/LoadingFullScreen';
import NoDataComponent from '@components/NoDataComponent';
import Colors from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { IUserSystem, IContract } from '@models/types';
import { formatVND } from '@utils';
import {
	SceneMap,
	SceneRendererProps,
	TabBar,
	TabView,
} from 'react-native-tab-view';
import Labels from './LabelChartComponent';

interface IProps {
	data: IContract[];
	loading: any;
}

const listColor = [
	Colors.main,
	'#e67e22',
	'#e74c3c',
	'#00a6c0',
	'#2c82c9',
	Colors.main,
];

function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

const initialLayout = { width: Dimensions.get('window').width };

export default function ContractListScreen(props: any) {
	/* Khởi tạo ref */
	const flatListVNDRef: any = useRef<any>(null);
	const flatListUSDRef: any = useRef<any>(null);
	/* Khởi tạo hook navigation */
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { taxCode } = props;
	/* Lấy dữ liệu từ redux */
	const { data, loading }: IProps = useSelector(
		(state: any) => state.contract_reducer,
	);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	/* Khởi tạo state */
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [listQuery, setListQuery] = useState<any>([]);
	const [indexTab, setIndexTab] = React.useState(0);

	/* Khởi tạo multi language */
	const I18n = useContext(LocalizationContext);
	const textContractInfo = I18n.t('contractInfo');
	const textSearchHistory = I18n.t('search_history');
	const textContractNo = I18n.t('contractNo');
	const textNoData = I18n.t('noData');
	const textDebt = I18n.t('debt');
	const textTotalDebt = I18n.t('totalDebt');

	const { colors } = useTheme();
	const [routes] = React.useState([
		{ key: 'first', title: 'Information' },
		{ key: 'second', title: 'Contact Person' },
	]);

	const FirstRoute = () =>
		renderListData(
			flatListVNDRef,
			listDataVND,
			dataTestChartVND,
			totalDeptVND,
			'VND',
		);
	const SecondRoute = () =>
		renderListData(
			flatListUSDRef,
			listDataUSD,
			dataTestChartUSD,
			totalDeptUSD,
			'USD',
		);

	/* Filter list item theo đơn vị tiền tệ */
	const listDataVND: any = listQuery.filter(
		(item: any) => item.cur_c === 'VND' && item.current_Outbal !== 0,
	);
	const listDataUSD: any = listQuery.filter(
		(item: any) => item.cur_c === 'USD' && item.current_Outbal !== 0,
	);

	/* Tính toán tổng dư nợ */
	const totalDeptVND = listDataVND
		.map(item => item.current_Outbal)
		.reduce((a, b) => a + b, 0);
	const totalDeptUSD = listDataUSD
		.map(item => item.current_Outbal)
		.reduce((a, b) => a + b, 0);

	/* Khởi tạo data cho hiển thị chart */
	const dataTestChartVND: any = listDataVND.map((item, index) =>
		Object.assign({
			key: `${index}VND`,
			amount: ((item.current_Outbal / totalDeptVND) * 100).toFixed(2),
			svg: {
				fill: listColor[index] || getRandomColor(),
				onPress: () =>
					flatListVNDRef.current.scrollToIndex({
						animated: true,
						index,
					}),
			},
		}),
	);
	const dataTestChartUSD: any = listDataUSD.map((item, index) =>
		Object.assign({
			key: `${index}USD`,
			amount: ((item.current_Outbal / totalDeptVND) * 100).toFixed(2),
			svg: {
				fill: listColor[index] || getRandomColor(),
				onPress: () =>
					flatListUSDRef.current.scrollToIndex({
						animated: true,
						index,
					}),
			},
		}),
	);

	/* Chờ cho animation chạy xong thì load view */
	useEffect(() => {
		setTimeout(() => {
			setDoneLoadAnimated(true);
		}, 200);
	}, []);

	/* Animation chạy xong thì call api lấy list hợp đồng về */
	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}
		dispatch(
			getListContract({
				User_ID: taxCode.trim(), // 0101436811
				Password: '',
				taxCode: taxCode.trim(),
			}),
		);
	}, [doneLoadAnimated]);

	/* Khởi tạo list query khi có data */
	useEffect(() => {
		if (listQuery?.length === 0) {
			setListQuery(data);
		}

		if (data.length === 0) {
			setListQuery([]);
		}
	}, [data]);

	/* Filter list data hiển thị theo keyword search */
	useEffect(() => {
		if (firstQuery.length > 0) {
			const dataFilter: any = data.filter(item =>
				item.apno.includes(firstQuery),
			);

			setListQuery(dataFilter);
		} else {
			setListQuery(data);
		}
	}, [firstQuery]);

	/* Function press Item */
	const _onPressItemContract = async (item: any, listAssets: any) => {
		navigation.navigate('CustomerContractChooseInfoScreen', {
			title: `${textContractNo} ${item.apno}`,
			url: item.file_Url,
			isShowButton: true,
			APNO: item.apno,
			listAssets,
			taxCode,
		});
	};

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
	});

	const renderTabBar = (
		propsData: SceneRendererProps & { navigationState },
	) => {
		return (
			<TabBar
				{...propsData}
				scrollEnabled
				indicatorStyle={{
					borderBottomColor: colors.primary,
					borderBottomWidth: 4,
				}}
				style={{ backgroundColor: '#fff' }}
				tabStyle={{}}
				labelStyle={{ fontWeight: '600', textTransform: undefined }}
				activeColor={colors.primary}
				inactiveColor={'#a1a1aa'}
			/>
		);
	};

	const renderListData = (
		ref: any,
		listData: any,
		dataTest: any,
		totalMoney: number,
		currency: string,
	) =>
		listData.length > 0 ? (
			<FlatList
				ref={ref}
				style={{ flex: 1, zIndex: 1 }}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				removeClippedSubviews
				keyExtractor={(item, index) => index.toString()}
				data={listData}
				extraData={data}
				ListHeaderComponent={() => (
					<View style={{ flex: 1 }}>
						<PieChart
							valueAccessor={({ item }) => item.amount}
							style={{ height: 250 }}
							innerRadius={20}
							outerRadius={100}
							labelRadius={140}
							data={
								totalMoney > 0
									? dataTest
									: [
											{
												key: 1,
												amount: 100,
												svg: { fill: colors.primary },
											},
									  ]
							}
							animate={true}
						>
							<Labels />
						</PieChart>
						<Text
							style={{
								marginTop: 8,
								fontWeight: '600',
								textAlign: 'center',
							}}
						>
							{`${textTotalDebt}: ${formatVND(totalMoney)} ${currency}`}
						</Text>
					</View>
				)}
				ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
				ListEmptyComponent={() => (
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: 20,
						}}
					>
						<Text style={{ color: '#3e3e3e', fontWeight: '600' }}>
							{textNoData}
						</Text>
					</View>
				)}
				renderItem={({ item, index }) => (
					<ItemContract
						item={item}
						taxCode={taxCode.trim()}
						stylesItem={{
							marginBottom: index === listQuery?.length - 1 ? 8 : 0,
							backgroundColor: dataTest[index!].svg.fill,
							marginHorizontal: 8,
						}}
						onPressItem={listAssets => _onPressItemContract(item, listAssets)}
					/>
				)}
			/>
		) : (
			<NoDataComponent type={'Empty'} />
		);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<Searchbar
					placeholder={textSearchHistory}
					onChangeText={query => setFirstQuery(query)}
					value={firstQuery}
					style={{ zIndex: 2, marginTop: 8, marginHorizontal: 8 }}
					inputStyle={{ fontSize: 14 }}
				/>

				{doneLoadAnimated && (!loading || data.length > 0) ? (
					listDataUSD.length > 0 && listDataVND.length > 0 ? (
						<TabView
							navigationState={{ index: indexTab, routes }}
							renderScene={renderScene}
							renderTabBar={renderTabBar}
							onIndexChange={setIndexTab}
							initialLayout={initialLayout}
							// style={{ marginTop: StatusBar.currentHeight }}
						/>
					) : listDataUSD.length > 0 ? (
						renderListData(
							flatListUSDRef,
							listDataUSD,
							dataTestChartUSD,
							totalDeptUSD,
							'USD',
						)
					) : (
						renderListData(
							flatListVNDRef,
							listDataVND,
							dataTestChartVND,
							totalDeptVND,
							'VND',
						)
					)
				) : (
					<LoadingFullScreen />
				)}
			</View>
		</View>
	);
}
