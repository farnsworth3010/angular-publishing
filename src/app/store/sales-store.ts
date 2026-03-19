import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { SaleService } from '@app/api/api/sale.service';
import { Sale } from '@app/api/model/sale';
import { BookNamePipe } from '@app/core/pipes/book-name-pipe';
import { UserNamePipe } from '@app/core/pipes/user-name-pipe';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { catchError, pipe, switchMap, tap } from 'rxjs';

interface SalesState {
  sales: Sale[];
  loading: boolean;
  cols: Array<{ field: string, header: string, pipe?: any; pipeArgs?: any; link?: any; actions?: any; }>;
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  cols: [
    { field: 'id', header: 'ID' },
    { field: 'date', header: 'Date', pipe: DatePipe },
    { field: 'amount', header: 'Amount' },
    { field: 'price', header: 'Price' },
    { field: 'isExternal', header: 'External' },
    { field: 'bookId', header: 'Book', pipe: BookNamePipe },
    { field: 'userId', header: 'User', pipe: UserNamePipe }
  ]
};

export const SalesStore = signalStore(
  { providedIn: 'root' },
  withState<SalesState>( initialState ),
  withMethods( ( store, saleService: SaleService = inject( SaleService ), messageService: MessageService = inject( MessageService ) ) => ( {
    setSales( sales: Sale[] ) {
      patchState( store, { sales } );
    },
    setLoading( loading: boolean ) {
      patchState( store, { loading } );
    },
    get: rxMethod(
      pipe(
        tap( () => patchState( store, { loading: true } ) ),
        switchMap( () => saleService.saleControllerFindAll() ), catchError( ( err ) => {
          patchState( store, { loading: false } );
          return [];
        } ),
        tap( ( sales: Sale[] ) => patchState( store, { loading: false, sales } ) ),
      )
    ),
    createSale( payload: any ) {
      const obs = saleService.saleControllerCreate( payload );
      obs.subscribe( ( created: Sale ) => {
        const next = [ ...store.sales(), created ];
        patchState( store, { sales: next } );
      }, ( err ) => {
        const detail = err?.error?.error?.message || 'Failed to create sale';
        messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
      } );
      return obs;
    },
    updateSale( id: number, payload: any ) {
      const obs = saleService.saleControllerUpdate( id, payload );
      obs.subscribe( ( updated: Sale ) => {
        const next = store.sales().map( ( s ) => s.id === updated.id ? updated : s );
        patchState( store, { sales: next } );
      }, ( err ) => {
        const detail = err?.error?.error?.message || 'Failed to update sale';
        messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
      } );
      return obs;
    },
    deleteSale( id: number ) {
      const obs = saleService.saleControllerRemove( id );
      obs.subscribe( {
        next: () => {
          const next = store.sales().filter( ( s ) => s.id !== id );
          patchState( store, { sales: next } );
        },
        error: ( err ) => {
          const detail = err?.error?.error?.message || 'Failed to delete sale';
          messageService.add( { severity: 'error', summary: 'Error', detail, life: 5000 } );
        }
      } );
      return obs;
    }
  } ) )
);
