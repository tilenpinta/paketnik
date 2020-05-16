import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Photowall';

isLoggedIn(){

	if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        else
        	return false;
 
}
logout(){
	localStorage.removeItem('currentUser');
}

}
