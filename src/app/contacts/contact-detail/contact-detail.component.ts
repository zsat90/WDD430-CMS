import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../contact-model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css',
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | any = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      const contact = this.contactService.getContact(id);
      this.contact = contact;
    });
  }

  onDeleteContact() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }
}
