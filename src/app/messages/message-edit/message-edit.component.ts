import { Component, ElementRef, ViewChild, Output, EventEmitter} from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  currentSender: string = 'Zak'

  @ViewChild('subject') subjectInput!: ElementRef;
  @ViewChild('msgText') msgTextInput!: ElementRef

  @Output() addMessageEvent = new EventEmitter<Message>();

  onSendMessage(){
    const subjectValue = this.subjectInput.nativeElement.value
    const msgValue = this.msgTextInput.nativeElement.value

    const newMessage = new Message(
      '5',
      subjectValue,
      msgValue,
      this.currentSender  
  )

  this.addMessageEvent.emit(newMessage)

  this.onClear()
  
  }

  onClear(){
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }




}
