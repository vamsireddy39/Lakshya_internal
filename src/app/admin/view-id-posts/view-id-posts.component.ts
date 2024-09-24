import { Component, SecurityContext } from '@angular/core';
import { ObservablesService } from '../../observables.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-id-posts',
  templateUrl: './view-id-posts.component.html',
  styleUrl: './view-id-posts.component.scss'
})
export class ViewIdPostsComponent {
  postIdDetails:any;
  constructor(public observable : ObservablesService, private sanitizer: DomSanitizer){

  }
  ngOnInit(){
    this.observable.postByIdDetailsPathIndex$.subscribe((response)=>{
      console.log(response);
      this.postIdDetails = response
    })
  }
  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.sanitize(SecurityContext.HTML, descr) || '';
    return sanitizedDescr.length > length ? sanitizedDescr.slice(0, length) + '...' : sanitizedDescr;
  }
  

}
