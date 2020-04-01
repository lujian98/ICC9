import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccEscapeHtmlPipe } from '../pipes/escape_html.pipe';
// import { IccLocaleDatePipe } from '../pipes/locale-date.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IccEscapeHtmlPipe,
    // IccLocaleDatePipe,
  ],
  exports: [
    IccEscapeHtmlPipe,
    // IccLocaleDatePipe,
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class IccPipesModule { }
