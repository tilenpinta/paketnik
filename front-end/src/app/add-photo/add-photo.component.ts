import { Component, OnInit } from '@angular/core';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.css']
})
export class AddPhotoComponent implements OnInit {

fileToUpload: File = null;
photo:Photo={name:'',_id:'',path:''};
  constructor(private photoService: PhotoService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }
  addPhoto(){

  		this.photoService.addPhoto(this.fileToUpload,this.photo)
  		.subscribe(photos => this.router.navigate(['photos']));

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

}
