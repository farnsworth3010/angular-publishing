import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '@app/api/model/category';
import { CategoriesStore } from '@app/store/categories-store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component( {
  selector: 'pb-category-edit-dialog',
  templateUrl: './category-edit-dialog.html',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonModule, InputTextModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CategoryEditDialog {
  #fb = inject( FormBuilder );
  #config = inject( DynamicDialogConfig );
  #ref = inject( DynamicDialogRef );
  #categoriesStore = inject( CategoriesStore );

  category?: Category = this.#config?.data as Category | undefined;

  form = this.#fb.group( {
    name: [ this.category?.name ?? '', Validators.required ]
  } );

  cancel() {
    this.#ref.close();
  }

  save() {
    if ( this.form.invalid ) return;

    const payload = {
      name: this.form.value.name ?? ''
    };

    if ( this.category?.id ) {
      this.#categoriesStore.updateCategory( this.category.id, payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    } else {
      this.#categoriesStore.createCategory( payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    }
  }
}
