import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TeaService } from '@app/core/tea/tea.service';
import { createTeaServiceMock } from '@app/core/testing';
import { IonicModule } from '@ionic/angular';
import { createActivatedRouteMock } from '@test/mocks';
import { of } from 'rxjs';

import { TeaDetailsPage } from './tea-details.page';

describe('TeaDetailsPage', () => {
  let component: TeaDetailsPage;
  let fixture: ComponentFixture<TeaDetailsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeaDetailsPage],
      imports: [IonicModule],
      providers: [
        { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
        { provide: TeaService, useFactory: createTeaServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeaDetailsPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    beforeEach(() => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as any).withArgs('id').and.returnValue('7');
      const tea = TestBed.inject(TeaService);
      (tea.get as jasmine.Spy).and.returnValue(
        of({
          id: 7,
          name: 'White',
          description: 'Often looks like frosty silver pine needles',
          image: 'imgs/white.png',
        })
      );
    });

    it('binds the name', () => {
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('[data-testid="name"]'));
      expect(el.nativeElement.textContent.trim()).toBe('White');
    });

    it('binds the description', () => {
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('[data-testid="description"]'));
      expect(el.nativeElement.textContent.trim()).toBe('Often looks like frosty silver pine needles');
    });
  });
});
