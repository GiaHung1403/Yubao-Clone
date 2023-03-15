import React, { useEffect, useState } from 'react';
import { InteractionManager, View } from 'react-native';
import Keychain from 'react-native-keychain';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListLeaveRequest } from '@actions/leave_request_action';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import PickerCustomComponent from '@components/PickerCustomComponent';
import { getListSubTeam, getListTeamMember } from '@data/api';
import { ISubTeam, ITeamMember, IUserSystem } from '@models/types';
import { convertUnixTimeDDMMYYYY, convertUnixTimeNoSpace } from '@utils';

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()),
);

export default function LeaveRequestFilterComponent(props: any) {
	const dispatch = useDispatch();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [fromDate, setFromDate] = useState(timeFrom);
	const [toDate, setToDate] = useState(timeNow);
	const [listSubTeam, setListSubTeam] = useState<ISubTeam[]>([]);
	const [subTeamSelected, setSubTeamSelected] = useState<string>('');
	const [listOfficer, setListOfficer] = useState<ITeamMember[]>([]);
	const [officerSelected, setOfficerSelected] = useState<string>(
		dataUserSystem.EMP_NO,
	);

	useEffect(() => {
		(async function getDataSubTeam() {
			const { password }: any = await Keychain.getGenericPassword();

			const responseSubTeam: any = await getListSubTeam({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
				Dept_Code: dataUserSystem.DEPT_CODE,
				KEY_DATA_EXT1: 'PGHRDOM01',
			});

			const subTeamConvert = responseSubTeam.map((team: ISubTeam) => ({
				label: team.STND_C_NM,
				value: team.SubTeam,
			}));

			setListSubTeam(subTeamConvert);
		})();
	}, []);

	useEffect(() => {
		(async function getDataOfficer() {
			if (subTeamSelected) {
				const { password }: any = await Keychain.getGenericPassword();

				const responseTeamMember: ITeamMember[] = (await getListTeamMember({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
					Sub_Team_Code: subTeamSelected,
					Dept_Code: dataUserSystem.DEPT_CODE,
					KEY_DATA_EXT1: 'PGHRDOM01',
				})) as ITeamMember[];

				responseTeamMember.splice(0, 1);

				const listOfficerConvert: any = responseTeamMember.map(
					(team: ITeamMember) => ({
						label: team.EMPNM,
						value: team.EMP_NO,
					}),
				);

				setListOfficer(listOfficerConvert);
			}
		})();
	}, [subTeamSelected]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			if (!officerSelected) {
				return;
			}
			dispatch(
				getListLeaveRequest({
					UserID: dataUserSystem.EMP_NO,
					memberID: officerSelected,
					fromDate: convertUnixTimeNoSpace(fromDate.getTime() / 1000),
					toDate: convertUnixTimeNoSpace(toDate.getTime() / 1000),
				}),
			);
		});
	}, [fromDate, toDate, officerSelected]);

	return (
		<Card elevation={4}>
			{/* View Choose Date */}
			<View style={{ padding: 8 }}>
				<View
					style={{
						flexDirection: 'row',
					}}
				>
					<ButtonChooseDateTime
						label={'From'}
						modalMode={'date'}
						valueDisplay={convertUnixTimeDDMMYYYY(fromDate.getTime() / 1000)}
						value={fromDate}
						onHandleConfirmDate={setFromDate}
						containerStyle={{ flex: 1 }}
					/>

					<ButtonChooseDateTime
						label={'To'}
						modalMode={'date'}
						valueDisplay={convertUnixTimeDDMMYYYY(toDate.getTime() / 1000)}
						value={toDate}
						onHandleConfirmDate={setToDate}
						containerStyle={{ flex: 1, marginLeft: 8 }}
					/>
				</View>

				<View
					style={{
						flexDirection: 'row',
						marginTop: 8,
					}}
				>
					<PickerCustomComponent
						showLabel={true}
						listData={listSubTeam}
						label="Department"
						value={subTeamSelected}
						style={{ flex: 1, marginRight: 8 }}
						textStyle={{ maxWidth: 120 }}
						onValueChange={text => setSubTeamSelected(text)}
					/>

					<PickerCustomComponent
						showLabel={true}
						listData={listOfficer}
						label="Officer"
						value={officerSelected}
						textStyle={{ maxWidth: 120 }}
						style={{ flex: 1 }}
						onValueChange={text => setOfficerSelected(text)}
					/>
				</View>
			</View>
		</Card>
	);
}
