import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from './contact-model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;
  private URL = 'https://wdd430-cms-f5f38-default-rtdb.firebaseio.com/contacts.json';

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.URL);
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) || null;
  }

  storeContacts(contacts: Contact[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const contactsString = JSON.stringify(contacts);

    return this.http.put(this.URL, contactsString, { headers });
  }

  addContact(newContact: Contact): void {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    this.contacts.push(newContact);
    this.storeContacts(this.contacts).subscribe(() => {
      this.contactListChangedEvent.next([...this.contacts]);
    });
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(contact => contact.id === originalContact.id);
    if (pos === -1) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts(this.contacts).subscribe(() => {
      this.contactListChangedEvent.next([...this.contacts]);
    });
  }

  deleteContact(contact: Contact): void {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos === -1) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts(this.contacts).subscribe(() => {
      this.contactListChangedEvent.next([...this.contacts]);
    });
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(contact => {
      const currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }
}
