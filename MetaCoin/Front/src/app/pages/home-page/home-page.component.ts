import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CoinsService} from "../../services/coins.service";
import {TrendChartComponent} from "../../shared/trend-chart/trend-chart.component";

interface Coin {
  Id: number;
  Name: string;
  Symbol: string;
  Price: number;
  PriceChange24H: number;
  PriceChange7D: number;
  ImagePath: string;
  trendData: number[];
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, TrendChartComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  coins: Coin[] = []; // Все монеты
  trendingCoins: Coin[] = []; // 4 случайные монеты для Trending


  constructor(private coinsService: CoinsService) {
  }

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadCoins();
  }

  loadCoins(): void {
    this.coinsService.getCoins().subscribe({
      next: (data) => {
        this.coins = data.map((coin) => ({
          ...coin,
          trendData: this.generateMockData(coin.Price, coin.PriceChange24H) // Генерируем трендовые данные
        }));
        this.selectTrendingCoins(); // После загрузки данных выбираем случайные монеты
      },
      error: (error) => console.error('Error loading coins:', error),
    });
  }

  // Выбираем 4 случайные монеты для Trending
  selectTrendingCoins(): void {
    const shuffled = [...this.coins].sort(() => 0.5 - Math.random());
    this.trendingCoins = shuffled.slice(0, 4);
  }

  // Генерация данных для графика
  generateMockData(price: number, priceChange: number): number[] {
    const fluctuation = price * (Math.abs(priceChange) / 100); // Максимальное колебание
    return Array.from({length: 7}, (_, i) =>
      Math.max(0, price + (Math.random() * fluctuation - fluctuation / 2)) // Колебания вокруг цены
    );
  }

}
