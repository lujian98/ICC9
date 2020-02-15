import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material';
import { IccGridViewComponent } from './grid-view.component';
import { IccEscapeHtmlPipe } from '../../pipes/escape_html.pipe';


describe('IccGridViewComponent', () => {
  let component: IccGridViewComponent<any>;
  let fixture: ComponentFixture<IccGridViewComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IccGridViewComponent, IccEscapeHtmlPipe ],
      imports: [ MatTableModule ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IccGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
