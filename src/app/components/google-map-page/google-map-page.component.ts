import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'google-map-app-page',
  templateUrl: './google-map-page.component.html',
  styleUrls: ['./google-map-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class GoogleMapPageComponent implements OnInit {

  @ViewChild('googleMap')
  googleMap: ElementRef;

  map: google.maps.Map;
  location: google.maps.LatLngLiteral;
  option: google.maps.MapOptions = {
    zoom: 5
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition( position => {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.map = new google.maps.Map(this.googleMap.nativeElement, {
        ...this.option,
        center: this.location
      });

      let marker = new google.maps.Marker({
        position: this.location,
        map: this.map
      })
    });
  }
}
