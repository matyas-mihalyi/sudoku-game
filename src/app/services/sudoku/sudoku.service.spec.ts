import { incompleteSudoku } from "../../global-mocks";
import { StorageKey } from "../../types";
import { SudokuService } from "./sudoku.service";
import { LocalStorageService } from "../local-storage/local-storage.service"

describe("SudokuService", () => {
  let service: SudokuService
  
  let localStorageServiceMock: any;
  let animationServiceMock: any;

  let _localStorageRefService: any;

  beforeEach(() => {
    localStorage.clear();

    _localStorageRefService = {
      localStorage: localStorage,
    }

    localStorageServiceMock = new LocalStorageService(_localStorageRefService);
    animationServiceMock = {
      animate: jest.fn()
    }

    service = new SudokuService(
      animationServiceMock,
      localStorageServiceMock
    );
  }); 
  
  describe("service methods", () => {

    describe("updateCell", () => {
      let sudokuMock: any;

      beforeEach(() => {
        service.sudokuObservable().subscribe(sudoku => sudokuMock = sudoku);  
      });
      
      it('should update the sudoku BehaviorSubject', () => {
        service.updateCell(0, 0, "1");
        expect(sudokuMock[0][0]).toBe(1);
      });
      
      it('should call setData of localStorageService with the new sudoku board', () => {
        const setData = jest.spyOn(localStorageServiceMock, "setData");
        service.updateCell(0, 1, "2");

        expect(setData).toBeCalledWith("currentSudoku", sudokuMock);
      });
    });

    describe("initSudoku", () => {

      it('should update startingSudoku if there is data in localStorage', () => {
        let startingSudokuInService: any;
        service.startingSudokuObservable().subscribe(sudoku => startingSudokuInService = sudoku);

        localStorage.setItem("startingSudoku", JSON.stringify(incompleteSudoku));
        localStorage.setItem("currentSudoku", JSON.stringify(incompleteSudoku));

        service.initSudoku();

        expect(startingSudokuInService).toStrictEqual(incompleteSudoku);
      });

      it('should update the number of cells to remove based on data from localStorage if available', () => {
        const numberOfCellsToRemove = 2;
        
        localStorage.setItem("numberOfCellsToRemove", JSON.stringify(numberOfCellsToRemove));

        service.initSudoku();

        expect(service.numberOfCellsToRemove).toBe(numberOfCellsToRemove);
      });

      it('if no localStorage data is available from a previous sudoku it should set it', () => {
        service.initSudoku();

        const storageKeys: StorageKey[] = ["currentSudoku", "startingSudoku", "numberOfCellsToRemove"];

        for (let key of storageKeys) {
          const dataInLocalStorage = localStorage.getItem(key);
          expect(dataInLocalStorage).not.toBe(null);
        }

      });

    });

    describe('createSudokuWithMoreClues', () => {
      it('should change the "numberOfCellsToRemove" property to one less than before', () => {
        const oldValue = JSON.parse(JSON.stringify(service.numberOfCellsToRemove));
        const expected = oldValue - 1; 
        service.createSudokuWithMoreClues();

        expect(service.numberOfCellsToRemove).toBe(expected);
      });
      
      it('it should set the new value for "numberOfCellsToRemove" in localStorage', () => {
        const oldValue = JSON.parse(JSON.stringify(service.numberOfCellsToRemove));
        const expected = oldValue - 1;

        service.createSudokuWithMoreClues();

        const dataInLocalStorage = JSON.parse(localStorage.getItem("numberOfCellsToRemove")!);
  
        expect(dataInLocalStorage).toBe(expected);
      });

      it('should not change the value of "numberOfCellsToRemove" to less than 1', () => {
        localStorage.setItem("numberOfCellsToRemove", "1");
        service.initSudoku();

        service.createSudokuWithMoreClues();

        expect(service.numberOfCellsToRemove).toBe(1);

      });

      it('should call "createNewSudoku"', () => {
        const createNewSudoku = jest.spyOn(service, "createNewSudoku");
        service.createSudokuWithMoreClues();
        
        expect(createNewSudoku).toBeCalled();
      });
    });
    
    describe('createSudokuWithLessClues', () => {
      it('should change the "numberOfCellsToRemove" property to one less than before', () => {
        const oldValue = JSON.parse(JSON.stringify(service.numberOfCellsToRemove));
        const expected = oldValue + 1; 
        service.createSudokuWithLessClues();
        
        expect(service.numberOfCellsToRemove).toBe(expected);
      });
      
      it('it should set the new value for "numberOfCellsToRemove" in localStorage', () => {
        const oldValue = JSON.parse(JSON.stringify(service.numberOfCellsToRemove));
        const expected = oldValue + 1;
        
        service.createSudokuWithLessClues();
        
        const dataInLocalStorage = JSON.parse(localStorage.getItem("numberOfCellsToRemove")!);
        
        expect(dataInLocalStorage).toBe(expected);
      });
      
      it('should not change the value of "numberOfCellsToRemove" to more than 64', () => {
        localStorage.setItem("numberOfCellsToRemove", "64");
        service.initSudoku();
        
        service.createSudokuWithLessClues();
        
        expect(service.numberOfCellsToRemove).toBe(64);
        
      });

      it('should call "createNewSudoku"', () => {
        const createNewSudoku = jest.spyOn(service, "createNewSudoku");
        service.createSudokuWithLessClues();
    
        expect(createNewSudoku).toBeCalled();
      });

    });
    
  });
})