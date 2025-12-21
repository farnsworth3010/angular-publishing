import { inject } from '@angular/core';
import { MaterialService } from '@app/api/api/material.service';
import { Material } from '@app/api/model/material';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface MaterialsState {
  materials: Material[];
  loading: boolean;
  cols: { field: string, header: string, pipe?: any; pipeArgs?: any; }[];
}

const initialState: MaterialsState = {
  materials: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'amount', header: 'Amount' },
    { field: 'bookMaterials', header: 'BookMaterials' }
  ]
};

export const MaterialsStore = signalStore(
  { providedIn: 'root' },
  withState<MaterialsState>( initialState ),
  withMethods( ( store, materialService: MaterialService = inject( MaterialService ) ) => ( {
    setMaterials( materials: Material[] ) {
      patchState( store, { materials } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => materialService.materialControllerFindAll() ),
        tap( ( materials: Material[] ) => patchState( store, { loading: false, materials } ) ),
      )
    )
  } ) )
);
