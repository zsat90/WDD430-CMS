import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css',
})
export class DocumentDetailComponent implements OnInit {
  document: Document | any = null
  nativeWindow: any;
  

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private windowRefService: WindRefService
  ) {
  }

  ngOnInit() {
    this.nativeWindow = this.windowRefService.getNativeWindow()
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      const doc = this.documentService.getDocument(id)
      this.document = doc
      
    });
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url)
    }
  }

  onDelete(){
    this.documentService.deleteDocument(this.document)
    this.router.navigate(['/documents'])
  }

}
