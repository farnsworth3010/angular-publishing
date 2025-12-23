import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { NewsEditDialog } from '@app/shared/dialogs/news/news-edit-dialog';
import { ButtonModule } from 'primeng/button';

@Component( {
  selector: 'pb-news',
  imports: [ ButtonModule ],
  templateUrl: './news.html',
  styleUrl: './news.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class News {
  #dialogService = inject( AppDialogService );

  openCreateNewsDialog() {
    this.#dialogService.open<News, News>( NewsEditDialog, { header: 'Create News', width: '420px' } as any ).then( () => { /* saved via dialog/store */ } );
  }
}
