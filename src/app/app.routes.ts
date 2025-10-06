import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'auth', canMatch: [ authGuard ], loadChildren: () => import( './components/auth/auth.routes' ).then( m => m.routes ) },
  { path: '', canMatch: [ authGuard ], loadChildren: () => import( './components/home/home.routes' ).then( m => m.routes ) }
];
