import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  uuid;

  constructor( private router: Router,
               private datos: DatosService )  {}

  ngOnInit(): void {
    this.usrRegistro();
  }

  async usrRegistro() {
    const uuidReg = await this.datos.readDatoLocal( 'KTP_user_uuid' )
      .then(  data  => {
                try { if ( data !== '' && data !== undefined ) {
                        this.uuid = data;
                      } else {
                        this.registroUUid();
                      }
                } catch (error) {
                  /* no hay registro */
                }},
              error => { console.log(error); } );
  }

  // registro del dispositivo !!!
  registroUUid() {
    this.datos.getNewId().subscribe( data => { this.uuid = data['newid'][0].newid;
                                               this.datos.saveDatoLocal( 'KTP_user_uuid', this.uuid );
                                             });
  }

  doLogin() {
    this.router.navigate( ['/login' ] ) ;
  }

}
