import { Component } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  count: Observable<number>;
  nItemes = 0;

  constructor( private funciones: FuncionesService ) {}

  ngOnInit() {
    this.count = this.funciones.CartZise;
  }
}
