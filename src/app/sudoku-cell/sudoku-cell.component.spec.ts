import { SudokuCellComponent } from './sudoku-cell.component';
import { BehaviorSubject } from 'rxjs';

import { incompleteSudoku } from '../global-mocks';
import { ElementRef } from '@angular/core';

const numberInputElement = () => {
  const element = document.createElement("input");
  element.type = "number";
  return element;
}

describe('SudokuCellComponent', () => {
  let fixture: SudokuCellComponent;
  let gameServiceMock: any;
  let localStorageServiceMock: any;


  beforeEach(() => {
    localStorageServiceMock = {
      currentSudoku: new BehaviorSubject(incompleteSudoku)
    }

    gameServiceMock = {
      updateCell: jest.fn()
    }

    fixture = new SudokuCellComponent(
      gameServiceMock,
      localStorageServiceMock
    )

  });
  
  describe("Setup component", () => {

    describe("ngOnInit", () => {
      
      it("should call subscribe on localStorageService.currentSudoku", ()=> {
        const subscribe = jest.spyOn(localStorageServiceMock.currentSudoku, "subscribe");
        fixture.ngOnInit();
        
        expect(subscribe).toBeCalled();
      })
    });

    describe("ViewChild", () => {
      
      test.todo("should have a reference for itself under the 'cell' property");
      
    });
    
  });
  
  describe("Component methods", () => {

    describe ("disableArrowKeyInput", () => {
      
      const keyboardEvent = (key: string) => new KeyboardEvent("keydown", {key: key});
      
      it("should call preventDefault() on the Keyboard Event if its key is 'ArrowUp'", () => {
        const event = keyboardEvent('ArrowUp')
        const preventDefault = jest.spyOn(event, "preventDefault");
        
        fixture.disableArrowKeyInput(event);

        expect(preventDefault).toBeCalled();
      });
      
      it("should call preventDefault() on the Keyboard Event if its key is 'ArrowDown'", () => {
        const event = keyboardEvent('ArrowDown')
        const preventDefault = jest.spyOn(event, "preventDefault");
        
        fixture.disableArrowKeyInput(event);
        
        expect(preventDefault).toBeCalled();
      });
      
      it("should not call preventDefault() on the Keyboard Event if its key is not 'ArrowUp' or 'ArrowDown'", ()=> {
        const event = keyboardEvent('ArrowLeft')
        const preventDefault = jest.spyOn(event, "preventDefault");
        
        fixture.disableArrowKeyInput(event);
        
        expect(preventDefault).not.toBeCalled();
      });
    
    });
    
    describe("applyFocus", () => {
      
      it("should call focus on the ElementRef", ()=> {
        fixture.cell = new ElementRef(numberInputElement());
        const focus = jest.spyOn(fixture.cell.nativeElement, "focus");
        
        fixture.applyFocus();

        expect(focus).toBeCalled();
      });

      test.todo("the input element should be focused");

    });
    
    describe("disableCell", () => {

      it("should set disabled to 'true' on the ElementRef", ()=> {
        fixture.cell = new ElementRef(numberInputElement());
        
        fixture.disableCell();
        
        expect(fixture.cell.nativeElement.disabled).toBe(true);
      });
      
    });
    
    describe("handleInput", () => {

      beforeEach(() => {
        fixture.cell = new ElementRef(numberInputElement());
      });
      
      it("should set value to input if the input has no value", () => {
        const data = "1";
        fixture.handleInput(data);

        expect(fixture.cell.nativeElement.value).toBe(data);
      });
      
      it("should set value to input if input already has a value", () => {
        fixture.cell.nativeElement.value = "2";
        const data = "1";
        fixture.handleInput(data);
  
        expect(fixture.cell.nativeElement.value).toBe(data);
        
      });
      
      it("should not set value that is longer than 1 character", () => {
        const data = "10994";
        const lastCharOfData = data[data.length - 1]
        fixture.handleInput(data);

        
        expect(fixture.cell.nativeElement.value.length).toBe(1);
        expect(fixture.cell.nativeElement.value).toBe(lastCharOfData);
      });
      
      test.todo("should not set value if it's not between 1 and 9")
      
      it("should call gameService.updateCell", () => {
        fixture.row = 0;
        fixture.column = 0;

        const updateCell = jest.spyOn(gameServiceMock, "updateCell");
        const data = "1";
        fixture.handleInput(data);
  
        expect(updateCell).toBeCalledWith(fixture.row, fixture.column, data);

      })
      
    })
  
  })

});
