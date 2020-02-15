import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IccBaseGridComponent } from './grid.component';

describe('IccBaseGridComponent', () => {
  let component: IccBaseGridComponent<any>;
  let fixture: ComponentFixture<IccBaseGridComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccBaseGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccBaseGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
