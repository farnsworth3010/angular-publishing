import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { SaleEditDialog } from '@app/shared/dialogs/sale/sale-edit-dialog';
import { BooksStore } from '@app/store/books-store';
import { SalesStore } from '@app/store/sales-store';
import { UsersStore } from '@app/store/users-store';
import { ButtonModule } from 'primeng/button';
import { filter, take } from 'rxjs';

@Component( {
  selector: 'pb-sales',
  imports: [ ButtonModule ],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Sales implements OnInit {
  #dialog = inject( AppDialogService );
  #store = inject( SalesStore );
  #bookStore = inject( BooksStore );
  #usersStore = inject( UsersStore );
  #salesStore = inject( SalesStore );

  booksLoading$ = toObservable( this.#bookStore.loading );
  usersLoading$ = toObservable( this.#usersStore.loading );

  ngOnInit(): void {
    if ( this.#bookStore.books().length === 0 ) {
      this.#bookStore.get( {} );
    }
    if ( this.#usersStore.users().length === 0 ) {
      this.#usersStore.get( {} );
    }

    this.booksLoading$.pipe( filter( loading => !loading ), take( 1 ) ).subscribe( () => {
      this.#salesStore.setSales( [ ...this.#salesStore.sales() ] );
    } );

    this.usersLoading$.pipe( filter( loading => !loading ), take( 1 ) ).subscribe( () => {
      this.#salesStore.setSales( [ ...this.#salesStore.sales() ] );
    } );
  }

  openCreateSaleDialog() {
    this.#dialog.open( SaleEditDialog, { data: undefined, header: 'Create Sale', width: '640px' } as any ).then( () => { /* saved via dialog/store */ } );
  }

  refresh() {
    this.#store.get( {} );
  }
}
