import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { generateSudoku, validateSudoku } from 'sudoku-logic';
import { AnimationService } from '../animation/animation.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AnimationType, Sudoku, Cell } from '../../types';
import { ClueService } from '../clue/clue.service';

@Injectable({
  providedIn: 'root'
})

export class SudokuService {

  
  public validityObservable = () => this.isValid.asObservable()
  
  public startingSudokuObservable = () => this.startinSudokuSubject.asObservable();
  
  public sudokuObservable = () => this.sudoku.asObservable();
  
  public updateCell = (row: number, col: number, inputValue: string) => {
    const updatedSudoku = this.sudoku.value;
    const value = this.convertInputValue(inputValue)
    updatedSudoku[row][col] = value;    
    
    this.sudoku.next(updatedSudoku);
    this.localStorageService.setData("currentSudoku", updatedSudoku);
  }
  
  public initSudoku = () => {
    if (this.localStorageService.sudokuDataIsAvailable()) {
      this.setupSudokuFromLocalStroage();
    } else {
      this.numberOfCellsToRemove = this.localStorageService.getNumberOfCellsToRemove() || this.numberOfCellsToRemove;
      this.createNewSudoku();
    }
  }
  
  public createSudokuWithMoreClues () {
    this.clueService.removeLessCells();
    this.animate("moreClues");
    this.createNewSudoku();
  }
  
  public createSudokuWithLessClues () {
    this.clueService.removeMoreCells();
    this.animate("lessClues");
    this.createNewSudoku();
  }
  
  constructor(
    private animationService: AnimationService,
    private localStorageService: LocalStorageService,
    private clueService: ClueService
    ) {
      this.sudoku.asObservable().subscribe(this.validityObserver);
      this.clueService.cellsToRemoveObservable.subscribe(val => this.numberOfCellsToRemove = val);
    }
    
    private numberOfCellsToRemove = 31;

    private startingSudoku = generateSudoku(this.numberOfCellsToRemove);
    
    private sudoku = new BehaviorSubject<Sudoku>(JSON.parse(JSON.stringify(this.startingSudoku)));
    
    private startinSudokuSubject = new BehaviorSubject<Sudoku>(this.startingSudoku);
    
  private isValid = new BehaviorSubject<boolean>(false);
  
  private validityObserver = {
    next: ( sudoku: Sudoku ) => {
      if (this.sudokuIsFilled(sudoku) && this.checkSudokuValidity(sudoku)) {
        this.handleValidSudoku();
      }
    }
  }
  
  private sudokuIsFilled = (sudoku: Sudoku) => sudoku.flat().filter(cell => cell == (undefined || null)).length === 0;
  
  private checkSudokuValidity = (sudoku: Sudoku) => validateSudoku(sudoku);
  
  private handleValidSudoku = () => {
    this.localStorageService.clearData("currentSudoku");
    this.localStorageService.clearData("startingSudoku");
    this.isValid.next(true);
  }

  private setNewSudokuInLocalStorage () {
    this.localStorageService.setData("startingSudoku", this.startingSudoku);
    this.localStorageService.setData("currentSudoku", this.startingSudoku);
  }
  
  private setupNewSudoku () {
    this.startingSudoku = generateSudoku(this.numberOfCellsToRemove);
    this.startinSudokuSubject.next(this.startingSudoku);
    this.sudoku.next(JSON.parse(JSON.stringify(this.startingSudoku)));
    this.isValid.next(false);
  }
  
  private setupSudokuFromLocalStroage () {
    this.startingSudoku = this.localStorageService.getStartingSudoku()!;
    this.startinSudokuSubject.next(this.localStorageService.getStartingSudoku()!);
    this.sudoku.next(this.localStorageService.getCurrentSudoku()!);
  }
  
  public createNewSudoku () {
    this.setupNewSudoku();
    this.setNewSudokuInLocalStorage();
  }
  
  private animate = (str: AnimationType) => {
    if (this.numberOfCellsToRemove % 5 === 0) {
      this.animationService.animate(str);
    }
  }
  
  private convertInputValue = (input: string): Cell => input === "" ? null : Number(input);
  
}
