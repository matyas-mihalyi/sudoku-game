import { Component, OnInit, Input } from '@angular/core';
import { SudokuService } from '../sudoku.service';

@Component({
  selector: 'app-sudoku-cell',
  templateUrl: './sudoku-cell.component.html',
  styleUrls: ['./sudoku-cell.component.sass']
})
export class SudokuCellComponent implements OnInit {

  @Input () number: number|undefined = undefined;
  @Input () row!: number;
  @Input () column!: number;

  constructor(
    private gameService: SudokuService
  ) { }

  ngOnInit(): void {
  }

  public handleInput (input: Event) {
    const inputField = (input.target as HTMLInputElement);
    const inputValue = inputField.value;
    const lastInputValue = inputValue[inputValue.length - 1];

    inputField.value = this.convertValue(lastInputValue);

    this.gameService.updateCell(this.row, this.column, inputField.value);
  }
  
  private convertValue = (input: string) => {
    return input === "0" ?
    ""
    :
    input
  }

}
