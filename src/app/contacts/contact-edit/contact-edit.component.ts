import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact-model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact | null = null;
  contact: Contact | null = null;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string = '';

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (!this.id) {
        this.editMode = false;
        return;
      }

      this.contactService.getContact(this.id).subscribe(contact => {
        if (!contact) {
          return;
        }
        this.originalContact = contact;
        this.editMode = true;
        this.contact = { ...contact };

        if (this.contact.group) {
          this.groupContacts = [...this.contact.group];
        }
      });
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      this.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact!, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  drop(event: CdkDragDrop<Contact[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.groupContacts, event.previousIndex, event.currentIndex);
    } else {
      const selectedContact: Contact = event.previousContainer.data[event.previousIndex];
      this.addToGroup(selectedContact);
    }
  }

  onRemoveItem(index: number) {
    if (index >= 0 && index < this.groupContacts.length) {
      this.groupContacts.splice(index, 1);
    }
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    return this.groupContacts.some(contact => contact.id === newContact.id);
  }

  addToGroup(selectedContact: Contact) {
    if (!this.isInvalidContact(selectedContact)) {
      this.groupContacts.push(selectedContact);
    }
  }
}
