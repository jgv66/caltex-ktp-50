import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TabinicioPage } from './tabinicio.page';
import { ImagenprodPage } from '../imagenprod/imagenprod.page';
import { ImagenprodPageModule } from '../imagenprod/imagenprod.module';
import { ClientePage } from '../cliente/cliente.page';
import { ClientePageModule } from '../cliente/cliente.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { VentasComponent } from '../../components/ventas/ventas.component';
import { DetalleventaComponent } from '../../components/detalleventa/detalleventa.component';
import { DeudaPage } from '../deuda/deuda.page';
import { DeudaPageModule } from '../deuda/deuda.module';

const routes: Routes = [
  {
    path: '',
    component: TabinicioPage
  }
];

@NgModule({
  entryComponents: [ImagenprodPage, ClientePage, VentasComponent, DetalleventaComponent, DeudaPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ImagenprodPageModule,
    ClientePageModule,
    DeudaPageModule,
    ComponentsModule
  ],
  declarations: [ TabinicioPage ]
})
export class TabinicioPageModule {}
