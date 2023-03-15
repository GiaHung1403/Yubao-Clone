import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Platform } from 'react-native';
import { useAtom } from 'jotai';
import {
	textCNIDAtom,
	textAPNOAtom,
	fromDateValidAtom,
	toDateValidAtom,
	typeValidAprvAtom,
} from 'atoms/valid_aprv.atom';

import ModalAndroid from './ModalAndroid/ModalAndroid';
import ModalIOS from './ModalIOS/ModalIOS';
import { IUserSystem } from '@models/types';
import { useSelector } from 'react-redux';
import { upDate_Valid_Aprv, create_APNO_Aprv } from '@data/api';

function ValidApprovalFilterModal(props: any, ref: any) {
	const { onClose, onOpen, onFilter } = props;
	const [hideModal, setHideModal] = useState(false);
	const [filterSelected] = useAtom(typeValidAprvAtom);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	useImperativeHandle(ref, () => ({
		showModal: item => {
			setHideModal(item);
		},
	}));

	//Atom
	const [, setCNID] = useAtom(textCNIDAtom);
	const [, setAPNO] = useAtom(textAPNOAtom);
	const [, setFilterFromDate] = useAtom(fromDateValidAtom);
	const [, setFilterToDate] = useAtom(toDateValidAtom);

	const _onPressFilter = ({ CNID, APNO, fromDate, toDate }) => {
		setCNID(CNID);
		setAPNO(APNO);
		setFilterFromDate(fromDate);
		setFilterToDate(toDate);
		onFilter(filterSelected);
	};

	const _onSave = async ({ CNID, APNO, chooseType }) => {
		await create_APNO_Aprv({
			User_ID: dataUserSystem.EMP_NO,
			CNID,
			APNO,
			Progress: chooseType,
			Action: 'CREATE_APNO',
		});
	};

	// render
	return Platform.OS === 'ios' ? (
		<ModalIOS
			hideModal={hideModal}
			onClose={onClose}
			onOpen={onOpen}
			_onPressFilter={_onPressFilter}
			_onPressSave={_onSave}
		/>
	) : (
		<ModalAndroid
			hideModal={hideModal}
			onClose={onClose}
			onOpen={onOpen}
			_onPressFilter={_onPressFilter}
			_onPressSave={_onSave}
		/>
	);
}

export default React.forwardRef(ValidApprovalFilterModal);
