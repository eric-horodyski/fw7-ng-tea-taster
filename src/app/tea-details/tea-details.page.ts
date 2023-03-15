import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeaService } from '@app/core/tea/tea.service';
import { Tea } from '@app/models';
import { EMPTY, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tea-details',
  templateUrl: './tea-details.page.html',
  styleUrls: ['./tea-details.page.scss'],
})
export class TeaDetailsPage implements OnInit {
  tea$: Observable<Tea> = EMPTY;
  rating: number = 0;

  constructor(private route: ActivatedRoute, private tea: TeaService) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') as string, 10);
    this.tea$ = this.tea.get(id).pipe(tap((t: Tea) => (this.rating = t.rating)));
  }

  changeRating(tea: Tea) {
    this.tea.save({ ...tea, rating: this.rating });
  }
}
