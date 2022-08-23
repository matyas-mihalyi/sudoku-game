import { AnimationService } from './animation.service';
import { assets } from './animation-assets';

describe('AnimationService', () => {
  let service: AnimationService;

  beforeEach(() => {
    service = new AnimationService();
  });

  describe("Service methods", () => {

    describe("getImage", () => {

      it('should return an observable image object with "src" and "alt" keys', () => {
        let img;
        service.getImage().subscribe(imgObj => img = imgObj);

        expect(img).toHaveProperty("src");
        expect(img).toHaveProperty("alt");
      });
      
    });
    
    describe('getState', () => {
      
      it('should return an observable boolean value', () => {
        let isAnimated;
        service.getState().subscribe(state => isAnimated = state);
        
        expect(typeof isAnimated === 'boolean').toBeTruthy();
      });
      
      it('should return "true", while there is an ongoing animation', () => {
        let isAnimated;
        service.getState().subscribe(state => isAnimated = state);
        service.animate("finished");
        
        expect(isAnimated).toBeTruthy();
      });
      
      it('should return "false", when the animation ends', () => {
        let isAnimated: boolean;
        service.getState().subscribe(state => isAnimated = state);
        service.animate("finished");
        
        setTimeout(()=> expect(isAnimated).toBeFalsy(), 3000);
      });
      
    });
    
    describe("animate", () => {
      
      it('should set the image properties based on its argument', () => {
        const animation = "finished";
        let img;
        service.getImage().subscribe(imgObj => img = imgObj);
        service.animate(animation);
        
        expect(img).toHaveProperty("src", assets[animation]());
        expect(img).toHaveProperty("alt", assets[animation]());
      });
      
      it('should set isAnimated to true', () => {
        let isAnimated;
        service.getState().subscribe(state => isAnimated = state);
        service.animate("moreClues");
        
        expect(isAnimated).toBeTruthy();
      });

      it('should set isAnimated to false after 3000 ms', () => {
        let isAnimated: boolean;
        service.getState().subscribe(state => isAnimated = state);
        service.animate("lessClues");
        
        setTimeout(() => expect(isAnimated).toBeTruthy(), 3000)
      });
          
    });
  
  });
  
});
