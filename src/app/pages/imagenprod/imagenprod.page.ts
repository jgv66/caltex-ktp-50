import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-imagenprod',
  templateUrl: './imagenprod.page.html',
  styleUrls: ['./imagenprod.page.scss'],
})
export class ImagenprodPage implements OnInit {

  @Input() imagen;
  @Input() codigotecnico;

  constructor( private modalCtrl: ModalController ) {}

  ngOnInit() {
  }

  salir() {
    this.modalCtrl.dismiss();
  }
}
