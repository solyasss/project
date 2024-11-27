import {Component} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: any[] = [];
  isAdding: boolean = false; // Флаг режима добавления
  isConfirmingDelete: boolean = false; // Флаг для отображения модального окна
  editIndex: number | null = null;
  newUser: any = {
    Username: '',
    DisplayName: '',
    Email: '',
    Password: '',
    ReferralId: ''
  }; // Новый пользователь
  message: string = ''; // Сообщение об успехе или ошибке
  isSuccess: boolean = true; // Успех или ошибка

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Загрузка списка пользователей
  loadUsers(): void {
    this.usersService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  // Начать редактирование
  startEdit(index: number): void {
    this.editIndex = index;
  }

  // Отмена редактирования
  cancelEdit(): void {
    this.editIndex = null;
    this.message = 'Editing canceled.';
    this.isSuccess = false;
    setTimeout(() => (this.message = ''), 2000);
    this.loadUsers();
  }

  // Сохранение изменений
  saveEdit(user: any): void {
    if (!user.Username || !user.Email) {
      this.message = 'Please fill in all required fields.';
      this.isSuccess = false;
      setTimeout(() => (this.message = ''), 3000);
      return;
    }

    this.usersService.updateUser(user.Id, user).subscribe(
      () => {
        this.message = 'User updated successfully!';
        this.isSuccess = true;
        this.editIndex = null;
        this.loadUsers();
        setTimeout(() => (this.message = ''), 3000);
      },
      (error) => {
        this.message = 'Error updating user: ' + error.message;
        this.isSuccess = false;
        setTimeout(() => (this.message = ''), 3000);
      }
    );
  }

  // Переключение режима добавления
  toggleAddMode(): void {
    this.isAdding = !this.isAdding;
    this.newUser = {}; // Очистка полей
    this.message = '';
  }

  // Сохранение нового пользователя
  saveUser(): void {
    if (!this.newUser.Username || !this.newUser.Email || !this.newUser.Password) {
      this.message = 'Please fill in all required fields.';
      this.isSuccess = false;
      setTimeout(() => (this.message = ''), 3000);
      return;
    }

    this.usersService.createUser(this.newUser).subscribe(
      () => {
        this.message = 'User added successfully!';
        this.isSuccess = true;
        this.isAdding = false;
        this.loadUsers();
        setTimeout(() => (this.message = ''), 3000);
      },
      (error) => {
        this.message = 'Error adding user: ' + error.message;
        this.isSuccess = false;
        setTimeout(() => (this.message = ''), 3000);
      }
    );
  }

  // Подтверждение удаления всех пользователей
  confirmDeleteAll(): void {
    this.isConfirmingDelete = true;
  }

  // Отмена удаления всех пользователей
  cancelDeleteAll(): void {
    this.isConfirmingDelete = false;
  }

  // Удаление всех пользователей
  deleteAllUsers(): void {
    this.usersService.deleteAllUsers().subscribe(
      () => {
        this.loadUsers(); // Перезагружаем список пользователей
        this.isConfirmingDelete = false; // Закрываем модальное окно
        this.message = 'All users deleted successfully!';
        this.isSuccess = true;
        setTimeout(() => (this.message = ''), 3000);
      },
      (error) => {
        this.message = 'Error deleting users: ' + error.message;
        this.isSuccess = false;
        setTimeout(() => (this.message = ''), 3000);
      }
    );
  }

  // Удаление пользователя
  deleteUser(id: number): void {
    this.usersService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }
}
