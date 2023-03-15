import {
	GET_LIST_CONTACT,
	SET_BRANCH_SELECTED,
	SET_DEPARTMENT_SELECTED,
} from './types/contact_type';

interface IPropsGetList {
	User_ID: string;
	Password: string;
	query: string;
	Dept_Code: any;
	Branch: string;
	subteam?: string;
	isFilter?: boolean;
}

export const getListContact = ({
	User_ID,
	Password,
	query,
	Dept_Code,
	Branch,
	subteam,
	isFilter,
}: IPropsGetList) => ({
	type: GET_LIST_CONTACT,
	data: {
		User_ID,
		Password,
		query,
		Dept_Code,
		Branch,
		subteam,
		isFilter,
	},
});

export const setKeyWordSearch = ({ keyword }) => ({
	type: SET_DEPARTMENT_SELECTED,
	data: {
		keyword,
	},
});

export const setDepartmentSelected = ({ departmentSelected }) => ({
	type: SET_DEPARTMENT_SELECTED,
	data: {
		departmentSelected,
	},
});

export const setBranchSelected = ({ branchSelected }) => ({
	type: SET_BRANCH_SELECTED,
	data: {
		branchSelected,
	},
});
