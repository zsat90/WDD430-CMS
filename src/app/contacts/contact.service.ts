import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from './contact-model';  

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  private URL = 'http://localhost:3000/contacts'; 

  constructor(private http: HttpClient) {
    this.getContacts().subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.contactListChangedEvent.next([...this.contacts]);
    });
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.URL);
  }

  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.URL}/${id}`);
  }

  storeContacts(contacts: Contact[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(this.URL, contacts, { headers });
  }

  addContact(newContact: Contact): void {
    if (!newContact) {
      return;
    }

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, contact: Contact }>(this.URL, newContact, { headers })
      .subscribe(
        (responseData) => {
          this.contacts.push(responseData.contact);
          this.contactListChangedEvent.next([...this.contacts]);
        },
        (error) => {
          console.error('Error adding contact:', error);
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put<{ message: string }>(`${this.URL}/${originalContact.id}`, newContact, { headers })
      .subscribe(
        () => {
          const pos = this.contacts.findIndex(contact => contact.id === originalContact.id);
          if (pos !== -1) {
            this.contacts[pos] = newContact;
            this.contactListChangedEvent.next([...this.contacts]);
          }
        },
        (error) => {
          console.error('Error updating contact:', error);
        }
      );
  }

  deleteContact(contact: Contact): void {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos === -1) {
      return;
    }

    this.http.delete<void>(`${this.URL}/${contact.id}`)
      .subscribe(
        () => {
          this.contacts.splice(pos, 1);
          this.contactListChangedEvent.next([...this.contacts]);
        },
        (error) => {
          console.error('Error deleting contact:', error);
        }
      );
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
