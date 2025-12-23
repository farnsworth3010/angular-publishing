import { inject } from '@angular/core';
import { UserService } from '@app/api/api/user.service';
import { User } from '@app/api/model/user';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface UsersState {
  users: User[];
  loading: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState<UsersState>( initialState ),
  withMethods( ( store, userService: UserService = inject( UserService ) ) => ( {
    setUsers( users: User[] ) {
      patchState( store, { users } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => userService.userControllerFindAll() ),
        tap( ( users: User[] ) => patchState( store, { loading: false, users } ) ),
      )
    )
  } ) )
);
