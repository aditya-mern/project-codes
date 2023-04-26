import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  private userSubscription: Subscription;
  isAthenticated = false;

  // @Output() featureSelected = new EventEmitter<string>()

  // onSelect(feature: string){
  //     this.featureSelected.emit(feature)
  // }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe((user) => {
      // this.isAthenticated = !user ? false : true;
      this.isAthenticated = !!user;

    });
  }

  constructor(
    private dataServiceStorage: DataStorageService,
    private authService: AuthService
  ) {}

  onSaveData() {
    this.dataServiceStorage.storeRecipe();
  }

  onClickFetch() {
    this.dataServiceStorage.fetchingData().subscribe();
  }

  onlogOut(){
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
