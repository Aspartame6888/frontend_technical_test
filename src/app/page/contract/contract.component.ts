import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addContact, removeContact } from '../../store/contact.actions';
import { Contact } from "../../model/contact.model"
import * as FileSaver from 'file-saver';
import * as Papa from 'papaparse';


@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})

export class ContractComponent {
  contact$!: Observable<Contact[]>;
  displayedContacts: Contact[] = [];
  newContact: Contact = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };
  searchTerm: string = '';
  nextId: number = 1;
  noMatchFound: boolean = false;

  constructor(private store: Store<{ contact: { contacts: Contact[] } }>) {
    this.contact$ = store.select(state => state.contact.contacts);
    this.contact$.subscribe(contacts => this.displayedContacts = contacts);
  }

  // 排序联系人列表
  sort() {
    this.displayedContacts = [...this.displayedContacts]; // 创建一个新的数组以避免直接改变原始数据
    this.displayedContacts.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  // 筛选联系人列表
  filter() {
    if (this.searchTerm) {
      this.displayedContacts = [...this.displayedContacts]; // 创建一个新的数组以避免直接改变原始数据
      this.displayedContacts = this.displayedContacts.filter(contact =>
        contact.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      this.noMatchFound = this.displayedContacts.length === 0;
      if (this.noMatchFound) {
        window.alert('No matching contacts found.');
      }
    } else {
      // 当 searchTearm 为空时，显示所有联系人
      this.contact$.subscribe(contacts => this.displayedContacts = contacts);
      this.noMatchFound = false;
    }
  }



  addContact() {
    this.noMatchFound = false
    if (this.isContactValid(this.newContact)) {
      this.store.dispatch(addContact({ contact: this.newContact }));
      this.newContact = {
        id: this.nextId,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      };
      this.nextId++;
    }
  }

  isContactValid(contact: Contact): boolean {
    return !!contact.firstName && !!contact.lastName && !!contact.email && !!contact.phone;
  }

  removeContact(contactId: number) {
    const isConfirmed = window.confirm('Are you sure you want to delete this contact?');

    if (isConfirmed) {
      this.store.dispatch(removeContact({ contactId }));
    }
  }

  exportToCSV() {
    const csvData = Papa.unparse(this.displayedContacts, { header: true });
    const blob = new Blob([csvData], { type: 'text/csv' });
    FileSaver.saveAs(blob, 'contacts.csv');
  }
}
