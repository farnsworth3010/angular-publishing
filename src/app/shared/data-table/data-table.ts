import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DynamicPipe } from '@app/core/pipes/dynamic-pipe';
import { TableModule } from 'primeng/table';

@Component( {
  selector: 'pb-data-table',
  imports: [ TableModule, DynamicPipe ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class DataTable {
  values = input.required<any>();
  cols = input.required<{ field: string, header: string; pipe?: any; }[]>();
}
