export interface DialogResult<T = unknown> {
  data?: T;
}

export class DialogRef<T = unknown> {
  constructor( private closeFn: ( result?: DialogResult<T> ) => void ) { }

  close( result?: DialogResult<T> ) {
    this.closeFn( result );
  }
}
