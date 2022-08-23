import { BehaviorSubject } from 'rxjs';
import { incompleteSudoku } from '../../global-mocks';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let gameServiceMock: any;

  let sudokuSubjectMock;
  
  beforeEach(() => {
    sudokuSubjectMock = new BehaviorSubject(incompleteSudoku);
    
    gameServiceMock = {
      sudokuObservable: jest.fn().mockReturnValue(sudokuSubjectMock.asObservable())
    }

    service = new NavigationService(gameServiceMock);
  });

  describe("constructor", () => {

    it("should call subscribe on gameService.sudokuObservable()", () => {
      const subscribe = jest.spyOn(gameServiceMock.sudokuObservable(), "subscribe");
      service = new NavigationService(gameServiceMock);

      expect(subscribe).toBeCalled();
    });

  });

});
