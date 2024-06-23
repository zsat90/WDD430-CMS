import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = []
  messageChangedEvent = new EventEmitter<Message[]>()
  maxMessageId!: number;
  private URL = 'https://wdd430-cms-f5f38-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES
    this.maxMessageId = this.getMaxId()
   }

   getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.URL);
    
   }

   getMessage(id: string): Message | null{
    for(let message of this.messages){
      if(message.id === id){
        return message
      }
    }
    return null
   }

   storeMessages(messages: Message[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const messagesString = JSON.stringify(messages);

    return this.http.put(this.URL, messagesString, { headers });
   }
  

   addMessage(message: Message){
    if(!message){
      return
    }

    this.messages.push(message)
    this.storeMessages(this.messages).subscribe(() => {
      this.messageChangedEvent.emit([...this.messages])
    })
   }

   updateMessage(originalMessage: Message, newMessage: Message){
    if(!originalMessage || !newMessage){
      return
    }

    const pos = this.messages.indexOf(originalMessage)
    if(pos < 0){
      return
    }

    newMessage.id = originalMessage.id
    this.messages[pos] = newMessage
    this.storeMessages(this.messages).subscribe(() => {
      this.messageChangedEvent.emit([...this.messages])
    })
   }

    deleteMessage(message: Message){
      if(!message){
        return
      }
  
      const pos = this.messages.indexOf(message)
      if(pos < 0){
        return
      }
  
      this.messages.splice(pos, 1)
      this.storeMessages(this.messages).subscribe(() => {
        this.messageChangedEvent.emit([...this.messages])
      })
    }

    getMaxId(): number{
      let maxId = 0
      for(let message of this.messages){
        let currentId = parseInt(message.id)
        if(currentId > maxId){
          maxId = currentId
        }
      }
      return maxId
    }
}
