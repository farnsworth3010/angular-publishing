import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '@app/api/model/book';
import { coerceNumber } from '@app/shared/utils/number-utils';
import { AuthorsStore } from '@app/store/authors-store';
import { BooksStore } from '@app/store/books-store';
import { CategoriesStore } from '@app/store/categories-store';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

@Component( {
  selector: 'pb-book-edit-dialog',
  templateUrl: './book-edit-dialog.html',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, MultiSelectModule, DatePickerModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class BookEditDialog implements OnInit {
  #fb = inject( FormBuilder );
  #config = inject( DynamicDialogConfig );
  #ref = inject( DynamicDialogRef );
  #booksStore = inject( BooksStore );
  #authorsStore = inject( AuthorsStore );
  #categoriesStore = inject( CategoriesStore );

  book?: Book = this.#config?.data as Book | undefined;

  form = this.#fb.group( {
    name: [ this.book?.name ?? '', Validators.required ],
    pages: [ this.book?.pages ?? 0, Validators.required ],
    value: [ coerceNumber( this.book?.value ) ?? 0, Validators.required ],
    quantity: [ this.book?.quantity ?? 0 ],
    publishingStart: [ this.book?.publishingStart ? new Date( this.book.publishingStart as any ) : null ],
    publishingEnd: [ this.book?.publishingEnd ? new Date( this.book.publishingEnd as any ) : null ],
    authorIds: [ this.book?.authors?.map( a => a.id ) ?? [] ],
    categoryIds: [ this.book?.categories?.map( c => c.id ) ?? [] ]
  } );

  authorsOptions = computed( () => this.#authorsStore.authors().map( a => ( { label: `${ a.firstName } ${ a.lastName }`, value: a.id } ) ) );
  authorsLoading = computed( () => this.#authorsStore.loading() );
  categoriesOptions = computed( () => this.#categoriesStore.categories().map( c => ( { label: c.name, value: c.id } ) ) );
  categoriesLoading = computed( () => this.#categoriesStore.loading() );

  ngOnInit(): void {
    if ( this.#authorsStore.authors().length === 0 ) {
      this.#authorsStore.get( {} );
    }
    if ( this.#categoriesStore.categories().length === 0 ) {
      this.#categoriesStore.get( {} );
    }
  }

  cancel() {
    this.#ref.close();
  }

  save() {
    if ( this.form.invalid ) return;

    const payload: any = {
      name: this.form.value.name,
      pages: this.form.value.pages,
      value: coerceNumber( this.form.value.value ),
      quantity: this.form.value.quantity,
      publishingStart: this.form.value.publishingStart ? ( ( this.form.value.publishingStart as Date ).toISOString().split( 'T' )[ 0 ] ) : null,
      publishingEnd: this.form.value.publishingEnd ? ( ( this.form.value.publishingEnd as Date ).toISOString().split( 'T' )[ 0 ] ) : null,
      authorIds: this.form.value.authorIds,
      categoryIds: this.form.value.categoryIds
    };

    if ( this.book?.id ) {
      this.#booksStore.updateBook( this.book.id, payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    } else {
      this.#booksStore.createBook( payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    }
  }
}
