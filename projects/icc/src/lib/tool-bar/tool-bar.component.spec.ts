import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IccToolBarComponent } from './tool-bar.component';

describe('ToolBarComponent', () => {
  let component: IccToolBarComponent;
  let fixture: ComponentFixture<IccToolBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccToolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
