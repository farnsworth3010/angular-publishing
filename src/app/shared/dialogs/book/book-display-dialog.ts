import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Book } from '@app/api/model/book';
import { AuthorsPipe } from '@app/core/pipes/authors-pipe';
import { CategoriesPipe } from '@app/core/pipes/categories-pipe';
import { MaterialsPipe } from '@app/core/pipes/materials-pipe';
import { MaterialsStore } from '@app/store/materials-store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component( {
  selector: 'pb-book-display-dialog',
  templateUrl: './book-display-dialog.html',
  standalone: true,
  imports: [ ButtonModule, AuthorsPipe, CategoriesPipe, DatePipe, MaterialsPipe ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class BookDisplayDialog implements OnInit {
  constructor( public config: DynamicDialogConfig, private ref: DynamicDialogRef ) { }

  #materialsStore = inject( MaterialsStore );

  #materials = this.#materialsStore.materials;

  loadingMaterials = this.#materialsStore.loading;

  ngOnInit(): void {
    if ( !this.#materials().length ) {
      this.#materialsStore.get( {} );
    }
  }

  get book(): Book | undefined {
    return this.config?.data as Book | undefined;
  }

  // keep pipe usage reachable from TS so static analysis recognizes them
  get authorsText(): string {
    return new AuthorsPipe().transform( this.book?.authors ) as string;
  }

  get categoriesText(): string {
    return new CategoriesPipe().transform( this.book?.categories ) as string;
  }

  close() {
    this.ref.close();
  }
}
