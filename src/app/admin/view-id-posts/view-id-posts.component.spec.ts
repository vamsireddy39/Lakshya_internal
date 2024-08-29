import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIdPostsComponent } from './view-id-posts.component';

describe('ViewIdPostsComponent', () => {
  let component: ViewIdPostsComponent;
  let fixture: ComponentFixture<ViewIdPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewIdPostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewIdPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
