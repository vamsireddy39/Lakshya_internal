import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../common/header/header.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GroupsComponent } from '../groups/groups.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    GroupsComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule

  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule { }
