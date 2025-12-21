import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { DataTable } from "@app/shared/data-table/data-table";
import { BooksStore } from '@app/store/books-store';

@Component( {
  selector: 'pb-books',
  imports: [ DataTable ],
  templateUrl: './books.html',
  styleUrl: './books.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Books {
  #booksStore = inject( BooksStore );

  protected values: Signal<any[]> = this.#booksStore.books;
  protected cols: Signal<any[]> = this.#booksStore.cols;
}
