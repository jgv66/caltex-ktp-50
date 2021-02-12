import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'tabinicio' ,   children: [ { path: '', loadChildren: () => import('../tabinicio/tabinicio.module')  .then(m => m.TabinicioPageModule ) }] },
      { path: 'tabmicarrito', children: [ { path: '', loadChildren: () => import('../tabmicarrito/tabmicarrito.module')  .then(m => m.TabmicarritoPageModule ) }] },
      { path: 'tabsalida',    children: [ { path: '', loadChildren: () => import('../tabsalida/tabsalida.module')  .then(m => m.TabsalidaPageModule ) }] },
      { path: '', redirectTo: '/tabs/(tabinicio:tabinicio)', pathMatch: 'full' },
    ]
  },
  { path: '',
    redirectTo: '/tabs/(tabinicio:tabinicio)',
    pathMatch: 'full'
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}