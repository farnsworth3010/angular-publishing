import { ChangeDetectionStrategy, Component, inject, Injector, input } from '@angular/core';
import { DynamicPipe } from '@app/core/pipes/dynamic-pipe';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component( {
  selector: 'pb-data-table',
  imports: [ TableModule, DynamicPipe, ButtonModule ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class DataTable {
  values = input.required<any>();
  cols = input.required<{ field: string, header: string; pipe?: any; isHtml?: boolean; }[]>();

  protected injector = inject( Injector );
}
