import { BehaviorSubject } from 'rxjs';
import { SudokuBoardComponent } from './sudoku-board.component';
import { anotherIncompleteSudoku, incompleteSudoku } from '../global-mocks';
import { QueryList } from '@angular/core';

describe('SudokuBoardComponent', () => {
  let fixture: SudokuBoardComponent;

  let gameServiceMock: any;
  let animationServiceMock: any;
  let navigationServiceMock: any;

  let startingSudokuMock: any;
  let validityMock: any;

  beforeEach(async () => {
    startingSudokuMock = new BehaviorSubject(incompleteSudoku);
    validityMock = new BehaviorSubject(false);

    gameServiceMock = {
      initSudoku: jest.fn(),
      startingSudokuObservable: jest.fn().mockReturnValue(startingSudokuMock.asObservable()),
      validityObservable: jest.fn().mockReturnValue(validityMock.asObservable())
    };

    navigationServiceMock = {
      handleNavigation: jest.fn(),
      updateFocusedCell: jest.fn()
    }

    fixture = new SudokuBoardComponent(
      gameServiceMock,
      animationServiceMock,
      navigationServiceMock
    );
  });

  describe("Setup component", () => {

    describe("ngOnInit", () => {

      it("should call gameService.initSudoku()", () => {
        const initSudoku = jest.spyOn(gameServiceMock, "initSudoku");
        fixture.ngOnInit();

        expect( initSudoku ).toBeCalled();
      });
      
      it("should call gameService.startingSudokuObservable()", ()=> {
        const startingSudokuObservable = jest.spyOn(gameServiceMock, "startingSudokuObservable");
        fixture.ngOnInit();
  
        expect( startingSudokuObservable ).toBeCalled();
      });

      it("should call subscribe on gameService.startingSudokuObservable()", ()=> {
        const subscribe = jest.spyOn(gameServiceMock.startingSudokuObservable(), "subscribe");
        fixture.ngOnInit();
  
        expect( subscribe ).toBeCalled();
      });
      
      it("should copy the starting sudoku to its sudoku property from the observable", () => {
        fixture.ngOnInit();
        
        expect(fixture.sudoku).toBe(incompleteSudoku)
      });

      it("should subscribe to gameService.validityObservable", ()=> {
        const subscribe = jest.spyOn(gameServiceMock.validityObservable(), "subscribe",);
        fixture.ngOnInit();
  
        expect( subscribe ).toBeCalled();
      });

    });

    describe("cells", () => {

      it("should set value for navigationService's 'cells' property when it receives a QueryList", () => {
        const setCells = jest.spyOn(fixture, "cells", "set");

        fixture.cells = new QueryList();

        expect(setCells).toBeCalled();

      })
    
    });
    
  });

  describe("Component methods", () => {

    describe("handleNavigation()", () => {

      it("should call the handleNavigation method on navigationService", () => {
        const handleNavigation = jest.spyOn(navigationServiceMock, "handleNavigation");
        const arg = new KeyboardEvent("keydown");

        fixture.handleNavigation(arg);
        
        expect(handleNavigation).toBeCalledWith(arg);
      });

    });

    describe("updateFocusedCell()", () => {

      it("should call the updateFocusedCell method on navigationService", () => {
        const updateFocusedCell = jest.spyOn(navigationServiceMock, "updateFocusedCell");
        const arg = { row: 0, column: 0};

        fixture.updateFocusedCell(arg);

        expect(updateFocusedCell).toBeCalledWith(arg);
      });

    });

  });

  describe("Component behaviour", () => {

    it("should update 'sudoku' variable if the BehaviourSubject changes", () => {
      fixture.ngOnInit();
      startingSudokuMock.next(anotherIncompleteSudoku);

      expect(fixture.sudoku).toBe(anotherIncompleteSudoku);
    });
    
    test.todo("should set the cells for navigationService if the sudoku variable changes")
  });


});
