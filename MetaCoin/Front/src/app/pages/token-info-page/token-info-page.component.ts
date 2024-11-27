import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import {CoinsService} from "../../services/coins.service";
import {TrendChartComponent} from "../../shared/trend-chart/trend-chart.component";
import {FormsModule} from "@angular/forms";

interface Coin {
  Id: number;
  Name: string;
  Symbol: string;
  Price: number;
  PriceChange24H: number;
  PriceChange7D: number;
  Liquidity: number; // Ликвидность в процентах
  Volume: string; // Объем
  Address: string; // Адрес
  Balance: number; // Баланс как число
  Transactions: number; // Транзакции в процентах
  IsFavorite: boolean; // Состояние "сердца"
  ImagePath: string;
  trendData: number[];
}

@Component({
  selector: 'app-token-info-page',
  standalone: true,
  imports: [CommonModule, TrendChartComponent, FormsModule],
  templateUrl: './token-info-page.component.html',
  styleUrl: './token-info-page.component.scss'
})

export class TokenInfoPageComponent implements OnInit {
  coins: Coin[] = []; // Все монеты
  randomCoins: Coin[] = []; // 4 случайные монеты
  filteredCoins: Coin[] = []; // Отфильтрованные монеты
  searchQuery: string = ''; // Значение инпута для поиска

  constructor(private coinsService: CoinsService) {}

  ngOnInit(): void {
    this.loadCoins();
  }

  loadCoins(): void {
    this.coinsService.getCoins().subscribe({
      next: (data) => {
        this.coins = data.map((coin) => {
          const transactions = this.generateRandomTransactions(); // Генерация транзакций
          const liquidity = this.calculateLiquidity(transactions); // Зависимость ликвидности от транзакций
          const volume = this.generateRandomVolume(); // Генерация объема

          return {
            ...coin,
            Liquidity: liquidity, // Ликвидность как число
            Volume: volume, // Объем
            trendData: this.generateMockData(coin.Price, coin.PriceChange24H), // Данные тренда
            Address: this.generateRandomAddress(), // Генерация адреса
            Balance: this.generateRandomBalance(), // Баланс как число
            Transactions: transactions, // Транзакции
            IsFavorite: Math.random() > 0.5, // Случайное состояние "сердца"
          };
        });

        this.filteredCoins = [...this.coins]; // Инициализируем отфильтрованные монеты всеми монетами
        this.selectRandomCoins();
      },
      error: (error) => console.error('Error loading coins:', error),
    });
  }

  // Метод для фильтрации монет
  filterCoins(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCoins = this.coins.filter(
      (coin) =>
        coin.Name.toLowerCase().includes(query) ||
        coin.Symbol.toLowerCase().includes(query)
    );
  }

  // Выбираем 4 случайные монеты
  selectRandomCoins(): void {
    const shuffled = [...this.coins].sort(() => 0.5 - Math.random());
    this.randomCoins = shuffled.slice(0, 4);
  }

  // Генерация случайного объема
  generateRandomVolume(): string {
    const volume = Math.random() * 50 - 30 ; // Случайное значение от 0 до 10 миллионов
    return volume.toFixed(2); // Возвращаем строку с фиксированным количеством знаков
  }

  // Генерация случайного адреса
  generateRandomAddress(): string {
    const chars = 'abcdef0123456789';
    return this.formatAddress(`0x${Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`);
  }

  // Генерация случайного баланса
  generateRandomBalance(): number {
    return parseFloat((Math.random() * 1000).toFixed(4));
  }

  // Генерация случайного процента транзакций
  generateRandomTransactions(): number {
    const percent = Math.random() * 20 - 10; // Диапазон от -10% до +10%
    return parseFloat(percent.toFixed(2));
  }

  // Рассчитываем ликвидность на основе транзакций
  calculateLiquidity(transactions: number): number {
    const baseLiquidity = Math.random() * 10000; // Базовая ликвидность
    const modifier = transactions > 0 ? 1.5 : 0.5; // Повышаем или понижаем в зависимости от транзакций
    return parseFloat((baseLiquidity * modifier / 100).toFixed(2));
  }

  // Генерация данных для графика
  generateMockData(price: number, priceChange: number): number[] {
    const fluctuation = price * (Math.abs(priceChange) / 100);
    return Array.from({ length: 7 }, () =>
      Math.max(0, price + (Math.random() * fluctuation - fluctuation / 2))
    );
  }

  // Форматирование адреса
  formatAddress(address: string): string {
    if (address.length <= 13) {
      return address;
    }
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  }

  // Новый метод для получения класса по значению (положительное/отрицательное)
  getClassBasedOnValue(value: number): string {
    return value < 0 ? 'color-text-red' : 'color-text-green';
  }

  protected readonly parseFloat = parseFloat;
}
