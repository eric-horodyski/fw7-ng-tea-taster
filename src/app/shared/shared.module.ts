import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [RatingComponent],
  exports: [RatingComponent],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SharedModule {}
