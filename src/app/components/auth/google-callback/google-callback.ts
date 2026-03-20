import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@app/store/auth-store';
import { ProgressBarModule } from 'primeng/progressbar';

@Component( {
  selector: 'app-google-callback',
  imports: [ ProgressBarModule ],
  template: `<p-progressbar mode="indeterminate" styleClass="h-1" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class GoogleCallback {
  constructor() {
    const route = inject( ActivatedRoute );
    const authStore = inject( AuthStore );
    const router = inject( Router );

    const token = route.snapshot.queryParamMap.get( 'token' );

    if ( token ) {
      authStore.loginWithGoogle( token );
    } else {
      router.navigateByUrl( '/auth/sign-in' );
    }
  }
}
