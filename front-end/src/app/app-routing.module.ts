import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PhotosComponent }      from './photos/photos.component';
import { PhotoComponent }      from './photo/photo.component';
import { UserLoginComponent }      from './user-login/user-login.component';
import { AddPhotoComponent }      from './add-photo/add-photo.component';

import { LoginGuard } from './login.guard';

//dodamo možne poti, pri čemer je druga pot s parametrom :_id
//zadnja pot je zaščitena z prijavo
const routes: Routes = [
  { path: 'photos', component: PhotosComponent },
  { path: 'photo/:_id', component: PhotoComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'add-photo', component: AddPhotoComponent, canActivate: [LoginGuard]}

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
