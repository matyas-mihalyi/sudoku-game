import { incompleteSudoku } from "../../global-mocks";
import { StorageKey } from "../../types";
import { SudokuService } from "./sudoku.service";
import { LocalStorageService } from "../local-storage/local-storage.service"
import { BehaviorSubject } from "rxjs";

describe("SudokuService", () => {
  let service: SudokuService
  
  let localStorageServiceMock: any;
  let animationServiceMock: any;
  let clueServiceMock: any;

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

    let numberOfCellsToRemove = new BehaviorSubject(40);

    clueServiceMock = {
      removeLessCells: jest.fn(),
      removeMoreCells: jest.fn(),
      cellsToRemoveObservable: numberOfCellsToRemove.asObservable()
    }

    service = new SudokuService(
      animationServiceMock,
      localStorageServiceMock,
      clueServiceMock
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

      it('if no localStorage data is available from a previous sudoku it should set it', () => {
        service.initSudoku();

        const storageKeys: StorageKey[] = ["currentSudoku", "startingSudoku"];

        for (let key of storageKeys) {
          const dataInLocalStorage = localStorage.getItem(key);
          expect(dataInLocalStorage).not.toBe(null);
        }

      });

    });

    describe('createSudokuWithMoreClues', () => {

      it('should call "clueService.removeLessCells"', () => {
        const removeLessCells = jest.spyOn(clueServiceMock, "removeLessCells");
        
        service.createSudokuWithMoreClues();

        expect(removeLessCells).toBeCalled();
      });

      it('should call "createNewSudoku"', () => {
        const createNewSudoku = jest.spyOn(service, "createNewSudoku");
        service.createSudokuWithMoreClues();
        
        expect(createNewSudoku).toBeCalled();
      });
    });
    
    describe('createSudokuWithLessClues', () => {
      it('should call "clueService.removeMoreCells"', () => {
        const removeMoreCells = jest.spyOn(clueServiceMock, "removeMoreCells");
        
        service.createSudokuWithLessClues();

        expect(removeMoreCells).toBeCalled();
      });

      it('should call "createNewSudoku"', () => {
        const createNewSudoku = jest.spyOn(service, "createNewSudoku");
        service.createSudokuWithLessClues();
    
        expect(createNewSudoku).toBeCalled();
      });

    });
    
  });
})