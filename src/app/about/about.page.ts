import { Component } from '@angular/core';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { NavController } from '@ionic/angular';
import { take, tap } from 'rxjs';
import packageInfo from '../../../package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {
  author: string;
  name: string;
  description: string;
  version: string;

  constructor(
    private auth: AuthenticationService,
    private sessionVault: SessionVaultService,
    private nav: NavController
  ) {
    this.author = packageInfo.author;
    this.name = packageInfo.name;
    this.description = packageInfo.description;
    this.version = packageInfo.version;
  }

  logout() {
    return this.auth
      .logout()
      .pipe(
        take(1),
        tap(async () => {
          await this.sessionVault.clear();
          this.nav.navigateRoot(['/', 'login']);
        })
      )
      .subscribe();
  }
}
