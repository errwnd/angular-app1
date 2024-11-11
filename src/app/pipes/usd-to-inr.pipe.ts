import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usdToInr'
})
export class UsdToInrPipe implements PipeTransform {
    private readonly CONVERSION_RATE = 83.50;

  transform(value: number): string {
    const inrValue = value * this.CONVERSION_RATE;
    return `₹${inrValue.toFixed(2)}`;
  }
}