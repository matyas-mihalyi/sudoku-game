import { BehaviorSubject, Observable } from "rxjs";
import { AnimatedBackgroundMemeComponent } from "./animated-background-meme.component";

describe("AnimatedBackgroundMeme component", () => {
  let fixture: AnimatedBackgroundMemeComponent;

  let animationServiceMock: any;

  const mockImg = new BehaviorSubject({
    src: "img src",
    alt: "img alt"
  })

  const mockState = new BehaviorSubject(false);

  beforeEach(() => {
    animationServiceMock = {
      getImage: jest.fn().mockReturnValue(mockImg.asObservable()),
      getState: jest.fn().mockReturnValue(mockState.asObservable())
    }

    fixture = new AnimatedBackgroundMemeComponent(animationServiceMock);
  });

  describe("Component setup", () => {

    describe('ngOnInit', () => { 

      it("should call subscribe on animationService's getImage property", () => {
        const subscribe = jest.spyOn(animationServiceMock.getImage(), "subscribe");

        fixture.ngOnInit();

        expect(subscribe).toBeCalled();
      });
      
      it("should assign its imgSrc property based on animationService's getImage observable", () => {
        fixture.ngOnInit();
        
        expect(fixture.imgSrc).toBe(mockImg.value.src);
      });
      
      it("should assign its imgAlt property based on animationService's getImage observable", () => {
        fixture.ngOnInit();
        
        expect(fixture.imgAlt).toBe(mockImg.value.alt);
      });
      
      it("should call subscribe on animationService's getState property", () => {
        const subscribe = jest.spyOn(animationServiceMock.getState(), "subscribe");
        
        fixture.ngOnInit();
        
        expect(subscribe).toBeCalled();
      });
      
      it("should assign its isAnimated property a boolean value based on animationService's getState observable", () => {
        fixture.ngOnInit();
        
        expect(fixture.isAnimated).toBe(mockState.value);
      });

    });
  });
  
  describe("Component behaviour", () => {
    
    describe("Component class variables", () => {
      
      it("should update its imgSrc property based on animationService's getImage observable", () => {
        fixture.ngOnInit();

        mockImg.next({src: "new src", alt: "new alt"})
        
        expect(fixture.imgSrc).toBe(mockImg.value.src);
      });

      it("should update its imgAlt property based on animationService's getImage observable", () => {
        fixture.ngOnInit();
    
        mockImg.next({src: "new src", alt: "new alt"})
        
        expect(fixture.imgAlt).toBe(mockImg.value.alt);
      });
      
      it("should update its isAnimated property based on animationService's getState observable", () => {
        fixture.ngOnInit();
    
        mockState.next(true)
        
        expect(fixture.isAnimated).toBe(mockState.value);
      });
    
    });

  });

});