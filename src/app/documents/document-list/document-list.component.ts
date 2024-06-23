import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  subscription!: Subscription;
  maxDocumentId!: number;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.subscription = this.documentService.getDocuments().subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.documentService.getMaxId();
        this.documents.sort((a, b) => a.id.localeCompare(b.id));
        this.documentService.documentListChangedEvent.next(this.documents);
      },
      (error: any) => {
        console.error('Error fetching documents:', error); 
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); 
  }

}
