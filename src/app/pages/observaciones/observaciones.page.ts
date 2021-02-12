import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.page.html',
  styleUrls: ['./observaciones.page.scss'],
})

export class ObservacionesPage implements OnInit {

  @Input() textoObs;
  @Input() textoOcc;
  @Input() fechaDesp;

  constructor(  private modalCtrl: ModalController ) {}

  ngOnInit(): void {
  }

  ionViewDidLoad() {
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  enviar() {
    this.modalCtrl.dismiss( { obs:   this.textoObs,
                              occ:   this.textoOcc,
                              fecha: this.fechaDesp } );
  }

}
