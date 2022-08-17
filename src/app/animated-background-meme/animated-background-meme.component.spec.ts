import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedBackgroundMemeComponent } from './animated-background-meme.component';

describe('AnimatedBackgroundMemeComponent', () => {
  let component: AnimatedBackgroundMemeComponent;
  let fixture: ComponentFixture<AnimatedBackgroundMemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedBackgroundMemeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedBackgroundMemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
