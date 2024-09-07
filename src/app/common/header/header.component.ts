import { Component } from '@angular/core';
import { ObservablesService } from '../../observables.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
constructor( public Observable:ObservablesService, public sharedService : SharedService){}
userLoginDetails : any =[];
  selectedOption: string | null = null;
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: { value: number; label: string }) {
    this.selectedOption = option.label;
    this.isDropdownOpen = false;
    console.log('Selected value:', option.value);
  }

  // Close the dropdown if clicking outside of it
  ngOnInit() {
    document.addEventListener('click', (event) => {
      if (!(event.target as HTMLElement).closest('.dropdown')) {
        this.isDropdownOpen = false;
      }
    });

    this.Observable.loginDetailsPathIndex$.subscribe((Response)=>{
      console.log(Response,"login details")
      this.userLoginDetails = Response
    })
  }
  logout(){
    this.sharedService.Logout(FormData).subscribe((Response)=>{

    })
  }
}