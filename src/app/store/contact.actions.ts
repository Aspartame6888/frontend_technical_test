import { createAction, props } from '@ngrx/store';
import { Contact } from '../model/contact.model'; 

export const addContact = createAction(
    '[Contact] Add Contact',
    props<{ contact: Contact }>() 
  );
  
  export const removeContact = createAction(
    '[Contact] Remove Contact',
    props<{ contactId: number }>() 
  );
  
