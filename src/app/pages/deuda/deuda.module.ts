import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudaPage } from './deuda.page';
import { DeudadetallePage } from '../deudadetalle/deudadetalle.page';
import { DeudadetallePageModule } from '../deudadetalle/deudadetalle.module';

@NgModule({
  entryComponents: [ DeudadetallePage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeudadetallePageModule
  ],
  declarations: [ DeudaPage ]
})
export class DeudaPageModule {}
