import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { SudokuService } from '../sudoku.service';

@Component({
  selector: 'app-sudoku-cell',
  templateUrl: './sudoku-cell.component.html',
  styleUrls: ['./sudoku-cell.component.sass']
})
export class SudokuCellComponent implements OnInit, AfterViewInit {

  @Input () row!: number;
  @Input () column!: number;
  @Input () focused: boolean = false;

  @ViewChild('cell',  {read: ElementRef}) cell: ElementRef|undefined

  // cell!: ElementRef;

  constructor(
    private gameService: SudokuService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() : void {
    console.log(this.cell)
  }

  public handleInput = (input: Event) => {
    const inputField = (input.target as HTMLInputElement);
    const inputValue = inputField.value;
    const lastInputValue = inputValue[inputValue.length - 1];

    inputField.value = this.convertValue(lastInputValue) || "";

    this.gameService.updateCell(this.row, this.column, inputField.value);
  }
  
  private convertValue = (input: string) => {
    return input === "0" ?
    ""
    :
    input
  }

  private disableArrowKeyInput = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }   
  }

  private applyFocus = () => {
    
  }

}
