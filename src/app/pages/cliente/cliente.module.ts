import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
/* import { Routes, RouterModule } from '@angular/router'; */

import { IonicModule } from '@ionic/angular';

import { ClientePage } from './cliente.page';
import { BuscarclientePage } from '../buscarcliente/buscarcliente.page';
import { BuscarclientePageModule } from '../buscarcliente/buscarcliente.module';
import { DocumentoPage } from '../documento/documento.page';
import { DocumentoPageModule } from '../documento/documento.module';

/*
const routes: Routes = [
  {
    path: '',
    component: ClientePage
  }
];
*/

@NgModule({
  entryComponents: [
    BuscarclientePage, DocumentoPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, /*    RouterModule.forChild(routes),*/
    BuscarclientePageModule,
    DocumentoPageModule
  ],
  declarations: [ClientePage]
})
export class ClientePageModule {}
