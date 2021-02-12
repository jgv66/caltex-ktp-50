import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fila-sindesc',
  templateUrl: './fila-sindesc.component.html',
  styleUrls: ['./fila-sindesc.component.scss'],
})
export class FilaSindescComponent implements OnInit {

  @Input() producto;

  constructor() { }

  ngOnInit() {}

}
