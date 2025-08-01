import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameCounterComponent } from './frame-counter.component';

describe('FrameCounterComponent', () => {
  let component: FrameCounterComponent;
  let fixture: ComponentFixture<FrameCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrameCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
