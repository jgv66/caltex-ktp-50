import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.page.html',
  styleUrls: ['./documento.page.scss'],
})
export class DocumentoPage implements OnInit {

  @Input() documento;
  @Input() cliente;
  @Input() usuario;

  detalle = [];

  constructor( private datos: DatosService,
               private funciones: FuncionesService,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
    this.cargaDocumento();
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  ionViewDidLoad() {
  }

  cargaDocumento() {
    this.datos.getDataSp( '/ktp_traeDocumento', true, { id: this.documento.id } )
        .subscribe( data => { this.detalle = data['data']; console.log(data['data']); },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }

}
