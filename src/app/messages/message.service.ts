import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId!: number;
  private URL = 'http://localhost:3000/messages';  // Updated to point to the Node.js server

  constructor(private http: HttpClient) {
    this.getMessages().subscribe((messages: Message[]) => {
      this.messages = messages;
      this.maxMessageId = this.getMaxId();
    });
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.URL);
  }

  getMessage(id: string): Observable<Message> {
    return this.http.get<Message>(`${this.URL}/${id}`);
  }

  storeMessages(messages: Message[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(this.URL, messages, { headers });
  }

  addMessage(newMessage: Message): void {
    if (!newMessage) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<AddMessageResponse>(this.URL, newMessage, { headers })
      .subscribe(
        (responseData) => {
          this.messages.push(responseData.addedMessage);
          this.messageChangedEvent.emit([...this.messages]);
        },
        (error) => {
          console.error('Error adding message:', error);
        }
      );
  }

  updateMessage(originalMessage: Message, newMessage: Message): void {
    if (!originalMessage || !newMessage) {
      return;
    }

    newMessage.id = originalMessage.id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<{ message: string }>(`${this.URL}/${originalMessage.id}`, newMessage, { headers })
      .subscribe(
        () => {
          const pos = this.messages.findIndex(message => message.id === originalMessage.id);
          if (pos !== -1) {
            this.messages[pos] = newMessage;
            this.messageChangedEvent.emit([...this.messages]);
          }
        },
        (error) => {
          console.error('Error updating message:', error);
        }
      );
  }

  deleteMessage(message: Message): void {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos === -1) {
      return;
    }

    this.http.delete<void>(`${this.URL}/${message.id}`)
      .subscribe(
        () => {
          this.messages.splice(pos, 1);
          this.messageChangedEvent.emit([...this.messages]);
        },
        (error) => {
          console.error('Error deleting message:', error);
        }
      );
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      let currentId = parseInt(message.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}

interface AddMessageResponse {
  message: string;
  addedMessage: Message;
}
