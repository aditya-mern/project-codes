import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredients } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  // recipeSelected = new EventEmitter<Recipe>();
  recipeSelected = new Subject<Recipe>();

  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe(
    //   'A Rice Recipe(pulao)',
    //   'A Rice recipe Description',
    //   'https://www.kingarthurbaking.com/sites/default/files/styles/featured_image/public/2022-05/Tomato-Pie_0256.jpg',
    //   [
    //     new Ingredients('salt', 1),
    //     new Ingredients('cumin', 20),
    //     new Ingredients('turmeric powder', 4),
    //   ]
    // ),
    // new Recipe(
    //   'A Burger Recipe',
    //   'A burger recipe Description',
    //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiy_VovDTBF4IcHFkCNPuyt3nGKzsXIlPkqnIRl8xu1Q&usqp=CAU&ec=48600112',
    //   [new Ingredients('Buns', 2), new Ingredients('Fries', 22)]
    // ),
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppinglist(ingredients: Ingredients[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

  setRecipeFromHttp(recipe: Recipe[]) {  //data from httpClient
    this.recipes = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }
}
