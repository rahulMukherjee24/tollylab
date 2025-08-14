import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkroomComponent } from './darkroom.component';

describe('DarkroomComponent', () => {
  let component: DarkroomComponent;
  let fixture: ComponentFixture<DarkroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkroomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
