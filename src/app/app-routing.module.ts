import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapPageComponent } from './components/google-map-page/google-map-page.component';

const routes: Routes = [{
  component: GoogleMapPageComponent,
  path: 'map'
},
{
  path: '',
  redirectTo: '/map',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
