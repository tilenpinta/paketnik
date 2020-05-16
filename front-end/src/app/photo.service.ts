import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Photo } from './photo';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
		
//naslov storitve
		public static photoHost = 'http://localhost:3000/';
 
 //Injectan http client za ajax zahteve
 constructor(
  private http: HttpClient) { }

//enostavna zahteva na strežnik, ki vrača json seznam vseh slik
 public getPhotos (): Observable<Photo[]> {
  return this.http.get<Photo[]>(PhotoService.photoHost+'photos');
  }

//enostavna zahteva na strežnik, ki vrača json objekt ene slike
public getPhoto (_id:string): Observable<Photo> {
  return this.http.get<Photo>(PhotoService.photoHost+'photos/'+_id);
  }

//dodajanje slike
//file je nativen objekt, photo pa ostali podatki slike (v našem primeru samo name)
//formData je objekt, v katerega lahko dodamo datoteko (sliko), zraven pa še ostale podatke
public addPhoto (fileToUpload: File,photo:Photo): Observable<Photo> {
	const formData: FormData = new FormData();
	const headers = new HttpHeaders();
    formData.append('slika', fileToUpload, fileToUpload.name);
    formData.append('name', photo.name);
  
  //kličemo z withCredentials, ker moramo za dodajanje slike biti prijavljeni
  return this.http.post<Photo>(PhotoService.photoHost+'photos',formData,{ headers, withCredentials: true });
  }

  //v vse storitve je pametno dodati obravnavanje napak
  //več o tem imate na vodiču Tour of Heroes

}
