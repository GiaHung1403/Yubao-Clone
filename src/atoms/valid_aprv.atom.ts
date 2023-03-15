import { ValidAprvType } from '@models/ValidAprvEnum';
import { IValidAprv } from '@models/types';
import { atom } from 'jotai';
import moment from 'moment';
// Create your atoms and derivatives
export const listValidAtom = atom<IValidAprv | undefined>(undefined);
// export const contractInsuranceAtom = atom<IContract | undefined>(undefined);
export const fromDateValidAtom = atom(moment().subtract(1, 'months'));
export const toDateValidAtom = atom(moment());
export const textcustomerNameAtom = atom<string>('');
export const textCNIDAtom = atom<string>('');
export const textAPNOAtom = atom<string>('');
export const typeValidAprvAtom = atom<ValidAprvType>(ValidAprvType.ALL);
export const textDataConfirm = atom<any>([]);
