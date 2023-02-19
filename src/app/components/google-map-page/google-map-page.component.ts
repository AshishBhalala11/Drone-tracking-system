import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'google-map-app-page',
  templateUrl: './google-map-page.component.html',
  styleUrls: ['./google-map-page.component.css'],
})
export class GoogleMapPageComponent implements OnInit {
  dronePathModalOpen: boolean = false;
  dronePathData = [];

  @ViewChild('googleMap')
  googleMap: ElementRef;

  map: google.maps.Map;
  location: google.maps.LatLngLiteral;
  option: google.maps.MapOptions = {
    mapTypeControl: false,
    zoom: 5,
  };

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      this.map = new google.maps.Map(this.googleMap.nativeElement, {
        ...this.option,
        center: this.location,
      });

      let marker = new google.maps.Marker({
        position: this.location,
        map: this.map,
      });
    });
  }

  openDroneModal() {
    this.dronePathModalOpen = true;
  }

  modalClosed(data: any) {
    this.dronePathModalOpen = false;
    const timeSeriesData = data.value['timeData'];
    this.addDroneData(data.value['droneName'], timeSeriesData);
  }

  addDroneData(name: string, timeSeriesData: any) {
    const dronePathCoordinates = [];
    let currLocaion: google.maps.LatLngLiteral;

    const dronePathLine = this.addPoliline(dronePathCoordinates);
    const marker = this.addMarker(currLocaion);

    timeSeriesData.forEach((tData) => {
      const locationCoordinates = {
        lat: tData.latitude,
        lng: tData.longitude,
      };
      dronePathCoordinates.push(locationCoordinates);

      let timeRemain = new Date(tData.time).getTime() - new Date().getTime();
      setTimeout(() => {
        marker.setPosition(locationCoordinates);
      }, timeRemain);
    });

    dronePathLine.setPath(dronePathCoordinates);
    dronePathLine.setMap(this.map);

    this.dronePathData.push({
      name: name,
      locationMarker: marker,
      pathPolyLine: dronePathLine,
      pathCordinates: dronePathCoordinates,
    });
  }

  addPoliline(dronePathCoordinates: Array<google.maps.LatLngLiteral>) {
    return new google.maps.Polyline({
      path: dronePathCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
  }

  addMarker(currLocaion: google.maps.LatLngLiteral) {
    return new google.maps.Marker({
      position: currLocaion,
      map: this.map,
    });
  }
}
