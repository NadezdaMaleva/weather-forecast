import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filler'
})
export class FillerPipe implements PipeTransform {

  transform(value: any): string {
    if(value) {
      return value
    } return '-/-';
  }

}
