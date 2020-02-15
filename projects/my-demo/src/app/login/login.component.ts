import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { UsersDataService } from '../school/users/users-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  // protected dataSourceService: UsersDataService;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    protected dataSourceService: UsersDataService,
    ) { }

  ngOnInit() {
    this.createForm();
    this.userLogin('lujian98', '12345678');
  }

  createForm() {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onLogin() {
    // localStorage.setItem('isLoggedin', 'true');
    // console.log('form', this.form.value);
    this.userLogin(this.form.value.email, this.form.value.password);
  }

  private userLogin(username: string, password: string) {
    if (username && password) {
      this.router.navigate(['/school']);
      /*
      this.dataSourceService.onUserLogin(username, password)
      .subscribe(data => {
        if (data) {
          if (data.deviceid) {
            // this.router.navigate(['/school/class-registration'], { queryParams: { deviceid: data.deviceid}});
            this.router.navigate(['/school/icc-base-grid-example'], { queryParams: { deviceid: data.deviceid}});
            //this.router.navigate(['/school/outlets'], { queryParams: { deviceid: data.deviceid}});
          } else {
            this.router.navigate(['/school']);
          }
          // this.router.navigate(['/school']);
        }
      }, (error) => {
      }); */
    }
  }
}

