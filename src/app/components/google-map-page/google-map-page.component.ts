import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'google-map-app-page',
  templateUrl: './google-map-page.component.html',
  styleUrls: ['./google-map-page.component.css'],
})
export class GoogleMapPageComponent implements OnInit {
  dronePathModalOpen: boolean = false;
  droneData: any;

  @ViewChild('googleMap')
  googleMap: ElementRef;

  map: google.maps.Map;
  location: google.maps.LatLngLiteral;
  option: google.maps.MapOptions = {
    mapTypeControl: false,
    zoom: 5,
  };

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

    // this.location = {
    //   lat: 12.9716,
    //   lng: 77.5946,
    // };
    // setTimeout(() => {
    //   this.map = new google.maps.Map(this.googleMap.nativeElement, {
    //     ...this.option,
    //     center: this.location,
    //   });
    // }, 2000)
  }

  openDroneModal() {
    this.dronePathModalOpen = true;
  }

  modalClosed(data: any) {
    this.dronePathModalOpen = false;
    this.droneData = data;
    this.drawDronePath(data);

    console.log('parent', data);
    data.value['timeData'].forEach((tData) => {
      const timeData = new Date(tData.time).getTime();
      console.log(timeData);
      const localTime = new Date(timeData).toLocaleString();
      console.log(localTime);
    });
  }

  drawDronePath(data: any) {
    const dronePathCoordinates = [];
    data.value['timeData'].forEach((tData) => {
      const locationCoordinates = {
        lat: tData.latitude,
        lng: tData.longitude,
      };
      dronePathCoordinates.push(locationCoordinates);
      setTimeout(() => {

      })
    });

    const dronePath = new google.maps.Polyline({
      path: dronePathCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    dronePath.setMap(this.map);
  }
}
