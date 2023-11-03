import { createReducer, on } from '@ngrx/store';
import { addContact, removeContact } from './contact.actions';
import { Contact } from '../model/contact.model';

export interface ContactState {
  contacts: Contact[];
}

export const initialState: ContactState = {
  contacts: [],
};

export const contactReducer = createReducer(
  initialState,
  on(addContact, (state, { contact }) => ({
    ...state,
    contacts: [...state.contacts, contact],
  })),
  on(removeContact, (state, { contactId }) => ({
    ...state,
    contacts: state.contacts.filter((c) => c.id !== contactId),
  }))
);
