import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUserDto, UserService } from '@app/api';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { debounceTime, of, pipe, switchMap, tap } from 'rxjs';

interface AuthState {
  token: string | null;
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  exp: number | null;
}

const initialState: AuthState = {
  token: null,
  name: null,
  email: null,
  isAuthenticated: false,
  loading: false,
  exp: null,
  isGuest: false
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>( initialState ),
  withMethods( ( store ) => ( {
    setToken( token: string | null ) {
      patchState( store, { token } );
      localStorage.setItem( 'token', token ?? '' );
    },
  } ) ),
  withMethods( ( store, router = inject( Router ), userService = inject( UserService ), messageService = inject( MessageService ) ) => ( {
    login: rxMethod(
      pipe(
        tap( ( dto: LoginUserDto ) => patchState( store, { loading: true } ) ),
        debounceTime( 500 ),
        switchMap( ( dto: LoginUserDto ) => userService.userControllerLogin( dto ).pipe( tapResponse(
          {
            next: ( res ) => {

              if ( res ) {
                const token = res?.user.token;

                if ( token ) {
                  store.setToken( token );
                  const decodedToken = jwtDecode( token );
                  patchState( store, { exp: decodedToken.exp } );
                  router.navigateByUrl( '/' );
                }
                patchState( store, { ...res.user } );
              }
            }, error: ( err ) => {
              messageService.add( { severity: 'error', summary: 'Error', detail: 'Invalid email or password', life: 3000 } );
              return of( null );
            },
            finalize: () => {
              patchState( store, { loading: false } );
            }
          }
        ) ) ),
      )
    ),
    loginAsGuest() {
      patchState( store, { isGuest: true, name: 'Guest' } );
      router.navigateByUrl( '/' );
    },
    logout() {
      patchState( store, { token: null } );
      localStorage.removeItem( 'token' );
      router.navigate( [ '/auth' ] );
    }
  } )
  )
);