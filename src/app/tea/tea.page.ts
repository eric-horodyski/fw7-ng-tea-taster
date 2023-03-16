import { Component, OnInit } from '@angular/core';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { TeaService } from '@app/core/tea/tea.service';
import { Tea } from '@app/models';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tea',
  templateUrl: './tea.page.html',
  styleUrls: ['./tea.page.scss'],
})
export class TeaPage implements OnInit {
  teaMatrix$: Observable<Tea[][]> = of([]);

  constructor(
    private auth: AuthenticationService,
    private nav: NavController,
    private sessionVault: SessionVaultService,
    private tea: TeaService
  ) {}

  ngOnInit() {
    this.teaMatrix$ = this.tea.getAll().pipe(map((teas) => this.toMatrix(teas)));
  }

  showDetailsPage(id: number) {
    this.nav.navigateForward(['tabs', 'tea', 'tea-details', id]);
  }

  private toMatrix(tea: Tea[]): Tea[][] {
    const matrix: Tea[][] = [];

    let row: Tea[] = [];
    tea.forEach((t) => {
      row.push(t);
      if (row.length === 4) {
        matrix.push(row);
        row = [];
      }
    });
    if (row.length) {
      matrix.push(row);
    }

    return matrix;
  }
}
