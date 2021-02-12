import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-deudadetalle',
  templateUrl: './deudadetalle.page.html',
  styleUrls: ['./deudadetalle.page.scss'],
})
export class DeudadetallePage implements OnInit {

  @Input() deuda;
  @Input() empresa;
  @Input() vendedor;
  documentos = [];
  enviarCorreo = false;
  email = '';
  copia = '';

  constructor( private modalCtrl: ModalController,
               private datos: DatosService,
               private funciones: FuncionesService ) { }

  ngOnInit() {
    // console.log(this.deuda);
    this.rescataDetalle();
  }

  rescataDetalle() {
    this.datos.getDataSp( '/ktp_detalleImpagos', true, { empresa: this.empresa, cliente: this.deuda.cliente } )
        .subscribe( data => { this.documentos = data['data']; console.log(data['data']); },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }

  sendEmail() {
    // console.log( this.email, this.subject, this.copia );
    if ( this.email === '' ) {
     this.funciones.msgAlert( 'ATENCION', 'Debe ingresar los datos de email. Corrija y reintente.' );
    } else {

      this.datos.getDataSp( '/enviarDeuda',
                            true,
                            { to: this.email,
                              cc: this.copia,
                              empresa: this.empresa,
                              vendedor: this.vendedor,
                              cliente: JSON.stringify( this.deuda ),
                              documentos: JSON.stringify( this.documentos )} )
          .subscribe( dev => { this.revisaRespuesta( dev ); } );
    }
   }
   revisaRespuesta( dev ) {
     if ( dev.resultado === 'error' ) {
       this.funciones.msgAlert( 'ATENCION', dev.mensaje );
     } else {
       this.funciones.msgAlert( 'ATENCION', 'El email fue enviado con exito.' + dev.mensaje );
     }
   }

  salir() {
    this.modalCtrl.dismiss();
  }

}
