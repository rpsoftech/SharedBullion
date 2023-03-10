import {
  BaseSymbolePriceInterface,
  RateBaseSymboles,
  RateTypeKeys,
} from '@rps/bullion-interfaces';
import { faker } from '@faker-js/faker';
import { JsonToItrable } from '../core';
export class RatesFixture {
  static Generate(
    range: {
      points?: number;
      top: number;
      bottom: number;
    },
    bidAskDiff: {
      points?: number;
      top: number;
      bottom: number;
    },
    previous: Partial<BaseSymbolePriceInterface> = {}
  ): BaseSymbolePriceInterface {
    const ask = faker.datatype.number({
      max: range.top,
      min: range.bottom,
      precision: range.points,
    });
    const bid =
      ask -
      faker.datatype.number({
        max: bidAskDiff.top,
        min: bidAskDiff.bottom,
        precision: bidAskDiff.points,
      });
    previous['ask-high'] = previous['ask-high'] ?? ask;
    previous['ask-low'] = previous['ask-low'] ?? ask;
    previous['bid-high'] = previous['bid-high'] ?? bid;
    previous['bid-low'] = previous['bid-low'] ?? bid;
    previous['last-high'] = previous['last-high'] ?? previous['ask-high'];
    previous['last-low'] = previous['last-low'] ?? previous['bid-low'];
    return {
      'ask-high': previous['ask-high'] > ask ? previous['ask-high'] : ask,
      'ask-low': previous['ask-low'] < ask ? previous['ask-low'] : ask,
      'bid-high': previous['bid-high'] > bid ? previous['bid-high'] : bid,
      'bid-low': previous['bid-low'] < bid ? previous['bid-low'] : bid,
      'last-high':
        previous['last-high'] > previous['ask-high']
          ? previous['last-high']
          : previous['ask-high'],
      'last-low':
        previous['last-low'] < previous['bid-low']
          ? previous['last-low']
          : previous['bid-low'],
      ask,
      bid,
      close:
        previous.close ??
        faker.datatype.number({
          max: range.top,
          min: range.bottom,
          precision: range.points,
        }),
      open:
        previous.open ??
        faker.datatype.number({
          max: range.top,
          min: range.bottom,
          precision: range.points,
        }),
    };
  }
  static GetDiffRate(
    current: BaseSymbolePriceInterface,
    previous: BaseSymbolePriceInterface
  ): Partial<BaseSymbolePriceInterface> {
    const o: Partial<BaseSymbolePriceInterface> = {};
    for (const [k, v] of JsonToItrable<number, RateTypeKeys>(current)) {
      if (previous[k] !== v) {
        o[k] = v;
      }
    }
    return o;
  }
  static GenerateForAllSymboles():Record<RateBaseSymboles, BaseSymbolePriceInterface> {
    const GOLD = RatesFixture.Generate(
      {
        bottom: 56000,
        top: 57000,
      },
      {
        top: 15,
        bottom: 0,
      }
    );
    const SILVER = RatesFixture.Generate(
      {
        bottom: 65000,
        top: 68000,
      },
      {
        top: 15,
        bottom: 0,
      }
    );
    const SILVER_SPOT = RatesFixture.Generate(
      {
        top: 25,
        bottom: 23,
        points: 0.01,
      },
      {
        top: 2,
        bottom: 0,
        points: 0.01,
      }
    );
    const INR = RatesFixture.Generate(
      {
        top: 82,
        bottom: 81,
        points: 0.0001,
      },
      {
        top: 1,
        bottom: 0,
        points: 0.0001,
      }
    );
    const GOLD_SPOT = RatesFixture.Generate(
      {
        bottom: 1800,
        top: 1900,
        points: 0.01,
      },
      {
        top: 2,
        bottom: 1,
        points: 0.01,
      }
    );
    return {
      GOLD,
      GOLD_MCX: GOLD,
      SILVER,
      SILVER_MCX: SILVER,
      GOLD_SPOT,
      INR,
      SILVER_SPOT,
    };
  }
}
