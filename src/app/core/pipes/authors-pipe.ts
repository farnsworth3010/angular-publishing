import { Pipe, PipeTransform } from '@angular/core';
import { Author } from '@app/api/model/author';

@Pipe( {
  name: 'authors',
  standalone: true,
  pure: true
} )
export class AuthorsPipe implements PipeTransform {
  transform( value?: Author[] | null ): string {
    if ( !value || value.length === 0 ) return '';
    return value.map( a => `${ a.firstName } ${ a.lastName }` ).join( ', ' );
  }
}
