import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TastingNotesService, TeaService } from '@app/core';
import { TastingNote, Tea } from '@app/models';
import { ModalController } from '@ionic/angular';
import { Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-tasting-note-editor',
  templateUrl: './tasting-note-editor.component.html',
  styleUrls: ['./tasting-note-editor.component.scss'],
})
export class TastingNoteEditorComponent implements OnInit {
  @Input()
  note: TastingNote | undefined;

  editorForm = this.fb.group({
    brand: ['', Validators.required],
    name: ['', Validators.required],
    teaCategoryId: new FormControl<number | undefined>(undefined, { validators: [Validators.required] }),
    rating: [0, Validators.required],
    notes: ['', Validators.required],
  });
  buttonLabel: string = '';
  title: string = '';
  teaCategories$: Observable<Array<Tea>> = of([]);

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private tastingNotes: TastingNotesService,
    private tea: TeaService
  ) {}

  close() {
    this.modalController.dismiss();
  }

  async save() {
    const note: TastingNote = {
      brand: this.editorForm.controls.brand.value as string,
      name: this.editorForm.controls.name.value as string,
      teaCategoryId: this.editorForm.controls.teaCategoryId.value as number,
      rating: this.editorForm.controls.rating.value as number,
      notes: this.editorForm.controls.notes.value as string,
    };

    if (this.note?.id) note.id = this.note.id;

    this.tastingNotes
      .save(note)
      .pipe(tap(() => this.modalController.dismiss()))
      .subscribe();
  }

  ngOnInit() {
    this.teaCategories$ = this.tea.getAll();
    if (this.note) {
      this.buttonLabel = 'Update';
      this.title = 'Update Note';
      this.editorForm.controls.brand.setValue(this.note.brand);
      this.editorForm.controls.name.setValue(this.note.name);
      this.editorForm.controls.teaCategoryId.setValue(this.note.teaCategoryId);
      this.editorForm.controls.rating.setValue(this.note.rating);
      this.editorForm.controls.notes.setValue(this.note.notes);
    } else {
      this.buttonLabel = 'Add';
      this.title = 'Add Note';
    }
  }
}
