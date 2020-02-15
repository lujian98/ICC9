import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { IccCheckboxFilterComponent } from './checkbox-filter.component';

describe('IccCheckboxFilterComponent', () => {
  let component: IccCheckboxFilterComponent<any>;
  let fixture: ComponentFixture<IccCheckboxFilterComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccCheckboxFilterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccCheckboxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
