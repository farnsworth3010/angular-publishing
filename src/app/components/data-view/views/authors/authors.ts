import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Author } from '@app/api';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { AuthorEditDialog } from '@app/shared/dialogs/author/author-edit-dialog';
import { ButtonModule } from 'primeng/button';

@Component( {
  selector: 'pb-authors',
  imports: [ ButtonModule ],
  templateUrl: './authors.html',
  styleUrl: './authors.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Authors {
  #dialogService = inject( AppDialogService );

  openCreateAuthorDialog() {
    this.#dialogService.open<Author, Author>( AuthorEditDialog, { header: 'Create Author', width: '700px' } as any ).then( () => { /* saved via dialog/store */ } );
  }
}
