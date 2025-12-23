import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@app/store/auth-store';
import { jwtDecode } from 'jwt-decode';
import { of } from 'rxjs';

export const appInitializer = () => {
  const authStore = inject( AuthStore );
  const router = inject( Router );
  const token = localStorage.getItem( 'token' );

  authStore.setToken( token ? token : null );

  if ( token ) {
    const decodedToken = jwtDecode( token );
    authStore.setEmail( ( decodedToken as any ).email );
    authStore.setName( ( decodedToken as any ).name );
  }
  else {
    router.navigateByUrl( '/auth' );
  }

  return of( true );
};