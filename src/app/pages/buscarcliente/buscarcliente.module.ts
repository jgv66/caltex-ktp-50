import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
/* import { Routes, RouterModule } from '@angular/router'; */

import { IonicModule } from '@ionic/angular';

import { BuscarclientePage } from './buscarcliente.page';

/*  esto se quita porque de lo contrario serian una pagina, tb se elimina el RouterModule
const routes: Routes = [
  {
    path: '',
    component: BuscarclientePage
  }
];
*/

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule   /*,RouterModule.forChild(routes)*/
  ],
  declarations: [BuscarclientePage]
})
export class BuscarclientePageModule {}
