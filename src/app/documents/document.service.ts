import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Observable, Subject, catchError } from 'rxjs';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = []
  documentSelectedEvent = new EventEmitter<Document>()
  documentChangedEvent = new EventEmitter<Document[]>()
  documentListChangedEvent = new Subject<Document[]>()
  maxDocumentId!: number
  private URL = 'http://localhost:3000/documents'

  constructor(private http: HttpClient) { 
    this.documents = MOCKDOCUMENTS
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.URL)

  }

  storeDocuments(documents: Document[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const documentsString = JSON.stringify(documents);

    return this.http.put(this.URL, documentsString, { headers });
  }


  getDocument(id:string): Document | null {
    for(let document of this.documents){
      if(document.id === id){
        return document
      }
    }
    return null
  }


  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }

    
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

   
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      newDocument,
      { headers: headers })
      .subscribe(
        (responseData) => {
         
          this.documents.push(responseData.document);
          
          this.documentListChangedEvent.next([...this.documents]);
        },
        (error) => {
          console.error('Error adding document:', error);
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

  
    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // Update database
    this.http.put<{ message: string }>('http://localhost:3000/documents/' + originalDocument.id,
      newDocument,
      { headers: headers })
      .pipe(
        catchError(error => {
          console.error('Error updating document:', error);
          throw error;
        })
      )
      .subscribe(
        () => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // Delete from database
    this.http.delete<void>('http://localhost:3000/documents/' + document.id)
      .pipe(
        catchError(error => {
          console.error('Error deleting document:', error);
          throw error;
        })
      )
      .subscribe(
        () => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  private sortAndSend() {
    this.documentListChangedEvent.next([...this.documents]);
  }



  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach(document => {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }
}
