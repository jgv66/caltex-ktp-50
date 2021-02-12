import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { AlertController, ModalController, IonContent } from '@ionic/angular';
import { ImagenprodPage } from '../imagenprod/imagenprod.page';
import { ClientePage } from '../cliente/cliente.page';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { VentasComponent } from '../../components/ventas/ventas.component';
import { DeudaPage } from '../deuda/deuda.page';

@Component({
  selector: 'app-tabinicio',
  templateUrl: './tabinicio.page.html',
  styleUrls: ['./tabinicio.page.scss'],
})
export class TabinicioPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  lScrollInfinito = false;
  listaProductos  = [];
  offset          = 0;  // primer registro codigo+sucursal
  codproducto     ;
  descripcion     ;
  usuario         ;
  results         = {};
  config:         any;         // Configuracion;
  firstcall       = false;
  filtrosVarios   = false;
  codMarcas       ;
  marcas          = [];
  codRubros       ;
  codSuperFam     ;
  superfamilias   = [];
  Importados      = [];
  nombreEmpresa   ;
  scrollSize      = 20;
  cliente         = undefined ;
  config_precio   = undefined;
  config_stock    = undefined;
  config_occ      = undefined;
  config_orden    = undefined;
  config_imagenes = true;

  constructor( private datos: DatosService, /*  private router: Router,*/
               private funciones: FuncionesService,
               private modalCtrl: ModalController,
               private alertCtrl: AlertController ) {
    this.filtrosVarios      = false;
    this.codproducto        = '';
    this.descripcion        = '';
    this.codRubros          = '';
    this.codMarcas          = '';
    this.codSuperFam        = '';
    this.firstcall          = true;
  }

  ionViewWillEnter() {
    if ( !this.firstcall ) {
      this.datos.readDatoLocal( 'KTP_cliente' ).then( dato => { this.cliente = dato; } );
    } else {
      this.firstcall = false;
    }
  }

  ngOnInit() {
    this.funciones.initCarro();
    this.datos.getDataMarcas().subscribe( data => this.marcas = data['marcas'] );
    this.datos.getDataSuperFamilias().subscribe( data => this.superfamilias = data['superfamilias'] );
    this.getVariablesLocales();
  }

  getVariablesLocales() {
    this.datos.readDatoLocal( 'KTP_empresa' ).then( dato => { this.nombreEmpresa   = dato; } );
    this.datos.readDatoLocal( 'KTP_usuario' ).then( dato => { this.usuario         = dato; } );
    this.datos.readDatoLocal( 'KTP_precio'  ).then( dato => { this.config_precio   = ( dato === undefined ) ? 'no' : dato ; } );
    this.datos.readDatoLocal( 'KTP_stock'   ).then( dato => { this.config_stock    = ( dato === undefined ) ? 'no' : dato ; } );
    this.datos.readDatoLocal( 'KTP_occ'     ).then( dato => { this.config_occ      = ( dato === undefined ) ? 'no' : dato ; } );
    this.datos.readDatoLocal( 'KTP_orden'   ).then( dato => { this.config_orden    = ( dato === undefined ) ? 'CODIGO' : dato ; } );
    this.datos.readDatoLocal( 'KTP_imagenes').then( dato => { this.config_imagenes = ( dato === undefined ) ? true : dato ; } );
  }

  async scanBarcode() {
    // try {
    //   await this.barcode.scan()
    //             .then( barcodeData => {
    //                   this.codproducto = barcodeData.text.trim();
    //                   this.descripcion = '';
    //                   this.aBuscarProductos( 1 );
    //             }, (err) => {
    //                 // An error occurred
    //             });
    // } catch (error) {
    //   console.error(error);
    // }
  }

  aBuscarProductos( xdesde?, infiniteScroll? ) {
    if (  this.codproducto  === '' &&
          this.descripcion === '' &&
          this.codRubros === '' &&
          this.codMarcas === '' &&
          this.codSuperFam === '' &&
          this.codSuperFam === '' ) {
      this.funciones.msgAlert( 'DATOS VACIOS', 'Debe indicar algún dato para buscar.');
    } else {
      //
      if ( xdesde === 1 ) {
          this.funciones.cargaEspera(5000);
          this.offset          = 0 ;
          this.listaProductos  = [];
          this.lScrollInfinito = true;
      } else {
          this.offset += this.scrollSize ;
      }
      //
      const listap = ( this.usuario.LISTACLIENTE !== undefined && this.usuario.LISTACLIENTE !== this.usuario.LISTAMODALIDAD )
                     ? this.usuario.LISTACLIENTE : this.usuario.LISTAMODALIDAD;
      //
      this.datos.getDataSp( '/ktp_buscarProductos',
                            false,
                            {
                              codigo:        this.codproducto,
                              descripcion:   this.descripcion,
                              superfamilias: this.codSuperFam,
                              rubros:        this.codRubros,
                              marcas:        this.codMarcas,
                              listap:        listap,
                              bodega:        this.usuario.BODEGA,
                              empresa:       this.usuario.EMPRESA,
                              kofu:          this.usuario.KOFU,
                              ordenar:       this.config_orden,
                              soloconstock:  ( this.config_stock  === 'no'      ) ? 'false' : 'true',
                              soloconprecio: ( this.config_precio === 'no'      ) ? 'false' : 'true',
                              soloconocc:    ( this.config_occ    === 'no'      ) ? 'false' : 'true',
                              cliente:       ( this.cliente       === undefined ) ? ''      : this.cliente.codigo ,
                              offset:        this.offset,
                            } )
          .subscribe( data => { if ( xdesde === 1 ) { this.funciones.descargaEspera(); }
                                this.revisaExitooFracaso( data, xdesde, infiniteScroll ); },
                      err  => { this.funciones.descargaEspera();
                                this.funciones.msgAlert( 'ATENCION', err );  }
                    );
    }
  }

  revisaExitooFracaso( data: any, xdesde: any, infiniteScroll?: any ) {
    let largoActual = 0;
    const rs = data['data'];
    //
    // console.log(data['data']);
    //
    if ( data['data'] === undefined || data['data'] === 'error en la consulta' || data['data'] === [] ) {
      this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else {
      //
      if ( this.offset === 0 ) {
        largoActual = 0;
        this.listaProductos = rs;
      } else {
        largoActual = this.listaProductos.length;
        this.listaProductos.push( ...rs );
      }

      // aqui detengo el scroll
      if ( infiniteScroll ) {
        infiniteScroll.target.complete();
      }
      //
      if ( data['data'].length < 20  )  {
        this.lScrollInfinito = false;
      } else if ( xdesde === 1 ) {
        this.lScrollInfinito = true ;
      }
      // revisar ecuaciones si cliente está definido
      if ( this.cliente !== undefined ) {
          // variables del cliente
          this.datos.readDatoLocal( 'KTP_variables_cliente' )
              .then( dato => this.ForSobreItemes( largoActual, dato ) );
      }
    }
  }

  private ForSobreItemes( largoActual, dato ) {
    //
    // console.log(dato);
    for (let index = largoActual; index < this.listaProductos.length; index++) {
      const element = this.listaProductos[index];
      if ( element.ecu_max1 !== '' ) {
        try {
          if ( dato[element.ecu_max1] !== undefined ) {
            const x = dato[element.ecu_max1] ;
            // primera unidad
            this.listaProductos[index].descuentomax = x;
            // tslint:disable-next-line: max-line-length
            this.listaProductos[index].preciomayor  = Math.round( this.listaProductos[index].precio - ( this.listaProductos[index].precio * (x / 100) ) );
            this.listaProductos[index].dsctovalor   = Math.round( this.listaProductos[index].precio * (x / 100) );
            // ecuacion a vacio !!
            this.listaProductos[index].ecu_max1 = '';
          }
        } catch {
           //  console.log( 'problemas con ecuacion', element );
        }
      }
    }
  }

  async imagenGrande( producto ) {
    const big_img = await this.modalCtrl.create({
      component: ImagenprodPage,
      componentProps: { imagen:        producto.codigosincolor,
                        codigotecnico: producto.codigotec }
    });
    await big_img.present();
  }

  imagenOnOff() {
    this.config_imagenes = !this.config_imagenes;
    this.datos.saveDatoLocal( 'KTP_imagenes', this.config_imagenes );
  }
  masOpciones() {
    this.filtrosVarios = !this.filtrosVarios ;
    if ( !this.filtrosVarios ) {
      this.codMarcas   = '';
      this.codRubros   = '';
      this.codSuperFam = '';
    }
  }

  masDatos( infiniteScroll: any ) {
    this.aBuscarProductos( 0, infiniteScroll );
  }

  scrollToTop() {
    this.content.scrollToTop(400);
  }
  ionViewDidEnter() {
    this.scrollToTop();
  }

  async Cliente() {
    const buscar = await this.modalCtrl.create({
      component: ClientePage,
    });
    await buscar.present();

    /* al salir con datos, los dejará en data y guardaré en memoria */
    const { data } = await buscar.onDidDismiss();
    // console.log(data);
    if ( data ) {
      this.cliente = data;
      // limpiar datos
      this.offset          = 0 ;
      this.listaProductos  = [];
      this.lScrollInfinito = true;
      // variables asociadas
      this.variablesCliente();
    //
    }
  }

  variablesCliente() {
    this.datos.getDataSp( '/ktp_variables',
                          false,
                          { cliente: this.cliente.codigo,
                            usuario: this.usuario.KOFU,
                            empresa: this.usuario.EMPRESA } )
              .subscribe( data => { this.revisaEoFVariables( data ); },
                          err  => { this.funciones.msgAlert( 'ATENCION', err );  });
  }
  revisaEoFVariables( data ) {
    //
    const rs = data['variables'];
    //
    if ( rs === undefined || rs.length === 0 ) {
      // this.funciones.muestraySale('ATENCION : Código de cliente no presenta documentos impagos.', 2 );
    } else {
      // console.log( rs[0] );
      this.datos.saveDatoLocal( 'KTP_variables_cliente', rs[0] );
    }
  }

  largoListaProductos() {
    return this.listaProductos.length;
  }

  limpiarTextos( caso: number ) {
    if ( caso === 1 ) {
      this.codproducto = '';
    } else if ( caso === 2 ) {
      this.descripcion = '';
    }
  }

  async cambiaDescuento( producto ) {
    const dvend = producto.dsctovend;
    const prompt  = await this.alertCtrl.create({
      header:  'Descto. Máximo : ' + producto.descuentomax.toString() + '%',
      message: 'Ingrese el nuevo descuento a utilizar.',
      inputs:  [ {  name: 'dvend',
                    placeholder: dvend } ],
      buttons: [
        { text: 'Salir',   handler: data => {} },
        { text: 'Cambiar', handler: data => {
          if ( data.dvend < 0 ) {
            this.funciones.msgAlert( 'ATENCION', 'Descuento digitado está incorrecto. Intente con otro valor.' );
          } else if ( data.dvend > producto.descuentomax && this.usuario.puedemodifdscto !== true ) {
              this.funciones.msgAlert('ATENCION', 'Descuento digitado está incorrecto. Intente con otro valor.' );
          } else {
            producto.dsctovend   = data.dvend;
             /* este dato posee el descuento total  */
            producto.preciomayor = Math.round((producto.precio - (producto.precio * data.dvend / 100)));
            producto.dsctovalor  = producto.precio - producto.preciomayor;
          }
        } }
      ]
    });
    await prompt.present();
  }

  async agregarAlCarro( producto ) {
    const cantidad = '1';
    const prompt = await this.alertCtrl.create({
      header:  'Stock Bodega : ' + producto.saldo_ud1.toString(),
      message: 'Ingrese la cantidad a solicitar de este producto. ' +
               'No debe sobrepasar el saldo actual ni lo pedido si ya existe en el carro. El sistema lo validará',
      inputs:  [ { name: 'cantidad',
                   placeholder: cantidad } ],
      buttons: [
        { text: 'Cancelar', handler: data => {} },
        {
          text: 'Guardar', handler: data => {
            producto.apedir = parseInt(data.cantidad, 10) || 1;
            // Agregar validacion sobre producto.saldo_ud1 para no sobrepasar el saldo,
            // Buscar como deshabilitar el boton de agregar al carro en el caso de saldo cero
            this.funciones.Add2Cart(producto, this.cliente, this.usuario);
          }
        }
      ]
    });
    await prompt.present();
  }

  async filtros() {
    this.getVariablesLocales();
    const alert = await this.alertCtrl.create({
      header: 'Filtros para búsquedas',
      inputs: [
        { name: 'CON-STOCK',
          type: 'checkbox',
          label: 'Productos con Stock',
          value: 'CON-STOCK',
          checked: ( this.config_stock === 'si' ) ? true : false },
        { name: 'CON-PRECIO',
          type: 'checkbox',
          label: 'Productos con Precio',
          value: 'CON-PRECIO',
          checked: ( this.config_precio === 'si' ) ? true : false  },
        { name: 'CON-OCC',
          type: 'checkbox',
          label: 'Con OCC futuras',
          value: 'CON-OCC',
          checked: ( this.config_occ === 'si' ) ? true : false  },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Ok',
          handler: (data) => {
            this.guardaDatos( data );
            this.getVariablesLocales();
          }
        }
      ]
    });

    await alert.present();
  }

  guardaDatos( data ) {
    if ( data.filter( (e) => e === 'CON-STOCK' ).length > 0 ) {
      this.datos.saveDatoLocal( 'KTP_stock',  'si' );
    } else {
      this.datos.saveDatoLocal( 'KTP_stock',  'no' );
    }
    if ( data.filter( (e) => e === 'CON-PRECIO' ).length > 0 ) {
      this.datos.saveDatoLocal( 'KTP_precio',  'si' );
    } else {
      this.datos.saveDatoLocal( 'KTP_precio',  'no' );
    }
    if ( data.filter( (e) => e === 'CON-OCC' ).length > 0 ) {
      this.datos.saveDatoLocal( 'KTP_occ',  'si' );
    } else {
      this.datos.saveDatoLocal( 'KTP_occ',  'no' );
    }
  }

  async orden() {
    this.getVariablesLocales();
    const alert = await this.alertCtrl.create({
      header: 'Orden del Reporte',
      inputs: [
        { name: 'CODIGO',
          type: 'radio',
          label: 'Codigo',
          value: 'CODIGO',
          checked: ( this.config_orden === 'CODIGO' ) ? true : false },
        { name: 'DESCRIPCION',
          type: 'radio',
          label: 'Descripción',
          value: 'DESCRIPCION',
          checked: ( this.config_orden === 'DESCRIPCION' ) ? true : false  },
        { name: 'MARCA',
          type: 'radio',
          label: 'Marca',
          value: 'MARCA',
          checked: ( this.config_orden === 'MARCA' ) ? true : false  },
        { name: 'SUPERFAM',
          type: 'radio',
          label: 'Super-Fam.',
          value: 'SUPERFAM',
          checked: ( this.config_orden === 'SUPERFAM' ) ? true : false  },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Ok',
          handler: (data) => {
            this.guardaOrdenamiento( data );
            this.getVariablesLocales();
          }
        }
      ]
    });

    await alert.present();
  }

  guardaOrdenamiento( data ) {
    if ( data.length > 0 ) {
      this.datos.saveDatoLocal( 'KTP_orden', data );
    } else {
      this.datos.saveDatoLocal( 'KTP_orden', 'CODIGO' );
    }
  }

  async ventas() {
    const modal = await this.modalCtrl.create({
      component: VentasComponent,
      componentProps: { usuario: this.usuario }
    });
    await modal.present();
  }

  async deudas() {
    const modal = await this.modalCtrl.create({
      component: DeudaPage,
      componentProps: { usuario: this.usuario }
    });
    await modal.present();
  }

}
