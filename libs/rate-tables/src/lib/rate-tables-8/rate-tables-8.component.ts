import { JsonPipe, AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import {
  LiveRateService,
  RateObserDataType,
} from '@rps/buillion-frontend-core/services/live-rate.service';
import { RateBaseSymboles } from '@rps/bullion-interfaces';
import { Observable } from 'rxjs';
interface data {
  headerName: string;
  symbole:RateBaseSymboles
  details: {
    Name: string;
  }[]
}
@Component({
  selector: 'rps-bull-rate-tables-8',
  standalone: true,
  imports: [NgClass, NgFor, AsyncPipe, NgIf, JsonPipe],
  encapsulation: ViewEncapsulation.ShadowDom,
  templateUrl: './rate-tables-8.component.html',
  styleUrls: ['./rate-tables-8.component.scss'],
})
export class RateTables8Component {
  @Input()
  private _table: data[] = [];
  public get table(): data[] {
    return this._table;
  }
  public set table(value: data[]) {
    value.forEach(({symbole})=>{
      this.RateObser$[symbole] = this.Alay.RateObser$[symbole].asObservable()
    })
    this._table = value;
  }
  RateObser$: Record<RateBaseSymboles, Observable<RateObserDataType>> = {} as never
  // gold: Observable<RateObserDataType>;
  // silver: Observable<RateObserDataType>;
  constructor(@Inject(LiveRateService) private readonly Alay: LiveRateService) {
    // this.gold = Alay.RateObser$.GOLD.asObservable();
    // this.gold = Alay.RateObser$.SILVER.asObservable();
  }
  // rate_class = {
  //   red: true,
  //   green: false,
  // };
}
//   {
//     headerName:'SILVER PRODUCT',
//     leftSideName:'PETI 30KG RTGS(TCS)',
//     leftValue:77772,
//     rightSideName:'CHORSA RTGS(TCS)',
//     rightValue:4456521,
//   },
//   {
//     headerName:'SILVER PRODUCT',
//     leftSideName:'PETI 30KG RTGS(TCS)',
//     leftValue:77772,
//     rightSideName:'CHORSA RTGS(TCS)',
//     rightValue:4456521,
//   },
//  ]
