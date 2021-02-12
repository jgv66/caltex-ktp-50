import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Subject, Observable } from 'rxjs';
import { Carrito } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  loader:          any;
  loading:         any;
  usuario:         any;
  cliente:         any;
  varCliente:      any = [];
  config:          any;
  copiaPendientes: any;
  pendientes:      number;
  // misCompras       = 0;
  documento:       any;

  // estructura de carrito
  miCarrito: Array<Carrito> = [];

  listSizeSubject: Subject<number>;
  misCompras: Observable<number>;

  constructor( private loadingCtrl: LoadingController,
               private alertCtrl:   AlertController,
               private toastCtrl:   ToastController ) {
      //
      console.log('<<< FuncionesService >>>');
      //
      this.listSizeSubject = new Subject();
      this.misCompras = this.listSizeSubject.asObservable();
      //                 
  }

  get CartZise() {
    return this.misCompras;
  }
  refreshCarrito() {
    // next method updates the stream value
    this.listSizeSubject.next( (this.miCarrito.length === 1 && this.miCarrito[0].codigo === '' ) ? 0 : this.miCarrito.length ); 
    //
  }

  textoSaludo() {
    const dia   = new Date();
    if ( dia.getHours() >= 8  && dia.getHours() < 12 ) {
      return 'buenos días ';
    } else if ( dia.getHours() >= 12 && dia.getHours() < 19 ) {
      return 'buenas tardes ';
    } else {
      return 'buenas noches '; }
  }

  async cargaEspera( milisegundos?) {
    this.loader = await this.loadingCtrl.create({
      duration: ( milisegundos != null && milisegundos !== undefined ? milisegundos : 3000 )
      });
    await this.loader.present();
  }

  descargaEspera() {
    this.loader.dismiss();
  }

  async msgAlert( titulo, texto ) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
  }

  async muestraySale( cTexto, segundos, posicion? ) {
    const toast = await this.toastCtrl.create({
      message: cTexto,
      duration: 1500 * segundos,
      position: posicion || 'middle',
      animated: true,
      translucent: true,
    });
    await toast.present();
  }

  initCarro() {
    this.miCarrito  = [{empresa:      '',
                        vendedor:     '',
                        bodega:       '',
                        sucursal:     '',
                        cliente:      '',
                        suc_cliente:  '',
                        codigo:       '',
                        codigoimagen: '',
                        descrip:      '',
                        cantidad:     0,
                        saldo_ud1:    0,
                        precio:       0,
                        preciomayor:  0,
                        descuentomax: 0,
                        dsctovend:    0,
                        listapre:     '',
                        metodolista:  '',
                        concompras:   0 }];
    this.refreshCarrito() ;
  }

  aunVacioElCarrito() {
    return ( this.miCarrito.length === 1 && this.miCarrito[0].codigo === '' );
  }

  existeEnCarrito( producto ) {
    let existe = false ;
    const largo = this.miCarrito.length;
    for ( let i = 0 ; i < largo ; i++ ) {
        if ( this.miCarrito[i].codigo.trim() === producto.codigo.trim() && this.miCarrito[i].bodega.trim() === producto.bodega.trim() ) {
            existe = true;
            break;
        }
    }
    return existe;
  }

  cuantosProductosEnCarroTengo() {
    let tot = 0;
    const largo = this.miCarrito.length;
    for ( let i = 0 ; i < largo ; i++ ) {
      if ( this.miCarrito[i].codigo !== '' ) {
          ++tot;
      }
    }
    return tot;
  }

  agregaACarrito( producto ) {
    const largo = this.miCarrito.length;
    for ( let i = 0 ; i < largo ; i++ ) {
        if ( this.miCarrito[i].codigo.trim() === producto.codigo.trim() && this.miCarrito[i].bodega.trim() === producto.bodega.trim() ) {
             this.miCarrito[i].cantidad += producto.apedir;
             break;
        }
    }
  }

  Add2Cart( producto, cliente, usuario ) {
    if ( this.aunVacioElCarrito() ) {
        this.miCarrito[0].empresa      = usuario.EMPRESA;
        this.miCarrito[0].vendedor     = usuario.KOFU;
        this.miCarrito[0].bodega       = producto.bodega;
        this.miCarrito[0].sucursal     = producto.sucursal;
        this.miCarrito[0].cliente      = cliente.codigo;
        this.miCarrito[0].suc_cliente  = cliente.sucursal;
        this.miCarrito[0].codigo       = producto.codigo;
        this.miCarrito[0].descrip      = producto.descripcion;
        this.miCarrito[0].cantidad     = producto.apedir;
        this.miCarrito[0].saldo_ud1    = producto.saldo_ud1;
        this.miCarrito[0].codigoimagen = producto.codigosincolor;
        this.miCarrito[0].precio       = producto.precio;
        this.miCarrito[0].preciomayor  = producto.preciomayor;
        this.miCarrito[0].descuentomax = producto.descuentomax;
        this.miCarrito[0].dsctovend    = producto.dsctovend;
        this.miCarrito[0].listapre     = producto.listaprecio;
        this.miCarrito[0].metodolista  = producto.metodolista;
        this.miCarrito[0].concompras   = producto.concompras;
    } else if ( this.existeEnCarrito( producto ) ) {
        this.agregaACarrito( producto );
    } else {
        this.miCarrito.push({ empresa:      usuario.EMPRESA,
                              vendedor:     usuario.KOFU,
                              bodega:       producto.bodega,
                              sucursal:     producto.sucursal,
                              cliente:      cliente.codigo,
                              suc_cliente:  cliente.sucursal,
                              codigo:       producto.codigo,
                              descrip:      producto.descripcion,
                              cantidad:     producto.apedir,
                              saldo_ud1:    producto.saldo_ud1,
                              codigoimagen: producto.codigosincolor,
                              precio:       producto.precio,
                              preciomayor:  producto.preciomayor,
                              descuentomax: producto.descuentomax,
                              dsctovend:    producto.dsctovend,
                              listapre:     producto.listaprecio,
                              metodolista:  producto.metodolista,
                              concompras:   producto.concompras });
    }
    this.muestraySale( 'Item agregado al carro', 0.5, 'middle' );
    this.refreshCarrito() ;
  }

  sumaCarrito( enBruto ) {
    let tot = 0;
    const largo = this.miCarrito.length;
    for ( let i = 0 ; i < largo ; i++ ) {
        if ( this.miCarrito[i].descuentomax <= 0 || this.miCarrito[i].descuentomax === undefined ) {
            tot += this.miCarrito[i].cantidad * this.miCarrito[i].precio * ( (enBruto) ? 1.19 :  1 );
        } else {
            tot += this.miCarrito[i].cantidad * this.miCarrito[i].preciomayor * ( (enBruto) ? 1.19 :  1 );
        }
    }
    return tot;
  }

  async modificaCantidad( producto, cliente ) {
    const cantidad = producto.cantidad;
    const prompt = await this.alertCtrl.create({
      header:  'Stock Bodega : ' + producto.saldo_ud1.toString(),
      message: 'Ingrese la cantidad a solicitar de este producto. ' +
               'No debe sobrepasar el stock actual ni la suma de lo pedido. ' +
               'El sistema lo validará.',
      inputs:  [ { name: 'cantidad', placeholder: cantidad } ],
      buttons: [
        { text: 'Salir',   handler: data => {} },
        { text: 'Cambiar !', handler: data => {
          producto.apedir = parseInt( data.cantidad , 10 ) || 1 ;
          const largo = this.miCarrito.length;
          for ( let i = 0 ; i < largo ; i++ ) {
              if ( this.miCarrito[i].codigo.trim() === producto.codigo.trim() &&
                   this.miCarrito[i].bodega.trim() === producto.bodega.trim() ) {
                this.miCarrito[i].cantidad = producto.apedir;
              }
          }
        } }
      ]
    });
    await prompt.present();
  }

  quitarDelCarro( producto ) {
    let i = 0;
    if ( !this.aunVacioElCarrito() ) {
        this.miCarrito.forEach(element => {
          if ( this.miCarrito[i].codigo === producto.codigo && this.miCarrito[i].bodega === producto.bodega ) {
            this.miCarrito.splice(i, 1);
          }
          ++i;
        });
    }
    if ( this.miCarrito.length === 0 ) {
         this.miCarrito = [];
    }
    this.refreshCarrito() ;
    ;
  }

}

