import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '@app/api/model/category';

@Pipe( {
  name: 'categories',
  standalone: true,
  pure: true
} )
export class CategoriesPipe implements PipeTransform {
  transform( value?: Category[] | null ): string {
    if ( !value || value.length === 0 ) return '';
    return value.map( c => c.name ).join( ', ' );
  }
}
