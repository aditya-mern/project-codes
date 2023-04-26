import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';



@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    // CommonModule,
    
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent },
    ]),
    SharedModule,
  ],
})
export class ShoppingListModule {}
