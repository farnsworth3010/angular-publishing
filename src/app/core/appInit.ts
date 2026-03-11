import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@app/store/auth-store';
import { of } from 'rxjs';

export const appInitializer = () => {
  const authStore = inject( AuthStore );
  const router = inject( Router );
  const token = localStorage.getItem( 'token' );

  authStore.setToken( token ? token : null );

  if ( token ) {
    // router.navigateByUrl( '' );
  }
  else {
    router.navigateByUrl( '/auth' );
  }

  return of( true );
};