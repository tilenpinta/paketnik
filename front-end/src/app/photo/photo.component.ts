import { Component, OnInit } from '@angular/core';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {

photo:Photo={"_id":"","name":"","path":""};
photoHost=PhotoService.photoHost;


  constructor(private photoService: PhotoService, private route: ActivatedRoute) { }

//naložimo eno sliko, glede na id
 getPhoto(_id:string): void {

  this.photoService.getPhoto(_id).subscribe(photo => this.photo = photo);
}
//če je id nastavljen, poiščemo sliko na strežniku
  ngOnInit() {
  	this.route.params.subscribe(params=>this.getPhoto(params['_id']));

  }
}
