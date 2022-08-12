import { TestBed } from '@angular/core/testing';
import { generateSudoku } from 'sudoku-logic';

import { SudokuService } from './sudoku.service';

describe('SudokuService', () => {
  let service: SudokuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ['generateSudoku']
    });
    service = TestBed.inject(SudokuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  describe('Updating sudoku', () => {
    it('should update sudoku', () => {
      const expected = service.getSudoku().subscribe();
    });

    it('should update sudoku only if field is undefined', () => {
  
    })

  })
});
