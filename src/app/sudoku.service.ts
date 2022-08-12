import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { generateSudoku, validateSudoku } from 'sudoku-logic';
import { Sudoku } from './types';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  private startingSudoku = new BehaviorSubject<Sudoku>(generateSudoku());

  private sudoku = this.startingSudoku;

  public isValid = new Observable<boolean>()

  constructor() { 

    this.sudoku.subscribe(board => {
      if (this.isSudokuFilled(board)) {
        this.checkSudokuValidity(board)
      }
    })

  }

  public getSudoku = () => this.sudoku.asObservable();
  
  private updateCell = (row: number, col: number, value: (number | undefined) = undefined) => {
    if (this.notStarterCell(row, col)) {
      const updated = this.sudoku.value;
      updated[row][col] = value;
      this.sudoku.next(updated);
    }
  }

  public passNumberToCell = (num: number, row: number, col: number) => this.updateCell(row, col, num);

  public deleteNumberFromCell = (row: number, col: number) => this.updateCell(row, col);

  private notStarterCell = (row: number, col: number) => this.startingSudoku.value[row][col] === undefined;

  private isSudokuFilled = (sudoku: Sudoku) => sudoku.flat().filter(cell => cell === undefined).length;

  private checkSudokuValidity = (sudoku: Sudoku) => validateSudoku(sudoku);

}
