import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmScrollAdminComponent } from './film-scroll-admin.component';

describe('FilmScrollAdminComponent', () => {
  let component: FilmScrollAdminComponent;
  let fixture: ComponentFixture<FilmScrollAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmScrollAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmScrollAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
