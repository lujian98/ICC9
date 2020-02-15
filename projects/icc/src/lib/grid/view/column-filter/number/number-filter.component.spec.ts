import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { IccNumberFilterComponent } from './number-filter.component';

describe('IccNumberFilterComponent', () => {
  let component: IccNumberFilterComponent<any>;
  let fixture: ComponentFixture<IccNumberFilterComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccNumberFilterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccNumberFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
