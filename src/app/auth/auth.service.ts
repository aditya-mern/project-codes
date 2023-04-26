import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpiryTimer: any;

  // user = new Subject<User>();
  user = new BehaviorSubject<User>(null); //for token of logged in user

  constructor(private httpClient: HttpClient, private router: Router) {}

  signUp(email: String, password: String) {
    return this.httpClient
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB1JgJ53J_-tBU1Ol4SH7erZ3h98bCnLg8',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );

          //   const expirationDate = new Date(
          //     new Date().getTime() + +resData.expiresIn * 1000
          //   );

          //   const user = new User(
          //     resData.email,
          //     resData.localId,
          //     resData.idToken,
          //     expirationDate
          //   );

          //   this.user.next(user);
        })

        // catchError((errRes) => {
        //   let errorMsg = 'default error';

        //   if (!errRes.error || !errRes.error.error) {
        //     return throwError(errorMsg);
        //   }
        //   switch (errRes.error.error.message) {
        //     case 'EMAIL_EXISTS':
        //       errorMsg = 'email exists';
        //   }
        //   return throwError(errorMsg);
        // })
      );
  }

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB1JgJ53J_-tBU1Ol4SH7erZ3h98bCnLg8',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  aoutomaticLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expiryDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.aoutomaticLogout(expiryDuration);
    }
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }
    this.tokenExpiryTimer = null;
  }

  aoutomaticLogout(expiryDuration: number) {
    console.log(expiryDuration);
    this.tokenExpiryTimer = setTimeout(() => {
      this.logOut();
    }, expiryDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    this.aoutomaticLogout(expiresIn * 1000); //passed in milliseconds

    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(responseError: HttpErrorResponse) {
    let errorMsg = 'default error';

    if (!responseError.error || !responseError.error.error) {
      return throwError(errorMsg);
    }
    switch (responseError.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'email exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'email not found';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'password is incorrect';
        break;
    }
    return throwError(errorMsg);
  }
}
