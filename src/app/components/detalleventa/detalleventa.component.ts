import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-detalleventa',
  templateUrl: './detalleventa.component.html',
  styleUrls: ['./detalleventa.component.scss'],
})
export class DetalleventaComponent implements OnInit {

  @Input() id;
  @Input() tipo;
  @Input() numero;
  detalle: any = [];
  buscando = false;

  constructor( private modalCtrl: ModalController,
               private datos: DatosService,
               private funciones: FuncionesService ) {}

  ngOnInit() {
    this.buscando = true;
    this.datos.getDetalleNVVPendiente( { id: this.id } )
    .subscribe( data => { this.revisa( data ); },
                err  => { this.buscando = false;
                          this.funciones.msgAlert( 'ATENCION', 'No existen datos para revisar' );  }
    );
  }
  revisa( data ) {
    console.log(data);
    this.buscando = false;
    if ( data === undefined || data.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Documento no posee detalle.', 2 );
    } else {
      this.detalle = data.data;
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
