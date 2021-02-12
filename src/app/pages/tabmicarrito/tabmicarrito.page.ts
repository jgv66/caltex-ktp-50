import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ObservacionesPage } from '../observaciones/observaciones.page';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-tabmicarrito',
  templateUrl: './tabmicarrito.page.html',
  styleUrls: ['./tabmicarrito.page.scss'],
})
export class TabmicarritoPage implements OnInit {
  //
  grabando      = false;
  usuario: any  = [];
  carrito       = [];
  cliente       = [];
  totalCarrito  = 0;
  textoObs      = '';
  textoOcc      = '';
  fechaDesp:    Date;
  //
  constructor( private funciones: FuncionesService,
               private datos:     DatosService,
               private alertCtrl: AlertController,
               private router: Router,
               private modalCtrl: ModalController ) {}

  ngOnInit() {
    this.datos.readDatoLocal( 'KTP_usuario' ).then( dato => { this.usuario = dato; } );
  }

  ionViewWillEnter() {
    this.carrito      = this.funciones.miCarrito;
    this.totalCarrito = this.funciones.sumaCarrito( false );
  }

  ionViewDidEnter() {
    this.totalCarrito = this.funciones.sumaCarrito( false );
  }

  ionViewDidLoad() {
    this.carrito      = this.funciones.miCarrito;
    this.totalCarrito = this.funciones.sumaCarrito( false );
  }

  sumaCarrito( enBruto: boolean ) {
    return this.funciones.sumaCarrito( enBruto );
  }

  cambiarCantidad( producto ) {
      this.funciones.modificaCantidad( producto, this.cliente );
  }

  async quitarDelPedido( producto ) {
    const confirm = await this.alertCtrl.create({
      header:  'Eliminar ítem',
      message: 'Desea eliminar este ítem -> ' + producto.codigo + ' ?',
      buttons: [
                { text: 'Sí, elimine!', handler: () => { this.funciones.quitarDelCarro( producto ); } },
                { text: 'No, gracias',  handler: () => {} }
               ]
      });
      await confirm.present();
  }

  async observaciones() {
    const rescataObs = await this.modalCtrl.create({
        component: ObservacionesPage,
        componentProps: { textoObs:   this.textoObs,
                          textoOcc:   this.textoOcc,
                          fechaDesp:  this.fechaDesp }
    });
    await rescataObs.present();

    const { data } = await rescataObs.onDidDismiss();
    if ( data !== undefined) {
      if ( data.obs !== undefined && data.obs !== '' ) {
        this.textoObs = data.obs;
      }
      if ( data.fecha !== undefined && data.fecha !== '' ) {
        this.fechaDesp = data.fecha;
      }
      if ( data.occ !== undefined && data.occ !== '' ) {
        this.textoOcc = data.occ;
      }
      this.funciones.muestraySale('Observaciones guardadas', 1 );
    }
  }

  async preguntaGrabar() {
    console.log(this.carrito);
    const confirm = await this.alertCtrl.create({
      header:  'Grabar documento',
      message: 'Desea grabar este pedido ?',
      buttons: [
                { text: 'Sí, grabar', handler: () => this.enviarCarrito() },
                { text: 'No',  handler: () => {} }
               ]
      });
      await confirm.present();
  }

  enviarCarrito() {
    //
    const fechaDespacho = ( this.fechaDesp ) ? this.fechaDesp.toString().substring(0, 10) : undefined ;
    this.grabando = true;
    //
    this.funciones.cargaEspera();
    this.datos.grabarDocumentos( this.carrito, this.usuario.MODALIDAD, 'NVV', this.textoObs, this.textoOcc, fechaDespacho )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaExitooFracaso( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', 'Ocurrió un error -> ' + err ); }
      )
  }

  private revisaExitooFracaso( data ) {
    this.grabando = false;
    if ( data.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Los datos ingresados podrían estar incorrectos. Vuelva a revisar y reintente.' );
    } else {
      try {
        if ( data.resultado === 'ok' ) {
            this.funciones.msgAlert('Documento #' + data.numero, 'Su Nro. de documento es el ' + data.numero +
                                    '. Ya ha llegado al sistema. Una copia del documento será despachado a su correo para verificación.'+
                                    ' Gracias por utilizar nuestro carro de compras.' );
            this.funciones.initCarro();
            this.router.navigate(['/tabs/tabinicio']);
        } else {
            this.funciones.msgAlert('ERROR', data );
        }
      } catch (e) {
        this.funciones.msgAlert('ATENCION', 'Ocurrió un error al intentar guardar el documento ->' + e );
      }
    }

  }

}
