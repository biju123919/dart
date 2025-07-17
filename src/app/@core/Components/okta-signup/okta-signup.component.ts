import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';


@Component({
  selector: 'app-okta-signup',
  standalone: false,
  templateUrl: './okta-signup.component.html'
})
export class OktaSignupComponent {
  constructor(
    private authentication : AuthenticationService,
  ){
  }

  ngOnInit(){
    localStorage.setItem('userType', 'new');
  }
  

  onContinueClick(){
    this.authentication.initializeLoginFlow();    
  }
}
