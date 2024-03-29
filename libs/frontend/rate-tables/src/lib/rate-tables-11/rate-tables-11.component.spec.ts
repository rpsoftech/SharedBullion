import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';

import { faker } from '@faker-js/faker';
import { RatesFixture } from '@bf/services/fixtures';
import {
  DemoLiveRateService,
  InitialiseRemoteConnection,
} from '@bf/services/mock';
import { LiveRateService } from '@bf/services/services';
import {
  BaseSymbolPriceInterface,
  RateBaseSymbols,
} from '@rps/bullion-interfaces';
import { RateTables11Component } from './rate-tables-11.component';
import { ChangeDetectionStrategy } from '@angular/core';

describe('RateTablesComponent', () => {
  let component: RateTables11Component;
  let fixture: ComponentFixture<RateTables11Component>;
  let componentHtml: ShadowRoot;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateTables11Component],
      providers: [
        {
          provide: LiveRateService,
          useClass: DemoLiveRateService,
        },
        {
          provide: InitialiseRemoteConnection,
          useValue: false,
        },
      ],
    })
      .overrideComponent(RateTables11Component, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RateTables11Component);
    component = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    componentHtml = (fixture.nativeElement as HTMLElement).shadowRoot!;

    component.Header = 'GOLD PRODUCTS';
    component.sell = 'Sell';

    component.table = [
      {
        symbol: RateBaseSymbols.GOLD,
        productName: [
          {
            name: 'GOLD 999 IMP WITH TDS',
          },
          {
            name: 'GOLD 999 IMP WITH TCS',
          },
        ],
      },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rate Table 11 1st TestCase', () => {
    test('check table length & products Name', () => {
      fixture.detectChanges();
      const headername = componentHtml
        .querySelector('.product_group_header')
        ?.textContent?.trim();
      expect(headername).toStrictEqual(component.Header);
      const Shellname = componentHtml
        .querySelector('.sell')
        ?.textContent?.trim();
      expect(Shellname).toStrictEqual(component.sell);
      const productslength =
        componentHtml.querySelectorAll('.product_name').length;
      for (let i = 0; i < productslength; i++) {
        const productsname = componentHtml
          .querySelectorAll('.product_name')
          [i]?.textContent?.trim();
        expect(productsname).toStrictEqual(
          component.table[0]?.productName[i]?.name.trim(),
        );
      }
    });
  });

  describe('Rate Table 11 2nd TestCase For classes', () => {
    let liveRateServiceRef!: LiveRateService;
    let rate: BaseSymbolPriceInterface;
    beforeEach(() => {
      liveRateServiceRef = fixture.debugElement.injector.get(LiveRateService);
      component.Header = faker.lorem.word();
      component.sell = faker.lorem.word();
      component.table = [
        {
          symbol: RateBaseSymbols.GOLD,
          productName: [{ name: faker.lorem.word() }],
        },
      ];

      rate = RatesFixture.Generate(
        {
          top: 1500,
          bottom: 1000,
          // points: 0
        },
        {
          bottom: 1,
          top: 15,
          // points: 0
        },
      );
      liveRateServiceRef.setRate(new Map([[RateBaseSymbols.GOLD, rate]]));
      liveRateServiceRef.setRate(new Map([[RateBaseSymbols.GOLD, rate]]));
      fixture.detectChanges();
    });
    it('Rate Default No class', () => {
      const rateNode = componentHtml.querySelectorAll('.rate_div')[0];
      expect(rateNode?.classList.contains('rate_high')).toStrictEqual(false);
      expect(rateNode?.classList.contains('rate_low')).toStrictEqual(false);
    });
    it('Rate Low color Red class contains rate_low not rate_high', fakeAsync(() => {
      liveRateServiceRef.setRate(
        new Map([
          [
            RateBaseSymbols.GOLD,
            {
              ask: rate.ask + 10,
            },
          ],
        ]),
      );
      fixture.detectChanges();
      flush();
      const rateNode = componentHtml
        .querySelectorAll('.product_price')[0]
        ?.querySelector('.rate_div');
      expect(rateNode?.classList.contains('rate_high')).toStrictEqual(true);
      expect(rateNode?.classList.contains('rate_low')).toStrictEqual(false);
    }));
    it('Rate High color Green class contains rate_high not rate_low', fakeAsync(() => {
      liveRateServiceRef.setRate(
        new Map([
          [
            RateBaseSymbols.GOLD,
            {
              ask: rate.ask - 10,
            },
          ],
        ]),
      );
      fixture.detectChanges();
      flush();
      const rateNode = componentHtml
        .querySelectorAll('.product_price')[0]
        ?.querySelector('.rate_div');
      expect(rateNode?.classList.contains('rate_high')).toStrictEqual(false);
      expect(rateNode?.classList.contains('rate_low')).toStrictEqual(true);
    }));
  });
});
