import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SudokuService } from '../sudoku.service';

@Component({
  selector: 'app-sudoku-cell',
  templateUrl: './sudoku-cell.component.html',
  styleUrls: ['./sudoku-cell.component.sass']
})
export class SudokuCellComponent implements OnInit, AfterViewInit {

  @Input () number: number|undefined;
  @Input () row!: number;
  @Input () column!: number;
  @Input () focused: boolean = false;

  @Output () sendIndices = new EventEmitter()

  @ViewChild('cell') cell!: ElementRef;

  constructor(
    private gameService: SudokuService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() : void {
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

  handleNavigation (input: KeyboardEvent) {

  }

  private disableArrowKeyInput = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }   
  }

  public applyFocus = () => this.cell.nativeElement.focus();

  private removeFocus = () => this.cell.nativeElement.blur();


  /* 
  # handleNav
  
  this.removeFocus()

  emitDirection


  # in Parent

  1. receive direction & index
  2. find next index
  3. call method on viewchild
  
  
  
  
  
  */
}
