import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { generateSudoku, validateSudoku } from 'sudoku-logic';
import { Sudoku } from './types';

@Injectable({
  providedIn: 'root'
})

export class SudokuService {

  public startingSudoku = generateSudoku();

  private sudoku = new BehaviorSubject<Sudoku>(JSON.parse(JSON.stringify(this.startingSudoku)));

  public isValid = new BehaviorSubject<boolean>(false);

  constructor() {
    this.sudoku.asObservable().subscribe(this.observer)
  }

  public updateCell = (row: number, col: number, inputValue: string) => {
    const updatedSudoku = this.sudoku.value;
    const value = this.convertInputValue(inputValue)
    
    updatedSudoku[row][col] = value;
    
    this.sudoku.next(updatedSudoku);
    console.log(this.sudokuIsFilled(updatedSudoku))
  }

  private convertInputValue = (input: string): (number | undefined) => {
    return input === "" ?
      undefined
      :
      Number(input)
  }

  private observer = {
    next: ( sudoku: Sudoku ) => {
      if (this.sudokuIsFilled(sudoku) && this.checkSudokuValidity(sudoku)) {
        console.log(sudoku)
        this.isValid.next(true)
      }
    }
  }

  private sudokuIsFilled = (sudoku: Sudoku) => sudoku.flat().filter(cell => cell == (undefined || null)).length === 0;

  private checkSudokuValidity = (sudoku: Sudoku) => validateSudoku(sudoku);

}
