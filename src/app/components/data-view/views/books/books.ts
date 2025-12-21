import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { BooksStore } from '@app/store/books-store';

@Component( {
  selector: 'pb-books',
  templateUrl: './books.html',
  styleUrl: './books.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Books {
  #booksStore = inject( BooksStore );

  protected values: Signal<any[]> = this.#booksStore.books;
  protected cols: Signal<any[]> = this.#booksStore.cols;
}
