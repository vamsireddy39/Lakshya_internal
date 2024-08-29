import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserIdPostsComponent } from './view-user-id-posts.component';

describe('ViewUserIdPostsComponent', () => {
  let component: ViewUserIdPostsComponent;
  let fixture: ComponentFixture<ViewUserIdPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUserIdPostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewUserIdPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
