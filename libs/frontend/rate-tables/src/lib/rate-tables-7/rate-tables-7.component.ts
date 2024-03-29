/* eslint-disable camelcase */
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  ChangeDetectionStrategy,
  Signal,
  ViewEncapsulation,
} from '@angular/core';
import { LiveRateService, RateSignalDataType } from '@bf/services';
import { RateBaseSymbols } from '@rps/bullion-interfaces';

export interface IRateTable7Data {
  symbol: RateBaseSymbols;
  productname: { name: string }[];
}

@Component({
  selector: 'rps-bull-rate-tables-7',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [AsyncPipe, JsonPipe, NgFor, NgIf],
  encapsulation: ViewEncapsulation.ShadowDom,
  templateUrl: './rate-tables-7.component.html',
  styleUrls: ['./rate-tables-7.component.scss'],
})
export class RateTables7Component {
  GOLD: Signal<RateSignalDataType>;
  // SILVER: Observable<RateObserDataType>;

  // silverData = [
  //   {
  //     name: 'SILVER. BARTCS',
  //   },
  //   {
  //     name: 'Silver Peti RJT TCS',
  //   },
  //   {
  //     name: 'Silver Bar RR TCS',
  //   },
  // ];

  // constructor(@Inject(LiveRateService) alay: LiveRateService) {
  //   this.SILVER = alay.RateObser$.SILVER_SPOT.asObservable();

  @Input() Table_title = {
    Header: '',
    sell: '',
    gold: '',
    buy: '',
  };

  @Input()
  private _table: IRateTable7Data[] = [];

  public get table(): IRateTable7Data[] {
    return this._table;
  }

  public set table(value: IRateTable7Data[]) {
    value.forEach(({ symbol }) => {
      this.RateObser$[symbol] = this.rateObservar.RateSignal$[symbol];
    });
    this._table = value;
  }

  RateObser$: Record<RateBaseSymbols, Signal<RateSignalDataType>> = {} as never;

  constructor(
    @Inject(LiveRateService) private readonly rateObservar: LiveRateService,
  ) {
    this.GOLD = rateObservar.RateSignal$.GOLD_SPOT;
  }
}
