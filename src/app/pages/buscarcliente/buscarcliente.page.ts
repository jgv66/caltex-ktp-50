import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { DatosService } from '../../services/datos.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-buscarcliente',
  templateUrl: './buscarcliente.page.html',
  styleUrls: ['./buscarcliente.page.scss'],
})
export class BuscarclientePage implements OnInit {

  codcliente    = '';
  listaClientes = undefined;
  usuario       = undefined;

  constructor( private modalCtrl: ModalController,
               private funciones: FuncionesService,
               private datos: DatosService ) { }

  ngOnInit() {
    this.datos.readDatoLocal( 'KTP_usuario' ).then( dato => { this.usuario = dato; } );
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  retornaCliente( cliente ) {
    this.modalCtrl.dismiss( cliente );
  }

  aBuscarClientes() {
    // console.log( this.codcliente );
    if ( this.codcliente === undefined ) {
      this.funciones.msgAlert( 'DATO VACIO', 'Debe indicar algún dato para buscar....');
    } else {
      this.listaClientes = [];
      this.datos.getDataSp( '/ktp_buscarClientes',
                            true,
                            { dato:    this.codcliente,
                              usuario: this.usuario.KOFU,
                              empresa: this.usuario.EMPRESA }  )
          .subscribe( data => { this.revisaExitooFracaso( data ); },
                      err  => { this.funciones.msgAlert( 'ATENCION', err );  }
                    )
    }
  }

  private revisaExitooFracaso( data ) {
    // console.log(data.data);
    const rs    = data['data'];
    const largo = rs.length;
    // console.log(rs);
    if ( rs === undefined || rs.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else if ( largo > 0 ) {
      this.listaClientes.push( ...rs );
    }
  }

}
