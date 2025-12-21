import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newsByAuthor'
})
export class NewsByAuthorPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
