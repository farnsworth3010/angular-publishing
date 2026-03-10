import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'arrayItem'
} )
export class ArrayItemPipe implements PipeTransform {
  transform( value: any[], reduceFunction: ( value: any[] ) => string ): unknown {
    return reduceFunction( value );
  }
}
