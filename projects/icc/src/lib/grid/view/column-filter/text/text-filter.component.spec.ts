import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { IccTextFilterComponent } from './text-filter.component';

describe('IccTextFilterComponent', () => {
  let component: IccTextFilterComponent<any>;
  let fixture: ComponentFixture<IccTextFilterComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccTextFilterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccTextFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
