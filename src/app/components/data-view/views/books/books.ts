import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Book } from '@app/api';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { BookEditDialog } from '@app/shared/dialogs/book/book-edit-dialog';
import { ButtonModule } from 'primeng/button';

@Component( {
  selector: 'pb-books',
  templateUrl: './books.html',
  styleUrl: './books.css',
  imports: [ ButtonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Books {
  #dialogService = inject( AppDialogService );

  openCreateBookDialog() {
    this.#dialogService.open<Book, Book>( BookEditDialog, { header: 'Create Book', width: '700px' } as any ).then( () => { /* saved via dialog/store */ } );
  }
}
