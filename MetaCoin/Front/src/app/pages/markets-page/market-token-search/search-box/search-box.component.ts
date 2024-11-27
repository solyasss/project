import { Component,EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent {
  @Output() searchChange = new EventEmitter<string>();

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchChange.emit(query); // Отправляем запрос в родительский компонент
  }
}
