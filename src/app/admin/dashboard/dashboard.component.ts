import { Component } from '@angular/core';
import { SharedService } from '../../shared.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userLength: number | undefined; // Correct type annotation
  constructor(public sharedService: SharedService) { }
  ngOnInit() {
    const sessionKey = this.sharedService.getSessionKey(); // Retrieve session key

    if (sessionKey) {
      console.log('Session Key:', sessionKey); // Debug: Print session key to verify

      const headers = new HttpHeaders().set('X-Session-Key', ` ${sessionKey}`);
      this.sharedService.getUserData().subscribe((response: any) => {
        console.log(response); // Handle the response inside the subscribe callback
        this.userLength = response.length; // Assign the response length
      });
    } else {
      console.error('Session key is missing.');
    }
  }

}
