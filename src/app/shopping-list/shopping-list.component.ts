import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredients } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredients[];

  mySubscription: Subscription;
  


  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.mySubscription = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredients[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe();
  }

  onEditItem(index: number){
    this.slService.startedEditing.next(index);
  }
}
