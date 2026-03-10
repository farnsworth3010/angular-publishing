import { FormGroup } from '@angular/forms';

export class Util {
  static markAllControlsAsDirty( form: FormGroup ): void {
    const keys = Object.keys( form.controls );
    keys.forEach( key => {
      form.get( key )?.markAsDirty();
    } );
  }
}