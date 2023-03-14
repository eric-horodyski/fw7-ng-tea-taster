import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const setInputValue = (input: HTMLIonInputElement, value: string) => {
    const event = new InputEvent('ionInput');
    input.value = value;
    input.dispatchEvent(event);
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the correct title', () => {
    const titles = fixture.debugElement.queryAll(By.css('ion-title'));
    expect(titles.length).toBe(1);
    expect(titles[0].nativeElement.textContent.trim()).toBe('Login');
  });

  describe('email input binding', () => {
    it('updates the component model when the input changes', () => {
      const input = fixture.nativeElement.querySelector('#email-input');
      setInputValue(input, 'test@test.com');
      expect(component.loginForm.controls.email.value).toEqual('test@test.com');
    });

    it('updates the input when the component model changes', () => {
      component.loginForm.controls.email.setValue('testy@mctesterson.com');
      const input = fixture.nativeElement.querySelector('#email-input');
      expect(input.value).toEqual('testy@mctesterson.com');
    });

    it('generates appropriate error messages', () => {
      const input = fixture.nativeElement.querySelector('#email-input');
      expect(component.emailError).toBe('Required');
      setInputValue(input, 'test');
      expect(component.emailError).toBe('Invalid format');
      setInputValue(input, 'test@test.com');
      expect(component.emailError).toBe('Unknown error');
      setInputValue(input, '');
      expect(component.emailError).toBe('Required');
      setInputValue(input, 'test@test.com');
      expect(component.emailError).toBe('Unknown error');
    });
  });

  describe('password input binding', () => {
    it('updates the component model when the input changes', () => {
      const input = fixture.nativeElement.querySelector('#password-input');
      setInputValue(input, 'MyPas$word');
      expect(component.loginForm.controls.password.value).toEqual('MyPas$word');
    });

    it('updates the input when the component model changes', () => {
      component.loginForm.controls.password.setValue('Password123!');
      const input = fixture.nativeElement.querySelector('#password-input');
      expect(input.value).toEqual('Password123!');
    });

    it('generates appropriate error messages', () => {
      const input = fixture.nativeElement.querySelector('#password-input');
      expect(component.passwordError).toBe('Required');
      setInputValue(input, 'Pas$Word');
      expect(component.passwordError).toBe('Unknown error');
      setInputValue(input, '');
      expect(component.passwordError).toBe('Required');
    });
  });

  describe('signin button', () => {
    let button: HTMLIonButtonElement;
    let email: HTMLIonInputElement;
    let password: HTMLIonInputElement;

    beforeEach(() => {
      button = fixture.nativeElement.querySelector('ion-button');
      email = fixture.nativeElement.querySelector('#email-input');
      password = fixture.nativeElement.querySelector('#password-input');
    });

    it('starts disabled', () => {
      expect(button.disabled).toEqual(true);
    });

    it('is disabled with just an email address', () => {
      setInputValue(email, 'test@test.com');
      expect(button.disabled).toEqual(true);
    });

    it('is disabled with just a password', () => {
      setInputValue(password, 'Pas$Word');
      expect(button.disabled).toEqual(true);
    });

    it('is enabled with both an email address and a password', () => {
      setInputValue(email, 'test@test.com');
      setInputValue(password, 'Pas$Word');
      expect(button.disabled).toEqual(false);
    });

    it('is disabled when the email address is not a valid format', () => {
      setInputValue(email, 'test');
      expect(button.disabled).toEqual(true);
    });
  });
});
