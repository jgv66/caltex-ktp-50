import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BuscarclientePage } from '../buscarcliente/buscarcliente.page';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { DocumentoPage } from '../documento/documento.page';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  usuario   = undefined;
  impagos   = undefined;
  cliente   = undefined;
  Vencidos  = [];
  PorVencer = [];
  totvencid = 0;
  porvencer = 0;
  lVencidos = true;
  segment   = 'Vencidos';

  constructor( private modalCtrl: ModalController,
               private alertCtrl: AlertController,
               private funciones: FuncionesService,
               private datos: DatosService ) {}

  ngOnInit() {
    this.datos.readDatoLocal( 'KTP_cliente' ).then( dato => { this.cliente = dato; } );
    this.datos.readDatoLocal( 'KTP_usuario' ).then( dato => { this.usuario = dato; } );
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  trasladar() {
    this.modalCtrl.dismiss( this.cliente );
  }

  async buscarCliente() {
    const buscar = await this.modalCtrl.create({
      component: BuscarclientePage,
    });
    await buscar.present();
    /* al salir con datos, los dejará en data y guardaré en memoria */
    const { data } = await buscar.onDidDismiss();
    //
    if ( data ) {
      this.cliente = data;
      this.datos.saveDatoLocal( 'KTP_cliente', data );
      this.impagos   = false;
      this.lVencidos = false;
    }
    //
  }

  documentosImpagos() {
    this.datos.getDataSp( '/ktp_traeImpagos',
                          true,
                          { codigo:  this.cliente.codigo,
                            usuario: this.usuario.KOFU,
                            empresa: this.usuario.EMPRESA } )
              .subscribe( data => { this.revisaExitooFracaso( data ); },
                          err  => { this.funciones.msgAlert( 'ATENCION', err );  });
  }
  revisaExitooFracaso( data ) {
    //
    const rs = data['data'];
    //
    if ( rs === undefined || rs.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Código de cliente no presenta documentos impagos.', 2 );
    } else {
      //
      this.impagos = true;
      this.segment = '';
      //
      rs.forEach( fila => {
        if ( fila.estado === 'por vencer' ) {
          this.PorVencer.push( fila );
          this.porvencer += fila.saldo;
        } else {
          this.Vencidos.push(  fila );
          this.totvencid += fila.saldo; }
      });
    }
  }

  saldo( caso ) {
    if ( caso === 'por' ) {
      return this.porvencer.toLocaleString( 'es', { maximumFractionDigits: 0 } );
    } else {
      return this.totvencid.toLocaleString( 'es', { maximumFractionDigits: 0 } );
    }
  }

  async muestraID( pDocumento ) {
    // this.navCtrl.push( DocumentoPage, { documento: pDocumento, cliente: this.cliente, usuario: this.usuario } );
    const documento = await this.modalCtrl.create({
      component: DocumentoPage,
      componentProps: { documento: pDocumento,
                        cliente: this.cliente,
                        usuario: this.usuario }
    });
    await documento.present();
}

  async limpiarCliente() {
    const alert = await this.alertCtrl.create({
      header: 'Limpiar datos',
      message: 'Desea limpiar los datos y buscar otro cliente?',
      buttons: [
        {
          text: 'No, gracias',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Sí, limpiar',
          handler: () => {
                          this.impagos   = false;
                          this.cliente   = undefined;
                          this.lVencidos = true;
                          this.segment   = 'Vencidos';
                          this.datos.saveDatoLocal( 'KTP_cliente', undefined );
                          }
        }
      ]
    });
    await alert.present();
  }

  cambiaOpcionImpagos( event ) {
    this.lVencidos = ( event.detail.value === 'Vencidos' ) ?  true : false ;
  }
}



