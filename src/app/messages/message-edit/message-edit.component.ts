import { Component, ElementRef, ViewChild} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  currentSender: string = '18'

  @ViewChild('subject') subjectInput!: ElementRef;
  @ViewChild('msgText') msgTextInput!: ElementRef


  constructor(private messageService:MessageService){}

  onSendMessage(){
    const subjectValue = this.subjectInput.nativeElement.value
    const msgValue = this.msgTextInput.nativeElement.value

    const newMessage = new Message(
      '5',
      subjectValue,
      msgValue,
      this.currentSender
  )


  this.messageService.addMessage(newMessage)

  this.onClear()
  
  }

  onClear(){
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }




}
