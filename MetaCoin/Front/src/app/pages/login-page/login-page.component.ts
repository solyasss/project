import {Component} from '@angular/core';
import {NgClass} from '@angular/common';
import {Router} from "@angular/router";
import {HttpClient} from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  isLoginPage: boolean = true;
  loginEmail: string = '';
  loginPassword: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  confirmPassword: string = '';
  username: string = '';
  referralId: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  showLoginPage() {
    this.isLoginPage = true;
  }

  showSignUpPage() {
    this.isLoginPage = false;
  }

  login(loginEmail: string, loginPassword: string): void {
    this.http.post('http://localhost:8080/api/users/login', {
      Email: this.loginEmail,
      Password: this.loginPassword,
    }).subscribe(
      (response: any) => {
        console.log('Login successful:', response);

        // Сохраняем токен и данные пользователя в localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        this.message = 'Login successful!';
        this.isError = false;

        if (response.user.Role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home-page']);
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.message = 'Invalid email or password.';
        this.isError = true;
      }
    );
  }

  register(): void {
    if (this.signupPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      this.isError = true;
      return;
    }

    // Создаём Username из DisplayName в нижнем регистре
    const username = this.username.toLowerCase();

    const payload = {
      Username: username, // Парсинг из DisplayName в нижний регистр
      DisplayName: this.username,
      Email: this.signupEmail,
      Password: this.signupPassword,
      ReferralId: this.referralId || null, // Если ReferralId пустой, отправляем null
    };

    this.http.post('http://localhost:8080/api/users/register', payload).subscribe(
      (response: any) => {
        console.log('Registration successful:', response);
        this.message = 'Registration successful! Please log in.';
        this.isError = false;
        this.showLoginPage();
      },
      (error) => {
        console.error('Registration failed:', error);
        this.message = 'Registration failed. Please try again.';
        this.isError = true;
      }
    );
  }

  // submitForm(formId: string) {
  //   const form = document.getElementById(formId) as HTMLFormElement;
  //   if (form.checkValidity()) {
  //     this.router.navigate(['/final-page']);
  //   } else {
  //     form.reportValidity();
  //   }
  // }
  //
  // checkPasswords(passwordId: string, confirmPasswordId: string) {
  //   const password = (document.getElementById(passwordId) as HTMLInputElement).value;
  //   const confirmPassword = (document.getElementById(confirmPasswordId) as HTMLInputElement);
  //
  //   if (password !== confirmPassword.value) {
  //     confirmPassword.setCustomValidity('Пароли не совпадают');
  //   } else {
  //     confirmPassword.setCustomValidity('');
  //   }
  // }
}
