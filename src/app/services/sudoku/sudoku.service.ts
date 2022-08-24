import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { generateSudoku, validateSudoku } from 'sudoku-logic';
import { AnimationService } from '../animation/animation.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AnimationType, Sudoku, Cell } from '../../types';

@Injectable({
  providedIn: 'root'
})

export class SudokuService {

  public numberOfCellsToRemove = 31;
  
  public upperClueLimitReached = new BehaviorSubject<boolean>(false);
  
  public lowerClueLimitReached = new BehaviorSubject<boolean>(false);
  
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
    this.removeLessCells();
    this.animate("moreClues");
    this.createNewSudoku();
  }
  
  public createSudokuWithLessClues () {
    this.removeMoreCells();
    this.animate("lessClues");
    this.createNewSudoku();
  }
  
  constructor(
    private animationService: AnimationService,
    private localStorageService: LocalStorageService
    ) {
      this.sudoku.asObservable().subscribe(this.validityObserver);
    }
    
  private startingSudoku = generateSudoku(this.numberOfCellsToRemove);

  private sudoku = new BehaviorSubject<Sudoku>(JSON.parse(JSON.stringify(this.startingSudoku)));

  private startinSudokuSubject = new BehaviorSubject<Sudoku>(this.startingSudoku);
  
  private maxNumberOfCellsToRemove = 64;

  private minNumberOfCellsToRemove = 1;
  
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
    this.localStorageService.setData("numberOfCellsToRemove", this.numberOfCellsToRemove);
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
    this.numberOfCellsToRemove = this.localStorageService.getNumberOfCellsToRemove() || this.numberOfCellsToRemove;
  }
  
  public createNewSudoku () {
    this.setupNewSudoku();
    this.setNewSudokuInLocalStorage();
  }

  private decrementCellsToRemove () {
    if (this.numberOfCellsToRemove > this.minNumberOfCellsToRemove) {
      this.numberOfCellsToRemove = this.numberOfCellsToRemove - 1;
      this.lowerClueLimitReached.next(false);
    } 
  }

  private incrementCellsToRemove () {
    if (this.numberOfCellsToRemove < this.maxNumberOfCellsToRemove) {
      this.numberOfCellsToRemove = this.numberOfCellsToRemove + 1;
      this.upperClueLimitReached.next(false);
    } 
  }

  private checkUpperLimit () {
    if (this.numberOfCellsToRemove === this.minNumberOfCellsToRemove) {
      this.upperClueLimitReached.next(true);
    }
  }

  private checkLowerLimit () {
    if (this.numberOfCellsToRemove === this.maxNumberOfCellsToRemove) {
      this.lowerClueLimitReached.next(true);
    }
  }
  
  private removeLessCells () {
    this.decrementCellsToRemove();
    this.checkUpperLimit();
  }
  
  private removeMoreCells () {
    this.incrementCellsToRemove();
    this.checkLowerLimit();
  }
  
  private animate = (str: AnimationType) => {
    if (this.numberOfCellsToRemove % 5 === 0) {
      this.animationService.animate(str);
    }
  }
  
  private convertInputValue = (input: string): Cell => input === "" ? null : Number(input);
  
}
