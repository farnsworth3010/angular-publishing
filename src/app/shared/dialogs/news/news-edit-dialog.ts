import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { News } from '@app/api/model/news';
import { AuthorsStore } from '@app/store/authors-store';
import { NewsStore } from '@app/store/news-store';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from "primeng/select";
import { TextareaModule } from 'primeng/textarea';

@Component( {
  selector: 'pb-news-edit-dialog',
  templateUrl: './news-edit-dialog.html',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, DatePickerModule, AutoFocusModule, SelectModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NewsEditDialog {
  #fb = inject( FormBuilder );
  #config = inject( DynamicDialogConfig );
  #ref = inject( DynamicDialogRef );
  #newsStore = inject( NewsStore );
  #authorsStore = inject( AuthorsStore );

  news?: News = this.#config?.data as News | undefined;
  authors = this.#authorsStore.authors;

  form = this.#fb.group( {
    title: [ this.news?.title ?? '', Validators.required ],
    content: [ this.news?.content ?? '', Validators.required ],
    publishedAt: [ this.news?.publishedAt ? new Date( this.news?.publishedAt ) : null, Validators.required ],
    writerId: [ this.news?.writer?.id ?? null, Validators.required ]
  } );

  constructor() {
    // trigger loading of authors when dialog is instantiated
    if ( !this.#authorsStore.authors().length ) {
      this.#authorsStore.get( {} );
    }
  }

  get authorsLoading() {
    return this.#authorsStore.loading();
  }

  cancel() {
    this.#ref.close();
  }

  save() {
    if ( this.form.invalid ) return;

    const payload: any = {
      title: this.form.value.title,
      content: this.form.value.content,
      publishedAt: this.form.value.publishedAt
    };
    // include writerId if present
    if ( this.form.value.writerId ) {
      payload.writerId = Number( this.form.value.writerId );
    }

    if ( this.news?.id ) {
      this.#newsStore.updateNews( this.news.id, payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    } else {
      this.#newsStore.createNews( payload ).subscribe( ( saved ) => {
        this.#ref.close( { data: saved } );
      } );
    }
  }
}
