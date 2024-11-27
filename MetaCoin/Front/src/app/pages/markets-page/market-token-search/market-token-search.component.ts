import { Component,OnInit } from '@angular/core';
import {SearchBoxComponent} from "./search-box/search-box.component";
import {TokenListComponent} from "./token-list/token-list.component";
import {CoinsService} from "../../../services/coins.service";

interface Token {
  icon: string;
  name: string;
  price: string;
}

@Component({
  selector: 'app-market-token-search',
  standalone: true,
  imports: [
    SearchBoxComponent,
    TokenListComponent
  ],
  templateUrl: './market-token-search.component.html',
  styleUrl: './market-token-search.component.scss'
})
export class MarketTokenSearchComponent implements OnInit {
  tokens: Token[] = []; // Все токены из базы данных
  filteredTokens: Token[] = []; // Отфильтрованные токены
  searchQuery: string = ''; // Поисковый запрос

  constructor(private coinsService: CoinsService) {}

  ngOnInit(): void {
    this.loadTokens();
  }

  loadTokens(): void {
    this.coinsService.getCoins().subscribe({
      next: (data) => {
        // Мапируем данные из базы в формат токенов
        this.tokens = data.map((coin: any) => ({
          icon: coin.ImagePath || 'assets/img/default-icon.png', // Иконка
          name: coin.Name || coin.Symbol, // Название или символ
          price: this.formatPrice(coin.Price) || 'N/A', // Цена с форматированием
        }));

        // Инициализируем отфильтрованные токены всеми токенами
        this.filteredTokens = [...this.tokens];
      },
      error: (error) => console.error('Error loading tokens:', error),
    });
  }

  // Фильтрация токенов
  filterTokens(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredTokens = this.tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(query) // Фильтруем по имени токена
    );
  }

  // Форматирование цены токена (оставляем 5 знаков, затем добавляем ...)
  formatPrice(price: number): string {
    const priceStr = price.toFixed(8); // Убедимся, что цена в виде строки с достаточной точностью
    return priceStr.length > 5 ? `${priceStr.slice(0, 5)}...` : priceStr; // Если длина > 5, обрезаем и добавляем ...
  }
}

