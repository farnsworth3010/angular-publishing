import { inject } from '@angular/core';
import { SaleService } from '@app/api/api/sale.service';
import { Sale } from '@app/api/model/sale';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface SalesState {
  sales: Sale[];
  loading: boolean;
  cols: { field: string, header: string, pipe?: any; pipeArgs?: any; }[];
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'date', header: 'Date' },
    { field: 'amount', header: 'Amount' },
    { field: 'price', header: 'Price' },
    { field: 'isExternal', header: 'External' },
    { field: 'bookId', header: 'Book ID' },
    { field: 'userId', header: 'User ID' }
  ]
};

export const SalesStore = signalStore(
  { providedIn: 'root' },
  withState<SalesState>( initialState ),
  withMethods( ( store, saleService: SaleService = inject( SaleService ) ) => ( {
    setSales( sales: Sale[] ) {
      patchState( store, { sales } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => saleService.saleControllerFindAll() ),
        tap( ( sales: Sale[] ) => patchState( store, { loading: false, sales } ) ),
      )
    )
  } ) )
);
