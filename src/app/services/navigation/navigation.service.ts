import { Injectable, QueryList } from '@angular/core';
import { SudokuService } from '../sudoku/sudoku.service';
import { ArrayOf9Elements, CellIndices, Direction, Sudoku, Cell } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public cells!: QueryList<any>
  
  public updateFocusedCell (newIndices: CellIndices) {
    this.focusedCellIndices = newIndices;
  }

  public handleNavigation = (e: KeyboardEvent) => {
    if (this.isArrowKey(e)) {
      this.focusNextCell(e, this.focusedCellIndices.row, this.focusedCellIndices.column)
    }
  }

  constructor(
    private gameService: SudokuService
  ) { 
    this.gameService.sudokuObservable().subscribe(val => this.sudoku = val)
  }
  
  private sudoku!: Sudoku;

  private focusedCellIndices: CellIndices = { row: -1, column: -1 };
    
  private isArrowKey (e: KeyboardEvent) {
    const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
    return arrowKeys.some(key => e.key === key);  
  }

  private focusNextCell (event: KeyboardEvent , currentRow:number, currentCol:number) {
    const nextCellIndex = this.findNextCellIndex[event.key as Direction](currentRow, currentCol);
    const nextCell = this.cells.toArray()[nextCellIndex];
    nextCell.applyFocus();
  }

  private findNextCellIndex = {
    "ArrowUp": (currentRow:number, currentCol:number) => this.findCellIndexUp(currentRow, currentCol),
    "ArrowRight": (currentRow:number, currentCol:number) => this.findCellIndexRight(currentRow, currentCol),
    "ArrowDown": (currentRow:number, currentCol:number) => this.findCellIndexDown(currentRow, currentCol),
    "ArrowLeft": (currentRow:number, currentCol:number) => this.findCellIndexLeft(currentRow, currentCol),
  }

  private findCellIndexRight (currentRow: number, currentCol: number): number {
    const nextIndexInRow = this.getNextAvailableIndex(this.sudoku[currentRow], currentCol);
    const nextIndexInSudoku = nextIndexInRow + (currentRow * 9);
    return nextIndexInSudoku; 
  }
  
  private findCellIndexLeft (currentRow: number, currentCol: number): number {
    const previousIndexInRow = this.getPreviousAvailableIndex(this.sudoku[currentRow], currentCol);
    const previousIndexInSudoku = previousIndexInRow + (currentRow * 9);
    return previousIndexInSudoku; 
  }
  
  private findCellIndexDown (currentRow: number, currentCol: number): number {
    const column = this.getColumnFromSudoku(currentCol);
    const nextIndexInColumn = this.getNextAvailableIndex(column, currentRow);
    const nextIndexInSudoku = nextIndexInColumn * 9 + currentCol;
    return nextIndexInSudoku; 
  } 

  private findCellIndexUp (currentRow: number, currentCol: number): number {
    const column = this.getColumnFromSudoku(currentCol);
    const previousIndexInColumn = this.getPreviousAvailableIndex(column, currentRow);
    const previousIndexInSudoku = previousIndexInColumn * 9 + currentCol;
    return previousIndexInSudoku; 
  } 

  private getNextAvailableIndex = (arr: ArrayOf9Elements<Cell>, currentIndex: number): number => {
    return currentIndex + 1 < arr.length ?
    currentIndex + 1
    :
    0
  }
    
  private getPreviousAvailableIndex = (arr: ArrayOf9Elements<Cell>, currentIndex: number): number => {
    return currentIndex - 1 >= 0 ?
    currentIndex - 1
    :
    arr.length - 1
  }
  
  private getColumnFromSudoku = (columnIndex: number) => {
    return this.sudoku.map(row => row[columnIndex]) as ArrayOf9Elements<Cell>;
  }

}
