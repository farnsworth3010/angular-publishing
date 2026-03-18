import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '@app/api/model/book';
import { coerceNumber } from '@app/shared/utils/number-utils';
import { AuthorsStore } from '@app/store/authors-store';
import { BooksStore } from '@app/store/books-store';
import { CategoriesStore } from '@app/store/categories-store';
import { MaterialsStore } from '@app/store/materials-store';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';

@Component( {
  selector: 'pb-book-edit-dialog',
  templateUrl: './book-edit-dialog.html',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule, MultiSelectModule, DatePickerModule, SelectModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class BookEditDialog implements OnInit {
  #fb = inject( FormBuilder );
  #config = inject( DynamicDialogConfig );
  #ref = inject( DynamicDialogRef );
  #booksStore = inject( BooksStore );
  #authorsStore = inject( AuthorsStore );
  #categoriesStore = inject( CategoriesStore );
  #materialsStore = inject( MaterialsStore );

  book?: Book = this.#config?.data as Book | undefined;

  form = this.#fb.group( {
    name: [ this.book?.name ?? '', Validators.required ],
    pages: [ this.book?.pages ?? 0, Validators.required ],
    value: [ coerceNumber( this.book?.value ) ?? 0, Validators.required ],
    quantity: [ this.book?.quantity ?? 0 ],
    publishingStart: [ this.book?.publishingStart ? new Date( this.book.publishingStart as any ) : null ],
    publishingEnd: [ this.book?.publishingEnd ? new Date( this.book.publishingEnd as any ) : null ],
    authorIds: [ this.book?.authors?.map( a => a.id ) ?? [] ],
    categoryIds: [ this.book?.categories?.map( c => c.id ) ?? [] ],
    // reactive controls for materials: array of { materialId, amount }
    materials: this.#fb.array( ( this.book?.bookMaterials ?? [] ).map( bm => this.#fb.group( {
      materialId: [ bm.material_id, Validators.required ],
      amount: [ bm.amount ?? 1, Validators.required ]
    } ) ) ),
    newMaterialId: [ null ],
    newMaterialAmount: [ 1 ]
  } );

  authorsOptions = computed( () => this.#authorsStore.authors().map( a => ( { label: `${ a.firstName } ${ a.lastName }`, value: a.id } ) ) );
  authorsLoading = computed( () => this.#authorsStore.loading() );
  categoriesOptions = computed( () => this.#categoriesStore.categories().map( c => ( { label: c.name, value: c.id } ) ) );
  categoriesLoading = computed( () => this.#categoriesStore.loading() );
  materialsOptions = computed( () => this.#materialsStore.materials().map( m => ( { label: m.name, value: m.id } ) ) );
  materialsLoading = computed( () => this.#materialsStore.loading() );

  // materials are stored in reactive FormArray at form.controls.materials

  addMaterial() {
    const newId = this.form.get( 'newMaterialId' )?.value as number | null;
    const newAmount = this.form.get( 'newMaterialAmount' )?.value as number | null;
    if ( !newId ) return;
    const arr = this.materialsArray;
    // if existing material exists, increase amount
    const idx = arr.controls.findIndex( ( c: any ) => c.value.materialId === newId );
    if ( idx >= 0 ) {
      const ctrl = arr.at( idx );
      ctrl.patchValue( { amount: ( ctrl.value.amount ?? 0 ) + ( newAmount ?? 0 ) } );
    } else {
      arr.push( this.#fb.group( { materialId: [ newId, Validators.required ], amount: [ newAmount ?? 1, Validators.required ] } ) );
    }
    // reset new material controls
    this.form.patchValue( { newMaterialId: null, newMaterialAmount: 1 } );
  }

  removeMaterial( index: number ) {
    this.materialsArray.removeAt( index );
  }

  materialLabel( id?: number ) {
    return this.materialsOptions().find( x => x.value === id )?.label ?? '';
  }

  ngOnInit(): void {
    if ( this.#authorsStore.authors().length === 0 ) {
      this.#authorsStore.get( {} );
    }
    if ( this.#categoriesStore.categories().length === 0 ) {
      this.#categoriesStore.get( {} );
    }
    if ( this.#materialsStore.materials().length === 0 ) {
      this.#materialsStore.get( {} );
    }
    console.log( this.form.value );
  }

  get materialsArray() {
    return this.form.get( 'materials' ) as import( '@angular/forms' ).FormArray;
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

    // include materials (material id + amount) from reactive FormArray
    payload.materials = ( this.form.value.materials ?? [] ).map( ( m: any ) => ( { id: m.materialId, amount: m.amount } ) );

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
