import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Author } from '@app/api/model/author';
import { AuthorsStore } from '@app/store/authors-store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component( {
  selector: 'pb-author-edit-dialog',
  templateUrl: './author-edit-dialog.html',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonModule, InputTextModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AuthorEditDialog implements OnInit {
  #fb = inject( FormBuilder );
  #config = inject( DynamicDialogConfig );
  #ref = inject( DynamicDialogRef );
  #authorsStore = inject( AuthorsStore );

  author?: Author = this.#config?.data as Author | undefined;

  form = this.#fb.group( {
    firstName: [ this.author?.firstName ?? '', Validators.required ],
    lastName: [ this.author?.lastName ?? '', Validators.required ]
  } );

  ngOnInit(): void {
  }

  cancel() {
    this.#ref.close();
  }

  save() {
    if ( this.form.invalid ) return;

    const payload: any = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName
    };

    if ( this.author?.id ) {
      this.#authorsStore.updateAuthor( this.author.id, payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    } else {
      this.#authorsStore.createAuthor( payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    }
  }
}
