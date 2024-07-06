import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact-model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message!: Message;
  messageSender: string = 'Unknown Sender'; // Default value

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    if (this.message && this.message.sender) {
      this.contactService.getContact(this.message.sender).subscribe(
        (contact: Contact | null) => {
          this.messageSender = contact ? contact.name : 'Unknown Sender';
        },
        (error) => {
          console.error('Error fetching contact:', error);
          this.messageSender = 'Unknown Sender';
        }
      );
    } else {
      this.messageSender = 'Unknown Sender';
    }
  }
}
