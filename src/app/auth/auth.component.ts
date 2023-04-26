import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isloading = false;
  error: string = null;

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  swithMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObservable: Observable<AuthResponseData>;

    this.isloading = true;
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);

      //   this.authService.signUp(email, password).subscribe(
      //     (responseData) => {
      //       console.log(responseData);
      //       this.isloading = false;
      //     },
      // (errorResponse) => {
      //   this.isloading = false;
      //   switch(errorResponse.error.error.message){
      //     case 'EMAIL_EXISTS':
      //         this.error = "email exists"
      //   }

      //   console.log(errorResponse);
      // }

      //     (errorMsg) => {
      //       this.isloading = false;

      //       this.error = errorMsg;
      //       console.log(errorMsg);
      //     }
      //   );
    }

    authObservable.subscribe(
      (responseData) => {
        console.log(responseData);
        this.isloading = false;
        this.error = null;
        this.router.navigate(['/recipes']);
      },
      (errorMsg) => {
        this.isloading = false;

        this.error = errorMsg;
        console.log(errorMsg);

        this.showAlert(errorMsg);
      }
    );

    console.log(form);
    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showAlert(errorMsg: string) {
    // const newAlertComponent = new AlertComponent();
    const newAlertComponent =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const newHostRef = this.alertHost.viewContainerRef;
    newHostRef.clear();

    const cmtRef = newHostRef.createComponent(newAlertComponent);

    cmtRef.instance.message = errorMsg;

    // we can sunscribe here even the eventEmmitter is used(exception case)
    this.closeSub = cmtRef.instance.exit.subscribe(() => {
      this.closeSub.unsubscribe();
      newHostRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
