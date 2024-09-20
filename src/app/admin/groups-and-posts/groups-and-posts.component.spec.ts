import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsAndPostsComponent } from './groups-and-posts.component';

describe('GroupsAndPostsComponent', () => {
  let component: GroupsAndPostsComponent;
  let fixture: ComponentFixture<GroupsAndPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupsAndPostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupsAndPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
