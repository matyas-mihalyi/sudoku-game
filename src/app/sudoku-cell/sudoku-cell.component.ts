import { Component, OnInit, Input } from '@angular/core';
import { SudokuService } from '../sudoku.service';

@Component({
  selector: 'app-sudoku-cell',
  templateUrl: './sudoku-cell.component.html',
  styleUrls: ['./sudoku-cell.component.sass']
})
export class SudokuCellComponent implements OnInit {

  @Input () number: number|undefined = undefined;


  constructor(
    private gameService: SudokuService
  ) { }

  ngOnInit(): void {
  }

  // handle input to RULE THEM ALL!!!!

  // validate input to 1-9

  public updateCellValue (input: Event) {
    const inputField = (input.target as HTMLInputElement);
    const inputValue = inputField.value;
    const lastInputValue = inputValue[inputValue.length - 1];

    if (lastInputValue == "0") {
      inputField.value = ""
    } else {
      inputField.value = lastInputValue
    }

    return Number(inputField.value)
  }

  // update sudoku via sudokuService

}
