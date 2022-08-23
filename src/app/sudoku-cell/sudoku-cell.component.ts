import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { SudokuService } from '../services/sudoku.service';
import { Sudoku } from '../types';

@Component({
  selector: 'app-sudoku-cell',
  templateUrl: './sudoku-cell.component.html',
  styleUrls: ['./sudoku-cell.component.sass']
})
export class SudokuCellComponent implements OnInit {

  @Input () number: number|null = null;
  @Input () row!: number;
  @Input () column!: number;

  @Output () sendIndices = new EventEmitter()

  @ViewChild('cell') cell!: ElementRef;

  public disableArrowKeyInput = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }   
  }

  public applyFocus = () => this.cell.nativeElement.focus();

  public disableCell = () => this.cell.nativeElement.disabled = true;

  public handleInput = (value: string) => {
    const lastInputValue = value[value.length - 1];
    this.cell.nativeElement.value = this.convertInputValue(lastInputValue) || "";

    this.gameService.updateCell(this.row, this.column, this.cell.nativeElement.value);
  }

  constructor(
    private gameService: SudokuService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.localStorageService.currentSudoku.subscribe(sudoku => {
      this.setValueFromLocalStorage(sudoku)
    })
  }

  private convertInputValue = (input: string) => {
    return input === "0" ?
    ""
    :
    input
  }

  private setValue (value: number) {
    this.cell.nativeElement.value = value;
  }

  private setValueFromLocalStorage = (sudoku: Sudoku) => {
    if (sudoku && sudoku[this.row][this.column] !== null && sudoku[this.row][this.column] !== undefined) {
      setTimeout(()=> this.setValue(sudoku[this.row][this.column] as number)); 
    }
  }
  
}
