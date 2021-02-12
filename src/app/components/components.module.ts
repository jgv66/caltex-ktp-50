import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FilaSindescComponent } from './fila-sindesc/fila-sindesc.component';
import { FilaCondescComponent } from './fila-condesc/fila-condesc.component';
import { VentasComponent } from './ventas/ventas.component';
import { DetalleventaComponent } from './detalleventa/detalleventa.component';

@NgModule({
  entryComponents: [ VentasComponent, DetalleventaComponent ],
  declarations: [ FilaSindescComponent, FilaCondescComponent, VentasComponent, DetalleventaComponent ],
  imports: [ CommonModule, IonicModule ],
  exports: [ FilaSindescComponent, FilaCondescComponent, VentasComponent, DetalleventaComponent ]
})
export class ComponentsModule { }
