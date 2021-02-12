import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabsalida',
  templateUrl: './tabsalida.page.html',
  styleUrls: ['./tabsalida.page.scss'],
})
export class TabsalidaPage implements OnInit {

  constructor( private funciones: FuncionesService,
               private router: Router ) { }

  ngOnInit() {
  }

  salirDelSistema() {
    this.funciones.initCarro();
    this.router.navigateByUrl( 'login' );
  }

}
