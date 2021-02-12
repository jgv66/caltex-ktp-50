import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FuncionesService } from 'src/app/services/funciones.service';
import { DatosService } from '../../services/datos.service';
import { DeudadetallePage } from '../deudadetalle/deudadetalle.page';

@Component({
  selector: 'app-deuda',
  templateUrl: './deuda.page.html',
  styleUrls: ['./deuda.page.scss'],
})
export class DeudaPage implements OnInit {

  @Input() usuario;

  pais = '';
  ciudad = '';
  comuna = '';
  paises = [];
  ciudades = [];
  comunas = [];
  deuda = [];

  constructor( private modalCtrl: ModalController,
               private datos: DatosService,
               private funciones: FuncionesService ) { }

  ngOnInit() {
    this.cargaPaises();
  }

  cargaPaises() {
    this.datos.getDataSp( '/ktp_geo', true, { id: 1 } )
        .subscribe( data => { this.paises = data['data']; },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }

  cargaCiudades() {
    this.ciudad = '';
    this.ciudades = [];
    this.datos.getDataSp( '/ktp_geo', true, { id: 2, pais: this.pais } )
        .subscribe( data => { this.ciudades = data['data'] },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }

  cargaComunas() {
    this.comunas = [];
    this.comuna = '';
    this.datos.getDataSp( '/ktp_geo', true, { id: 3, pais: this.pais, ciudad: this.ciudad } )
        .subscribe( data => { this.comunas = data['data']; },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  procesar() {
    this.deuda = [];
    // tslint:disable-next-line: max-line-length
    this.datos.getDataSp( '/ktp_resumenImpagos', true, { empresa: this.usuario.empresa, pais: this.pais, ciudad: this.ciudad, comunas: JSON.stringify(this.comuna) } )
        .subscribe( data => { this.deuda = data['data']; console.log(data['data']); },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }

  async detalle( d ) {
    const modal = await this.modalCtrl.create({
    component: DeudadetallePage,
    componentProps: { deuda: d, empresa: this.usuario.empresa, vendedor: this.usuario.KOFU }
    });
    await modal.present();
  }

}
