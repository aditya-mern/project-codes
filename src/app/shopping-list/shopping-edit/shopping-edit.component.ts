import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Ingredients } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('nameInput') nameInputRef: ElementRef;
  // @ViewChild('amountInput') amountInputRef: ElementRef;

  @ViewChild('myForm') shoppingListForm: NgForm;

  mySuscription: Subscription;
  editMode = false;
  indexOfEditedItem: number;
  editedItem: Ingredients;

  constructor(private slService: ShoppingListService) {}

  // onAddItem(){
  //   const ingName = this.nameInputRef.nativeElement.value;
  //   const ingAmount = this.amountInputRef.nativeElement.value;
  //   const newIngredient = new Ingredients(ingName, ingAmount);
  //   this.slService.addIngredient(newIngredient)
  // }

  onAddItem(myForm: NgForm) {
    const value = myForm.value;
    const newIngredient = new Ingredients(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.indexOfEditedItem, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    myForm.reset();
    // this.slService.addIngredient(newIngredient);
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.indexOfEditedItem);
    this.onClear();
  }

  ngOnInit(): void {
    this.mySuscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.indexOfEditedItem = index;
        this.editedItem = this.slService.getIngredient(index);

        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.mySuscription.unsubscribe();
  }
}
