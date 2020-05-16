import { Component, OnInit } from '@angular/core';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

//objekt za slike in predpona naslovov slik, ker se nahjajo na "drugem" strežniku
photos:Photo[];
photoHost=PhotoService.photoHost;


  constructor(private photoService: PhotoService) { }
//preberemo vse slike, in jih damo v objekt, ki je povezan z html-jem
 getPhotos(): void {
  this.photoService.getPhotos()
  		.subscribe(photos => this.photos = photos);
}
  ngOnInit() {
  	 this.getPhotos();
  }

}
