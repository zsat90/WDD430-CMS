import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = []
  documentSelectedEvent = new EventEmitter<Document>()
  documentChangedEvent = new EventEmitter<Document[]>()

  constructor() { 
    this.documents = MOCKDOCUMENTS
  }

  getDocuments(): Document[]{
    return this.documents.slice()
  }

  getDocument(id:string): Document | null {
    for(let document of this.documents){
      if(document.id === id){
        return document
      }
    }
    return null
  }


  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
  }
}
