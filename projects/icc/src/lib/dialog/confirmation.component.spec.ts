import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IccConfirmationComponent } from './confirmation.component';

describe('IccConfirmationComponent', () => {
  let component: IccConfirmationComponent;
  let fixture: ComponentFixture<IccConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
