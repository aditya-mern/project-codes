import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredients } from '../shared/ingredient.model';

@Injectable()
export class ShoppingListService {
  // ingredientsChanged = new EventEmitter<Ingredients[]>();
  ingredientsChanged = new Subject<Ingredients[]>();

  startedEditing = new Subject<number>();

  private ingredients: Ingredients[] = [
    new Ingredients('Ingredient 1', 5),
    new Ingredients('Ingredient 2', 10),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredients) {
    this.ingredients.push(ingredient);
    // this.ingredientsChanged.emit(this.ingredients.slice())
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredients[]) {
    this.ingredients.push(...ingredients);
    // this.ingredientsChanged.emit(this.ingredients.slice())
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredients) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);    //splice
    this.ingredientsChanged.next(this.ingredients.slice());  //slice
  }
}
