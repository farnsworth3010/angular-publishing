import { inject, Pipe, PipeTransform } from '@angular/core';
import { UsersStore } from '@app/store/users-store';

@Pipe( { name: 'userName' } )
export class UserNamePipe implements PipeTransform {
  usersStore = inject( UsersStore );
  transform( id: number ): string {
    try {
      const users = this.usersStore?.users() ?? [];
      const u = users.find( ( x: any ) => x.id === id );
      if ( !u ) return String( id );
      return u.email;
    } catch ( e ) {
      return String( id );
    }
  }
}
