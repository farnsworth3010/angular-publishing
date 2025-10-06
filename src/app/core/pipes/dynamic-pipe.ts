import { inject, Injector, Pipe, PipeTransform, Type } from '@angular/core';

@Pipe( {
  name: 'dynamic'
} )
export class DynamicPipe implements PipeTransform {
  injector = inject( Injector );

  transform( value: any, requiredPipe: Type<any>, pipeArgs?: any ): unknown {
    const injector = Injector.create( {
      name: 'DynamicPipe',
      parent: this.injector,
      providers: [
        { provide: requiredPipe }
      ]
    } );
    const pipe = injector.get( requiredPipe );
    return pipe.transform( value, pipeArgs );
  }
}
