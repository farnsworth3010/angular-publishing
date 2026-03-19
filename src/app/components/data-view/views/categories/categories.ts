import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Category } from '@app/api';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { CategoryEditDialog } from '@app/shared/dialogs/category/category-edit-dialog';
import { ButtonModule } from 'primeng/button';

@Component( {
  selector: 'pb-categories',
  imports: [ ButtonModule ],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class Categories {
  #dialogService = inject( AppDialogService );

  openCreateCategoryDialog() {
    this.#dialogService.open<Category, Category>( CategoryEditDialog, { header: 'Create Category', width: '420px' } as any ).then( () => { /* saved via dialog/store */ } );
  }
}
