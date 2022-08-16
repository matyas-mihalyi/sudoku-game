import { Component, OnInit, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { SudokuService } from '../sudoku.service';
import { ArrayOf9Elements, direction, Sudoku } from '../types';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.sass']
})
export class SudokuBoardComponent implements OnInit, AfterViewInit {

  public sudoku = this.gameService.startingSudoku;

  @ViewChildren("children") children!: QueryList<any>

  constructor(
    private gameService : SudokuService
  ) { 
  }
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const index = this.findCellIndexUp(5, 4);
    console.log(this.children.toArray()[index])
    this.children.toArray()[index].applyFocus()
  }


  // receive row and column index -> find next element
  focusNextCell (event: KeyboardEvent , currentRow:number, currentCol:number) {
    const nextCellIndex = this.findNextCellIndex[event.key as direction](currentRow, currentCol);
    const nextCell = this.children.toArray()[nextCellIndex];
    nextCell.applyFocus();
  }

  findNextCellIndex = {
    "ArrowUp": (currentRow:number, currentCol:number) => this.findCellIndexUp(currentRow, currentCol),
    "ArrowRight": (currentRow:number, currentCol:number) => this.findCellIndexRight(currentRow, currentCol),
    "ArrowDown": (currentRow:number, currentCol:number) => this.findCellIndexDown(currentRow, currentCol),
    "ArrowLeft": (currentRow:number, currentCol:number) => this.findCellIndexLeft(currentRow, currentCol),
  }

  findCellIndexRight (currentRow: number, currentCol: number): number {
    const availableIndicesInRow = this.getAvailableIndices(this.sudoku[currentRow]);
    const nextIndexInRow = this.getNextAvailableIndex(availableIndicesInRow, currentCol);
    const nextIndexInSudoku = nextIndexInRow + (currentRow * 9);
    return nextIndexInSudoku; 
  }
  
  findCellIndexLeft (currentRow: number, currentCol: number): number {
    const availableIndicesInRow = this.getAvailableIndices(this.sudoku[currentRow]);
    const previousIndexInRow = this.getPreviousAvailableIndex(availableIndicesInRow, currentCol);
    const previousIndexInSudoku = previousIndexInRow + (currentRow * 9);
    return previousIndexInSudoku; 
  }
  
  findCellIndexDown (currentRow: number, currentCol: number): number {
    const column = this.getColumnFromSudoku(currentCol);
    const availableIndicesInColumn = this.getAvailableIndices(column);
    const nextIndexInColumn = this.getNextAvailableIndex(availableIndicesInColumn, currentRow);
    const nextIndexInSudoku = nextIndexInColumn * 9 + currentCol;
    return nextIndexInSudoku; 
  } 

  findCellIndexUp (currentRow: number, currentCol: number): number {
    const column = this.getColumnFromSudoku(currentCol);
    const availableIndicesInColumn = this.getAvailableIndices(column);
    const previousIndexInColumn = this.getPreviousAvailableIndex(availableIndicesInColumn, currentRow);
    const previousIndexInSudoku = previousIndexInColumn * 9 + currentCol;
    return previousIndexInSudoku; 
  } 
  
  getAvailableIndices(arr: ArrayOf9Elements<number|undefined>): number[] {
    return arr.reduce((acc: number[], current, i) => {
      if (current === undefined) {
        acc.push(i);
      }
      return acc
    }, []);
  }

  getNextAvailableIndex = (arr: number[], currentIndex: number): number => {
    const nextElementInArray = arr.find(index => index > currentIndex) || arr[0];
    return nextElementInArray;
  }
    
  getPreviousAvailableIndex = (arr: number[], currentIndex: number): number => {
    const previousIndexInArray = arr.indexOf(currentIndex) - 1 >= 0 ? arr.indexOf(currentIndex) - 1 : arr.length -1;
    console.log("arr.indexOf(currentIndex)", arr.indexOf(currentIndex));
    const previousElementInArray = arr[previousIndexInArray]; 
    return previousElementInArray;
  }
  
  getColumnFromSudoku = (columnIndex: number) => {
    return this.sudoku.map(row => row[columnIndex]) as ArrayOf9Elements<number|undefined>;
  }

}
