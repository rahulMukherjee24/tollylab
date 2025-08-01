import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmScrollComponent } from './film-scroll.component';

describe('FilmScrollComponent', () => {
  let component: FilmScrollComponent;
  let fixture: ComponentFixture<FilmScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmScrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
