import { AuthenticationService, SessionVaultService } from '@app/core';
import { createAuthenticationServiceMock, createSessionVaultServiceMock } from '@app/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { createNavControllerMock } from '@test/mocks';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginPage } from './login.page';
import { Session } from '@app/models';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const setInputValue = (input: HTMLIonInputElement, value: string) => {
    const event = new InputEvent('ionInput');
    input.value = value;
    input.dispatchEvent(event);
    fixture.detectChanges();
  };

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule, ReactiveFormsModule],
      providers: [
        { provide: AuthenticationService, useFactory: createAuthenticationServiceMock },
        { provide: SessionVaultService, useFactory: createSessionVaultServiceMock },
        { provide: NavController, useFactory: createNavControllerMock },
      ],
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

    describe('on click', () => {
      let auth: AuthenticationService;

      beforeEach(() => {
        auth = TestBed.inject(AuthenticationService);
      });

      it('calls the login', () => {
        setInputValue(email, 'test@test.com');
        setInputValue(password, 'ThisIsMyPa$$W0rd');
        click(button);
        expect(auth.login).toHaveBeenCalledTimes(1);
        expect(auth.login).toHaveBeenCalledWith('test@test.com', 'ThisIsMyPa$$W0rd');
      });

      describe('on success', () => {
        const session: Session = {
          user: { id: 314, firstName: 'Kevin', lastName: 'Malone', email: 'kevin.malone@dundermifflin.com' },
          token: '39948503',
        };

        beforeEach(() => {
          (auth.login as jasmine.Spy).and.returnValue(of(session));
        });

        it('stores the session', () => {
          const sessionVault = TestBed.inject(SessionVaultService);
          setInputValue(email, 'test@test.com');
          setInputValue(password, 'ThisIsMyPa$$W0rd');
          click(button);
          expect(sessionVault.set).toHaveBeenCalledTimes(1);
          expect(sessionVault.set).toHaveBeenCalledWith(session);
        });

        it('navigates to the main page', fakeAsync(() => {
          const nav = TestBed.inject(NavController);
          setInputValue(email, 'test@test.com');
          setInputValue(password, 'ThisIsMyPa$$W0rd');
          click(button);
          tick();
          expect(nav.navigateRoot).toHaveBeenCalledTimes(1);
          expect(nav.navigateRoot).toHaveBeenCalledWith(['/']);
        }));
      });

      //describe('on failure', () => { });
    });
  });
});
