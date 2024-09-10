import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { RegisterComponent } from './common/register/register.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'User', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'register', component: RegisterComponent },
  // { path: '**', redirectTo: '/', pathMatch: 'full' }, // Optional: redirect any undefined path to admin

  // { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
