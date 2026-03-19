import { inject, Pipe, PipeTransform } from '@angular/core';
import { BooksStore } from '@app/store/books-store';

@Pipe( { name: 'bookName' } )
export class BookNamePipe implements PipeTransform {
  booksStore = inject( BooksStore );
  transform( id: number ): string {
    try {
      const books = this.booksStore?.books() ? this.booksStore.books() : [];
      const b = ( books || [] ).find( ( x: any ) => x.id === id );
      return b ? b.name : String( id );
    } catch ( e ) {
      return String( id );
    }
  }
}
