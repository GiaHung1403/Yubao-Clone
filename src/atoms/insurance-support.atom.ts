import { InsuranceContractType } from '@models/InsuranceContractEnum';
import { IContract, ICustomer } from '@models/types';
import { atom } from 'jotai';
import moment from 'moment';
// Create your atoms and derivatives
export const customerInsuranceAtom = atom<ICustomer | undefined>(undefined);
export const contractInsuranceAtom = atom<IContract | undefined>(undefined);
export const fromDateInsuranceAtom = atom(moment().subtract(1, 'months'));
export const toDateInsuranceAtom = atom(moment());
export const keyQueryInsuranceAtom = atom<string>("");
export const typeInsuranceAtom = atom<InsuranceContractType>(InsuranceContractType.ALL);
