import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IccDialogComponent } from './dialog.component';

describe('IccDialogComponent', () => {
  let component: IccDialogComponent;
  let fixture: ComponentFixture<IccDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
