import { ChangeDetectionStrategy, Component, inject, Injector, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ConfirmDialogComponent } from '@app/core/dialog/confirm-dialog';
import { AppDialogService } from '@app/core/dialog/dialog.service';
import { DynamicPipe } from '@app/core/pipes/dynamic-pipe';
import { TableModule } from 'primeng/table';

@Component( {
  selector: 'pb-data-table',
  imports: [ TableModule, DynamicPipe, RouterLink ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class DataTable {
  values = input.required<any>();
  cols = input.required<{ field: string, header: string; pipe?: any; isHtml?: boolean; }[]>();

  injector = inject( Injector );
  private dialog = inject( AppDialogService );

  async confirmAction( message?: string ) {
    const result = await this.dialog.open<any, boolean>( ConfirmDialogComponent, {
      header: 'Confirm',
      width: '400px',
      data: {
        message: message ?? 'Are you sure?'
      }
    } as any );

    return result?.data === true;
  }

  constructor() {
    this.confirmAction( 'Test confirmation dialog' );
  }
}
