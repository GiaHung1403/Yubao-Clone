import {  ICustomer, IReferralCustomer } from '@models/types';
import { atom } from 'jotai';

// Create your atoms and derivatives
export const referralCustomersAtom = atom<IReferralCustomer[] | undefined>(undefined);
export const searchKeyRefCustomerAtom = atom<string>("")
export const getSearchKeyRefCustomerAtom = atom(get => get(searchKeyRefCustomerAtom));