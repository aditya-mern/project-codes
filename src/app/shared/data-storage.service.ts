import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private httpClient: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipe() {
    const recipes = this.recipeService.getRecipes();

    return this.httpClient
      .put(
        'https://database-recipe-32eea-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((dataRecieved) => {
        console.log(dataRecieved);
      });
  }

  fetchingData1() {
    // this.authService.user.pipe(take(1)).subscribe((user) => {});

    //return is used to return as a whole new observer & exhaustMap replaces the old with new observer
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.httpClient.get<Recipe[]>(
          'https://database-recipe-32eea-default-rtdb.firebaseio.com/recipes.json',
          {
            params: new HttpParams().set('auth', user.token),
          }
        );
      }),
      map((recipes) => {
        return recipes.map((eachRecipe) => {
          return {
            ...eachRecipe,
            ingerdients: eachRecipe.ingredients ? eachRecipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipeFromHttp(recipes);
      })
    );

    // .pipe(
    //   map((recipes) => {
    //     return recipes.map((eachRecipe) => {
    //       return {
    //         ...eachRecipe,
    //         ingerdients: eachRecipe.ingredients ? eachRecipe.ingredients : [],
    //       };
    //     });
    //   }),
    //   tap((recipes) => {
    //     this.recipeService.setRecipeFromHttp(recipes);
    //   })
    // );
    //#############################################################
    //   .subscribe((recipes) => {
    //     console.log(recipes);
    //     this.recipeService.setRecipeFromHttp(recipes);
    //   });
  }

  
//###########################################################################


  fetchingData() {
    return this.httpClient
      .get<Recipe[]>(
        'https://database-recipe-32eea-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((eachRecipe) => {
            return {
              ...eachRecipe,
              ingerdients: eachRecipe.ingredients ? eachRecipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipeFromHttp(recipes);
        })
      );
  }
}
