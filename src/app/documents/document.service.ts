import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Observable, Subject } from 'rxjs';
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
  private URL = 'https://wdd430-cms-f5f38-default-rtdb.firebaseio.com/documents.json'

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


  // deleteDocument(document: Document) {
  //   if (!document) {
  //     return;
  //   }
  //   const pos = this.documents.indexOf(document);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.documents.splice(pos, 1);
  //   this.documentChangedEvent.emit(this.documents.slice());
  // }

  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);
    this.storeDocuments(this.documents).subscribe(() => {
      this.documentListChangedEvent.next([...this.documents]);
    });
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }

    const index = this.documents.findIndex(doc => doc.id === originalDocument.id);
    if (index === -1) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[index] = newDocument;
    this.storeDocuments(this.documents).subscribe(() => {
      this.documentListChangedEvent.next([...this.documents]);
    });
  }

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }

    const index = this.documents.findIndex(doc => doc.id === document.id);
    if (index === -1) {
      return;
    }

    this.documents.splice(index, 1);
    this.storeDocuments(this.documents).subscribe(() => {
      this.documentListChangedEvent.next([...this.documents]);
    });
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
