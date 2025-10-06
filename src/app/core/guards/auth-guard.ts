import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '@app/store/auth-store';

export const authGuard: CanMatchFn = ( route, state ) => {
  const authStore = inject( AuthStore );
  const router = inject( Router );

  if ( route.path?.includes( 'auth' ) ) {
    if ( authStore.token() ) {
      router.navigateByUrl( '/' );
      return false;
    }
    return true;
  }

  if ( authStore.token() || authStore.isGuest() ) {
    return true;
  }

  router.navigateByUrl( '/auth' );
  return false;
};
