import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact-model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [
      new Contact('1', 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771', '../../assets/jacksonk.jpg', []),
      new Contact('2', 'Rex Barzee', 'barzeer@byui.edu', '208-496-3768', '../../assets/barzeer.jpg', [])
    ];

  @Output() selectedContactEvent = new EventEmitter<Contact>();

  constructor() {}

  ngOnInit() {}

  onSelected(contact: Contact){
    this.selectedContactEvent.emit(contact)
  }

}


