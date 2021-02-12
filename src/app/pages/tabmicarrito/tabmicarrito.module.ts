import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabmicarritoPage } from './tabmicarrito.page';
import { ObservacionesPageModule } from '../observaciones/observaciones.module';
import { ObservacionesPage } from '../observaciones/observaciones.page';
import { ComponentsModule } from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TabmicarritoPage
  }
];

@NgModule({
  entryComponents: [ ObservacionesPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ObservacionesPageModule,
    ComponentsModule
  ],
  declarations: [TabmicarritoPage]
})
export class TabmicarritoPageModule {}
