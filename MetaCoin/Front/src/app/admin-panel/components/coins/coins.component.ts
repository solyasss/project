import { Component } from '@angular/core';
import { CoinsService } from "../../../services/coins.service";
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-coins',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './coins.component.html',
  styleUrl: './coins.component.scss'
})
export class CoinsComponent {
  coins: any[] = [];
  isAdding: boolean = false; // Флаг режима добавления
  isConfirmingDelete: boolean = false; // Флаг для отображения модального окна
  newCoin: any = {}; // Новый коин
  message: string = ''; // Сообщение об успехе или ошибке
  isSuccess: boolean = true; // Флаг успеха для сообщения
  selectedFile: File | null = null; // Выбранный файл изображения
  editFile: File | null = null; // Выбранный файл для редактирования
  editIndex: number | null = null; // Индекс редактируемой строки

  constructor(private coinsService: CoinsService) {
  }

  ngOnInit(): void {
    this.loadCoins();
  }

  // Загрузка списка коинов
  loadCoins(): void {
    this.coinsService.getCoins().subscribe((data) => {
      this.coins = data;
    });
  }

  // Начать редактирование
  startEdit(index: number): void {
    this.editIndex = index;
    this.editFile = null;
  }

  // Отмена редактирования
  cancelEdit(): void {
    this.editIndex = null; // Сброс индекса редактирования
    this.message = 'Editing canceled.';
    this.isSuccess = false;
    setTimeout(() => (this.message = ''), 1000);
  }


  // Сохранить изменения
  saveEdit(coin: any): void {
    // Проверка обязательных полей
    if (!coin.Name || !coin.Symbol || !coin.Price) {
      this.message = 'Please fill in all required fields.';
      this.isSuccess = false;
      setTimeout(() => (this.message = ''), 3000);
      return;
    }

    if (this.editFile) {
      const formData = new FormData();
      formData.append('file', this.editFile);

      // Загружаем файл и обновляем коин
      this.coinsService.uploadImage(formData).subscribe(
        (response) => {
          coin.ImagePath = `assets/img/${response.fileName}`;
          this.updateCoin(coin);
        },
        (error) => {
          this.message = 'Error uploading image: ' + error.message;
          this.isSuccess = false;
          setTimeout(() => (this.message = ''), 3000);
        }
      );
    } else {
      // Обновляем коин без загрузки файла
      this.updateCoin(coin);
    }
  }


  // Обновить коин
  updateCoin(coin: any): void {
    this.coinsService.updateCoin(coin.Id, coin).subscribe(
      () => {
        // Успешное обновление
        this.message = 'Coin updated successfully!';
        this.isSuccess = true;
        this.editIndex = null; // Сброс индекса редактирования
        this.loadCoins(); // Перезагрузка списка
        setTimeout(() => (this.message = ''), 3000);
      },
      (error) => {
        // Ошибка при обновлении
        this.message = 'Error updating coin: ' + error.message;
        this.isSuccess = false;
        setTimeout(() => (this.message = ''), 3000);
      }
    );
  }


  showNotification(message: string, isSuccess: boolean): void {
    this.message = message;
    this.isSuccess = isSuccess;
    setTimeout(() => (this.message = ''), 3000); // Убираем сообщение через 3 секунды
  }


  // Обработка файла при редактировании
  handleEditFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editFile = file;
    }
  }


  // Переключение режима добавления
  toggleAddMode(): void {
    this.isAdding = !this.isAdding;
    this.newCoin = {}; // Очистка полей
    this.selectedFile = null;
    this.message = '';
  }

  // Обработка файла
  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Сохранение нового коина
  saveCoin(): void {
    // Проверка, что все обязательные поля заполнены
    if (!this.newCoin.Name || !this.newCoin.Symbol || !this.newCoin.Price || this.selectedFile === null) {
      this.isSuccess = false;
      this.message = 'Please fill in all required fields and upload an image.';
      setTimeout(() => (this.message = ''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Сохраняем изображение
    this.coinsService.uploadImage(formData).subscribe(
      (response) => {
        const imgPath = `assets/img/${response.fileName}`;
        this.newCoin.ImagePath = imgPath;

        // Сохраняем коин
        this.coinsService.createCoin([this.newCoin])
          .subscribe(
            () => {
              this.isSuccess = true;
              this.message = 'Coin added successfully!';
              this.loadCoins(); // Обновляем список коинов
              setTimeout(() => (this.message = ''), 2000);
              this.toggleAddMode(); // Закрываем форму
            },
            (error) => {
              this.isSuccess = false;
              this.message = 'Error adding coin: ' + error.message;
              setTimeout(() => (this.message = ''), 2000);
            }
          );
      },
      (error) => {
        this.isSuccess = false;
        this.message = 'Error uploading image: ' + error.message;
        setTimeout(() => (this.message = ''), 2000);
      }
    );
  }

  // Подтверждение удаления всех коинов
  confirmDeleteAll(): void {
    console.log('Confirm Delete Triggered');
    this.isConfirmingDelete = true;
  }

  // Отмена удаления
  cancelDeleteAll(): void {
    console.log('Cancel Delete Triggered');
    this.isConfirmingDelete = false;
  }

  // Удалить все коины
  deleteAllCoins(): void {
    this.coinsService.deleteAllCoins().subscribe(() => {
      this.loadCoins();
      this.isConfirmingDelete = false; // Закрыть модальное окно
    });
  }

  // Удалить коин
  deleteCoin(id: number): void {
    this.coinsService.deleteCoin(id).subscribe(() => {
      this.loadCoins();
    });
  }

  //====================

  getShortenedImagePath(path: string): string {
    const limit = 15;
    return path.length > limit ? path.substring(0, limit) + '...' : path;
  }

  // Отображение обрезанного пути изображения
  getCoinImagePath(coin: any): string {
    return this.getShortenedImagePath(coin.ImagePath);
  }
}
