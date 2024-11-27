import { Component, OnInit,OnDestroy  } from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {ThemeService} from "../../../../services/theme.service";
import { Subscription } from 'rxjs';
import {CoinsService} from "../../../../services/coins.service";
import {TrendChartComponent} from "../../../../shared/trend-chart/trend-chart.component";

interface Coin {
  Id: number;
  Name: string;
  Symbol: string;
  Price: number;
  PriceChange24H: number;
  ImagePath: string;
  trendData: number[];
}

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    NgClass,
    TrendChartComponent
  ],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.scss'
})
export class BarchartComponent implements OnInit, OnDestroy{
  isDarkTheme: boolean = false; // Инициализация переменной
  themeSubscription: Subscription = new Subscription();

  coin: Coin | null = null; // Один выбранный коин
  coinsSubscription: Subscription = new Subscription();

  constructor(private themeService: ThemeService, private coinsService: CoinsService) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe(isDark => {
      this.isDarkTheme = isDark;
    });

    this.loadCoin();
  }

  loadCoin(): void {
    this.coinsSubscription = this.coinsService.getCoins().subscribe({
      next: (coins) => {
        if (coins.length > 0) {
          const selectedCoin = coins[0]; // Выбираем первый коин
          this.coin = {
            ...selectedCoin,
            trendData: this.generateMockData(selectedCoin.Price, selectedCoin.PriceChange24H),
          };
        }
      },
      error: (error) => console.error('Error loading coin data:', error),
    });
  }


  generateMockData(price: number, priceChange: number): number[] {
    const fluctuation = price * (Math.abs(priceChange) / 100);
    return Array.from({ length: 7 }, () =>
      Math.max(0, price + (Math.random() * fluctuation - fluctuation / 2))
    );
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
      this.coinsSubscription.unsubscribe();
    }
  }
}
