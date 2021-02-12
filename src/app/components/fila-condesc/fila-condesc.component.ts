import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fila-condesc',
  templateUrl: './fila-condesc.component.html',
  styleUrls: ['./fila-condesc.component.scss'],
})
export class FilaCondescComponent implements OnInit {

  @Input() producto;

  constructor() { }

  ngOnInit() {}

}
