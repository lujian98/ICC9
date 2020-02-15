import { Validators } from '@angular/forms';

export interface IccValidation {
  name: string;
  validator: Validators;
  message: string;
  isAsync?: boolean;
}
