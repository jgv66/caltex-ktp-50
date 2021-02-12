import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { ModalController } from '@ionic/angular';
import { DetalleventaComponent } from '../detalleventa/detalleventa.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})
export class VentasComponent implements OnInit {

  @Input() usuario;
  buscando = false;
  lista = [];

  constructor( private datos: DatosService,
               private funciones: FuncionesService,
               private modalCtrl: ModalController ) {  }

  ngOnInit() {
    this.buscando = true;
    this.datos.getNVVPendientes( { vendedor: this.usuario.KOFU, empresa: this.usuario.EMPRESA } )
    .subscribe( data => { this.revisar( data ); },
                err  => { this.buscando = false;
                          this.funciones.msgAlert( 'ATENCION', 'No existen datos para revisar' );  }
    );
  }

  revisar( data ) {
    // console.log(data);
    this.buscando = false;
    if ( data.resultado === 'ok' ) {
      this.lista = data.data;
    } else {
      this.lista = [];
      this.funciones.msgAlert( 'ATENCION', 'No existen datos para revisar' );
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  async detalle( nvv ) {
    const modal = await this.modalCtrl.create({
      component: DetalleventaComponent,
      componentProps: { id: nvv.id,
                        tipo: nvv.td,
                        numero: nvv.numero }
    });
    await modal.present();
  }

}