import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinlistComponent } from './coinlist/coinlist.component';
import { CoindetailsComponent } from './coindetails/coindetails.component';

const routes: Routes = [
  { path: '', redirectTo:'coin-list', pathMatch:'full'},
  { path: 'coin-list', component: CoinlistComponent},
  { path: 'coin-detail/:id', component: CoindetailsComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
