import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuCellComponent } from './sudoku-cell.component';

describe('SudokuCellComponent', () => {
  let component: SudokuCellComponent;
  let fixture: ComponentFixture<SudokuCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SudokuCellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SudokuCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
