import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';

@Component({
  selector: 'app-sudoku-cell',
  templateUrl: './sudoku-cell.component.html',
  styleUrls: ['./sudoku-cell.component.sass']
})
export class SudokuCellComponent implements OnInit {

  @Input () number: number|undefined;
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

  public handleInput = (input: Event) => {
    const inputField = (input.target as HTMLInputElement);
    const inputValue = inputField.value;
    const lastInputValue = inputValue[inputValue.length - 1];

    inputField.value = this.convertInputValue(lastInputValue) || "";

    this.gameService.updateCell(this.row, this.column, inputField.value);
  }

  constructor(
    private gameService: SudokuService
  ) { }

  ngOnInit(): void {
  }

  private convertInputValue = (input: string) => {
    return input === "0" ?
    ""
    :
    input
  }
  
}
