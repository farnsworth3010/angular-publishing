import { Pipe, PipeTransform } from '@angular/core';
import { Author } from '@app/api';

@Pipe( {
  name: 'author'
} )
export class AuthorPipe implements PipeTransform {

  transform( value: Author, ...args: unknown[] ): unknown {
    return '<div>hey</div>';
  }
}
