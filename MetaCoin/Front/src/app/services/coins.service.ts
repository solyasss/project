import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  private apiUrl = 'http://localhost:8080/api/coins';

  constructor(private http: HttpClient) {
  }

  // Получить список коинов
  getCoins(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Создать новый коин
  createCoin(coin: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, coin);
  }

  // Обновить коин
  updateCoin(id: number, coin: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, coin);
  }

  // Удалить коин
  deleteCoin(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Удалить все коины
  deleteAllCoins(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/all`);
  }

  // Загрузить изображение
  uploadImage(imageData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/upload', imageData);
  }

// Удалить изображение (запрос к серверу)
  deleteImage(imagePath: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/delete-image', { imagePath });
  }

}
