import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Meeting Update', 'We will be having our weekly meeting tomorrow at 10 AM.', 'Alice Johnson'),
    new Message('2', 'Project Deadline', 'Reminder that the project deadline is next Friday.', 'Bob Smith'),
    new Message('3', 'Lunch Arrangement', 'Lunch will be provided during the training session on Wednesday.', 'Carol Taylor')
  ]

  onAddMessage(message: Message){
    this.messages.push(message)
  }

}
