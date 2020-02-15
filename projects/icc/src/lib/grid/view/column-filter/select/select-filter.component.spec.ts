import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { IccSelectFilterComponent } from './select-filter.component';

describe('IccSelectFilterComponent', () => {
  let component: IccSelectFilterComponent<any>;
  let fixture: ComponentFixture<IccSelectFilterComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccSelectFilterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
