import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tea } from '@app/models';
import { environment } from '@env/environment';
import { EMPTY, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeaService {
  private images: Array<string> = ['green', 'black', 'herbal', 'oolong', 'dark', 'puer', 'white', 'yellow'];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tea[]> {
    return this.http
      .get<Array<Omit<Tea, 'image'>>>(`${environment.dataService}/tea-categories`)
      .pipe(map((teas) => teas.map((t) => this.convert(t))));
  }

  get(id: number): Observable<Tea> {
    return this.http
      .get<Omit<Tea, 'image'>>(`${environment.dataService}/tea-categories/${id}`)
      .pipe(map((tea) => this.convert(tea)));
  }

  private convert(tea: Omit<Tea, 'image'>): Tea {
    return { ...tea, image: `assets/img/${this.images[tea.id - 1]}.jpg` };
  }
}
