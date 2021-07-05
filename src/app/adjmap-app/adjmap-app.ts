import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, ElementRef, destroyPlatform, QueryList, ContentChildren, ChangeDetectorRef} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClaimAssignment } from '../model/claimAssignment.model';
import { InfoWindow, google } from '@agm/core/services/google-maps-types';
import { Adjuster } from '../model/adjuster.model';
import { MatCheckbox, MatCheckboxChange, MatOption, MatSelect, MatSlider, MatSlideToggle, MatButtonToggle, MatListOption, MatInput, MatDatepicker, MatCalendar, MatTableDataSource } from '@angular/material';
import { AgmMarker, AgmMap, MarkerManager, AgmCircle, AgmInfoWindow } from '@agm/core';
import 'hammerjs';

import { AgmSnazzyInfoWindowModule, AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';
import { HttpHeaders } from '@angular/common/http'
import { ChangeDetectionStrategy } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

const API_KEY: string = 'AIzaSyBp24pbzxjI2Lvz0SADUvR1dcfZoPZTHIQ';
const CW_URL: string = 'https://claimswire-dev.simsol.com/mapdata/claims/';
//const CW_URL: string = 'http://localhost:3000/assignment';
const CW_PUT_URL: string = 'https://claimswire-dev.simsol.com/mapdata/claims/';
//const ADJ_URL: string = 'http://192.168.2.122:3000/adjusters/';
const ADJ_URL: string = 'http://localhost:4000/adjusters';
const GOOGLE_URL: string = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const DIRECTIONS_URL: string="https://maps.googleapis.com/maps/api/directions/json?";
const GOOGLE_DIRECTIONS_URL: string ="https://www.google.com/maps/dir/?api=1&origin=";

@Component({
  selector: 'adjmap-app',
  providers: [],
  templateUrl: './adjmap-app.html',
  styleUrls: ['./adjmap-app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AdjMapComponent implements OnInit {

  date = new FormControl(new Date());
  // styles for map, collapsed
  public mapStyle = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6195a0"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": "0"
            },
            {
                "saturation": "0"
            },
            {
                "color": "#f5f5f2"
            },
            {
                "gamma": "1"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "-3"
            },
            {
                "gamma": "1.00"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#bae5ce"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fac9a9"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#787878"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#0a00ff"
            },
            {
                "saturation": "-77"
            },
            {
                "gamma": "0.57"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#43321e"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#ff6c00"
            },
            {
                "lightness": "4"
            },
            {
                "gamma": "0.75"
            },
            {
                "saturation": "-68"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#eaf6f8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c7eced"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "-49"
            },
            {
                "saturation": "-53"
            },
            {
                "gamma": "0.79"
            }
        ]
    }
];

  // input arrays for JSON data  
  private isMouseIn: boolean
  private adjParam: string;
  private lat = 28.538336;
  private lng = -81.379234;
  public cwDataArray: ClaimAssignment[];
  private claimsFilterArray: ClaimAssignment[];
  private assignedClaimsArray: [];
  private adjDataArray: Adjuster[];
  private filteredClaimList: ClaimAssignment[];
  private selectedAdj: Adjuster;
  private showOrUpdateString = "Display Claims"
  private assignmentsShown = 0;
  private markerAnimation = 'DROP';
  private selectOrDeselectString = "Select All";
  private showOrHideClaimsString = "Hide Claims";
  private showOrHideClaimsRadiusString = "Hide Radius";
  private showOrHideAdjustersString = "Hide Adjusters";
  private selection = false;
  private radiusZoomFive = 0;
  private radiusZoomTen = 0;
  private radiusZoomFifteen = 0;
  private radiusStroke = 0;
  private radiusOpacity = 0;
  private radiusSelect = 0;
  private radiusLabel = "On Claims";
  private radiusSliderValue = 25;
  private radiusSliderLabel = "5/10/15  Miles";
  private autoRadiusOn = true;
  private showClaimRadius = true;
  private showAdjusters = true;
  private mouseOverLat = 0;
  private mouseOverLng = 0;
  private lastChecked: number;
  private shiftDown = false;
  private finderTitle = "Policy Number";
  private finderAddress1 = "Address";
  private finderAddress2 = "Suite";
  private finderCity = "City";
  private finderState = "State";
  private finderZip = "Zip";
  private finderType = "Claim Type";
  private markerZ = 1;
  private adjZ = 1;
  private zoomMax: number;
  private previousZoom: number;
  private currentZoom: number;
  private selectedFilter: string;
  private filters: string[] = ['None', 'RCBAP', 'Flood Dwelling', 'Flood General', 'Selected'];
  private filterDataArray: ClaimAssignment[];
  private directionsQuery: string;
  private gMapDirectionsQuery: string;
  private selectedDate: any;
  private selectedLength = 0;
  private selectedClaimsArray: ClaimAssignment[];
  private selectedTab: any;
  private isMasterChecked = false;
  private tempFix = 0;
  private time = {hour: 13, minute: 30};


  private cardData: ClaimAssignment = {
    "assignmentId": 0,
    "claimNumber": "0",
    "insuredFirstName": "Name",
    "insuredLastName": "",
    "externalAssignmentId": "Claim Number",
    "policyNumber": "",
    "insuredPhone": "",
    "lossAddress1": "Address",
    "lossAddress2": "",
    "lossCity": "City",
    "lossState": "State",
    "lossZipcode": "Zip",
    "Address1": "Address",
    "Address2": "",
    "City": "City",
    "State": "State",
    "Zipcode": "Zip",
    "lat": "",
    "lng": "",
    "isSelected": null,
    "isSubmitted": null,
    "isHidden": null,
    "selectedAdj": null,
    "policyType": "Policy Type",
    "filterString": null,
    "position": null,
    "time": 0
  };
  private adjCard: Adjuster = {
    "id": 0,
    "name": "Adjuster Name", 
    "emailAddress": "",
    "FCNNum": "",
    "Address1": "",
    "Address2": "",
    "City": "",
    "State": "",
    "Zipcode": "",
    "claimCount": 0, 
    "lat": "",
    "lng": "", 
    "certs": [""],
    "isSelected": false
    
  };    



  @ViewChild ('map') map: AgmMap; 
  @ViewChild ('matOption') matOption: MatOption; 
  @ViewChild ('matSelect') matSelect: MatSelect; 
  @ViewChild ('radiusSlider') radiusSlider: MatSlider;
  @ViewChild ('cluster') cluster;
  @ViewChild ('searchInput') searchInput;
  @ViewChild ('autoRadiusSlideToggle') autoRadiusSlideToggle: MatSlideToggle;
  @ViewChild ('gMapiFrame') gMapiFrame;  
  @ViewChild ('calendar') calendar;
  @ViewChildren ('checkbox') checkbox;
  @ViewChild('cardData') cardDataDiv;
  @ViewChildren ('marker') marker;
  @ViewChild ('masterToggle') masterToggler;

  
 constructor(private httpClient: HttpClient, private cdr: ChangeDetectorRef, private route: ActivatedRoute ){
 
    this.getCWAssignments();
  


  }

  // gets Latitude and Longitude from google JSON query
  getLatLng(data: ClaimAssignment){
    if(data != null){
       let tempAddress1: string;
       let tempAddress2: string;
       let tempCity: string;
       let tempState: string;
       let tempZipcode: string;

       if(data.lossAddress1 != undefined || data.lossAddress1 != null){  tempAddress1 = data.lossAddress1.replace(/[^A-Z0-9]/ig, ""); } else { data.lossAddress1 = "";  tempAddress1 = "";}
       if(data.lossAddress2 != undefined || data.lossAddress2 != null){  tempAddress2 = data.lossAddress2.replace(/[^A-Z0-9]/ig, "");} else { data.lossAddress2 = ""; tempAddress2 = "";}
       if(data.lossCity != undefined || data.lossCity != null){  tempCity = data.lossCity.replace(/[^A-Z0-9]/ig, "");} else { data.lossCity = ""; tempCity = "";}
       if(data.lossState != undefined || data.lossState != null){  tempState = data.lossState.replace(/[^A-Z0-9]/ig, ""); } else { data.lossState = ""; tempState = "";}
       if(data.lossZipcode != undefined || data.lossZipcode != null){  tempZipcode = data.lossZipcode.replace(/[^A-Z0-9]/ig, ""); } else { data.lossZipcode = ""; tempZipcode = "";}

      let googleQuery = GOOGLE_URL 
      + tempAddress1
      + tempAddress2  + "+,"
      + tempCity + ",+" 
      + tempState + "+" 
      + tempZipcode + "&key=" 
      + API_KEY;
      
   
      this.httpClient.get(googleQuery).subscribe((res: any)=>{
        if(res.results[0] != undefined && data.lossAddress1 != null){
          
          data.lat = res.results[0].geometry.location.lat;
          data.lng = res.results[0].geometry.location.lng;
        
        }
        });
    }
  }

  getDirections(){
    let origin = "origin=";
    let destination = "&destination=";
    let originString = ""; 
    let address = "Tampa,FL";
    let destinationString = "";
    let key = "&key=";
    let waypoints = "&waypoints=optimize:true";
    let waypoint1 = "|Tampa,FL|";
    let waypoint2 = "Orlando,Fl";
    let waypointsString = "";
    let sortedWaypoints: [];

    let index = 0;

    for(let data of this.selectedClaimsArray){
      // if(index === 0){
      //   originString = data.lat.toString() + "," + data.lng.toString();
      // }
      // if(index === this.cwDataArray.length - 1){
      //   destinationString = data.lat.toString() + "," + data.lng.toString();
      // }
      // else{
      
      
        waypointsString +=   "|" +  data.lat.toString() + "," +  data.lng.toString();
      console.log(waypointsString);

      // } 
      index++; 
    }

    this.directionsQuery = DIRECTIONS_URL + origin +  address + destination +  waypoint2  + waypoints + waypointsString + key + API_KEY;
    console.log(this.directionsQuery);
    // THIS NEEDS TO GO INSIDE THE GET
    
    // let route: number[] = [ 1, 3, 0, 2 ];
    // let temp: ClaimAssignment[] = this.selectedClaimsArray.slice();
    // let i = 0;
  
    // for(let data of this.selectedClaimsArray){
   
    //   temp[i] = this.selectedClaimsArray[route[i]];

    // if(i === this.selectedClaimsArray.length ){
    //   temp[i] = this.selectedClaimsArray[i];
    // }

    //   i++;
    // }

    // this.selectedClaimsArray = temp.slice();

    
    this.httpClient.get(this.directionsQuery).subscribe((res: ClaimAssignment[])=>{

      
      

  
    });
  }


  // gets assignment info from CW and subscribes it to cwDataArray
  getCWAssignments(){
   
    // temporarily disables button
   // event.srcElement.disabled = true;
   let adjParam = this.getParamValueQueryString("id");

    this.httpClient.get(CW_URL + adjParam).subscribe((res: ClaimAssignment[])=>{
      this.cwDataArray = res; 
      let index = 0;
        //add isSelected property
        for(let d of this.cwDataArray){
         //add data from assignment JSON file to query data for geocoding, query google via getLatLng(), pass data back into the array
          this.getLatLng(d);
          if(index <= 0){
            d.position = 1;
          }
          else{d.position = this.cwDataArray[index-1].position + 1;}
          d.isSubmitted = false;
          d.isHidden = false;
          d.isSelected = false;
          d.filterString = 
                          d.insuredFirstName + " " 
                          + d.insuredLastName +   
                          d.lossAddress1 + "" 
                          + d.lossAddress2 + ", " 
                          + d.lossCity + ", " 
                          + d.lossState + " " 
                          + d.lossZipcode ;
                          
                          
          index++;
             
        }
        
        this.claimsFilterArray = this.cwDataArray.slice();
        this.filterDataArray = this.cwDataArray.slice();
        console.log('CW Assignments Loaded', this.cwDataArray);
     
      
        //event.srcElement.disabled = false;

    });

    this.assignmentsShown++;
    this.showOrUpdate(this.assignmentsShown);

    this.zoomMax = 10;
    setTimeout(() => {
      this.zoomMax = 17;
      this.cdr.detectChanges();
      

    }, 1000);
  

  }

  sendtoGoogle(){
    let origin: string;
    let destination: string;
    let waypoints: string = "&waypoints=";
    let address = "Tampa,FL";
    let index = 0;

     


    for(let data of this.selectedClaimsArray.filter(claims => { return claims.isSelected === true; })){
    //   if(index == 0){
    //     origin = data.lat.toString() + "," + data.lng.toString();
    //   }

    //   if(index == (this.selectedClaimsArray.filter(claims => { return claims.isSelected === true; }).length - 1)){
    //     destination = "&destination=" + data.lat.toString()  + "," + data.lng.toString();
     
    //   }
    //   else if(index != 0 && index != (this.selectedClaimsArray.filter(claims => { return claims.isSelected === true; }).length - 1)){
      
      waypoints += "|" + data.lat.toString()  + "," + data.lng.toString();
     
     // }
      index++;
    }
  
    waypoints += "|";

    this.gMapDirectionsQuery = GOOGLE_DIRECTIONS_URL + address + "&destination=" + address + waypoints;
    // this.gMapiFrame.nativeElement.src = "https://www.google.com/maps/embed/v1/directions?key=" + API_KEY
    // + "&origin=" + origin + destination;

    window.open(this.gMapDirectionsQuery);    
  }

  showOrUpdate(assignmentsShown: number){
    if(assignmentsShown > 0){
      this.showOrUpdateString = "Refresh Claims";
    }

    
  }

  



  markerClicked(event: any, data: ClaimAssignment){

    // Toggles whether the marker is selected or not
    if(data.isSelected === false || data.isSelected === undefined){
      data.isSelected = true;
    
     

  
    
    }
    else{
      data.isSelected = false;
    
      
    }


    
  }


  markerRightClick(){
  
    if(this.markerZ > 0){
      this.markerZ = 0;
    }
    else{
      this.markerZ = 1;
    }
 
  }



showOrHideClaims(selection: boolean){
  
  if(selection === true){
    this.showOrHideClaimsString = "Show Claims";

  }
  else{
    this.showOrHideClaimsString = "Hide Claims";
  }

}

//determines marker visibility 
hiddenOrSubmitted(data: any){
  if(data.isSubmitted === true || data.isHidden === true){
    
    return false;
  }
  else{
    return true;
  }
}

//toggles isHidden property on click
onHideClaims(cwDataArray: ClaimAssignment[]){
  if(cwDataArray != null){

  
    for(let data of cwDataArray){
        data.isHidden = !data.isHidden
        this.showOrHideClaims(data.isHidden);
        
    }
  }
  else{
    alert('No Claims to Hide');
  }

}

claimMouseOver(event: any, data: any){

    this.isMouseIn = true;


 

  if(data.name === undefined){
    if(this.radiusSelect === 0){
      this.mouseOverLat = event.coords.lat;
      this.mouseOverLng = event.coords.lng;
    }  

    this.cardData = data;
    this.finderType = this.cardData.claimNumber;
    this.finderTitle = this.cardData.insuredFirstName + " " + this.cardData.insuredLastName;
    this.finderAddress1 = this.cardData.lossAddress1;
    this.finderAddress2 = this.cardData.lossAddress2;
    this.finderCity = this.cardData.lossCity;
    this.finderState = this.cardData.lossState;
    this.finderZip = this.cardData.lossZipcode;
  }

  

}

claimMouseOut(event: any, data: any){
  this.mouseOverLat = 0;
  this.mouseOverLng = 0;

  this.isMouseIn = false;
  
}
isClaimOrAdjRadius(event: MatButtonToggle){
  if(event.value === "0")
    this.radiusSelect = 0;
  
  else
    this.radiusSelect = 1;
}



showOrHideClaimRadius(){

  this.showClaimRadius = !this.showClaimRadius;

  if(this.showOrHideClaimsRadiusString === "Hide Radius")
  {
    this.showOrHideClaimsRadiusString = "Show Radius";
 
  }
  else{
    this.showOrHideClaimsRadiusString = "Hide Radius";
 
  }
}

showOrHideAdjusters(){
  this.showAdjusters = !this.showAdjusters;

  if(this.showOrHideAdjustersString === "Hide Adjusters"){
    this.showOrHideAdjustersString = "Show Adjusters";
  }
  else{
    this.showOrHideAdjustersString = "Hide Adjusters";
  }
}

// Sets label for slider
formatLabel(value: number | null) {
      if (!value) {
        return 0;
      }
    if (value === 25){
      this.radiusSliderLabel = "5/10/15  Miles";
      return ("5/10/15  Miles");
     
    }
    if (value === 50){
      this.radiusSliderLabel = "10/25/50  Miles";
      return ("10/25/50  Miles");
    }
    if (value === 75){
      this.radiusSliderLabel = "25/50/75  Miles";
      return ("25/50/75  Miles");
    }
    if (value === 100){
      this.radiusSliderLabel = "50/75/100  Miles";
      return ("50/75/100  Miles");
    }

}
sliderChange(event: MatSlider){

  this.radiusSliderValue = event.value;

  if(this.radiusSliderLabel != "Hidden"){  
    if (event.value === 25){
      this.radiusSliderLabel = "5/10/15  Miles";
      
    }
    if (event.value === 50){
      this.radiusSliderLabel = "10/25/50  Miles";
    
    }
    if (event.value === 75){
      this.radiusSliderLabel = "25/50/75  Miles";
  
    }
    if (event.value === 100){
      this.radiusSliderLabel = "50/75/100  Miles";
    
    }
  }



}

  
  isAutoRadius(){
    this.autoRadiusSlideToggle.focus;
    this.autoRadiusOn = !this.autoRadiusOn;
    
    if(!this.autoRadiusOn){
      this.radiusSlider.value = this.radiusSliderValue;
    }
  
  }
  

  //gets parameter name
  getParamValueQueryString( paramName ) {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
      console.log(paramValue);
    }
    return paramValue;
  }
  ngOnInit() {


  }
  ngDoCheck(){

  }

  filterSelect(){
    
    this.cwDataArray = this.filterDataArray.slice();

    if(this.selectedFilter === 'None'){
      this.cwDataArray = this.filterDataArray.slice();
    }
    if(this.selectedFilter === 'RCBAP'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "RCBAP"; });
    }
    if(this.selectedFilter === 'Flood Dwelling'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Flood Dwelling"; });
    }
    if(this.selectedFilter === 'Flood General'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Flood General"; });
    }
    if(this.selectedFilter === 'Selected'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.isSelected === true; });
    }
  }
  //handles Radius and Auto Radius
  onMapChange(event){
     
    
    if(this.autoRadiusOn){
      if(this.map.zoom < 12 && this.map.zoom > 7){
     
          if(this.map.zoom < 11){
          this.radiusSliderValue = 25;
          this.radiusSliderLabel = "5/10/15  Miles";
          
          }
          if(this.map.zoom < 10){
            this.radiusSliderValue = 50;
            this.radiusSliderLabel = "10/25/50  Miles";
        
            
          }
          if(this.map.zoom < 9){
            this.radiusSliderValue = 75;
            this.radiusSliderLabel = "25/50/75  Miles";
          
          }
          if(this.map.zoom < 8){
            this.radiusSliderValue = 100;
            this.radiusSliderLabel = "50/75/100  Miles";
          
          }
            
          if(this.radiusSliderValue === 25)
          {
          this.radiusZoomFive = 8046.72;
          this.radiusZoomTen = 16093.4;
          this.radiusZoomFifteen = 24140.2;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === 50)
          {
          this.radiusZoomFive = 16093.4;
          this.radiusZoomTen = 40233.6;
          this.radiusZoomFifteen = 80467.2;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === 75)
          {
          this.radiusZoomFive = 32186.9;
          this.radiusZoomTen = 80467.2;
          this.radiusZoomFifteen = 120701;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === 100)
          {
          this.radiusZoomFive = 80467.2;
          this.radiusZoomTen = 120701;
          this.radiusZoomFifteen = 160934;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }

      }

       
       
     }
     else{
     
           if(this.radiusSliderValue === 25)
           {
           this.radiusZoomFive = 8046.72;
           this.radiusZoomTen = 16093.4;
           this.radiusZoomFifteen = 24140.2;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 50)
           {
           this.radiusZoomFive = 16093.4;
           this.radiusZoomTen = 40233.6;
           this.radiusZoomFifteen = 80467.2;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 75)
           {
           this.radiusZoomFive = 32186.9;
           this.radiusZoomTen = 80467.2;
           this.radiusZoomFifteen = 120701;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 100)
           {
           this.radiusZoomFive = 80467.2;
           this.radiusZoomTen = 120701;
           this.radiusZoomFifteen = 160934;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
         }

         this.previousZoom = this.map.zoom;
  }


  trackByFn(index) {
    return index;
  }

  public onSelectedOptionsChange(event) {
 
    this.filteredClaimList = event;
    this.filteredClaimList = this.filteredClaimList.slice();

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedClaimsArray, event.previousIndex, event.currentIndex);

  }

  onSelectionChange(){

 
   

  }
  selectedCount(){
    this.selectedLength++;
  }
  onSelect(event){

  this.selectedDate = event;


  this.selectedTab = 1;

  }
  onDateChange(){
  
    if(this.date.value != null && this.date.value != undefined){
    this.selectedDate = this.date.value;
    
    this.calendar.activeDate = this.selectedDate;
    this.selectedTab = 1;
    }
  }

  displayedColumns: string[] = ['select','position','insuredName', 'lossAddress', 'csz'];
  selectionChoice = new SelectionModel<ClaimAssignment>(true, []);
  dataSource = new MatTableDataSource<ClaimAssignment>(this.cwDataArray);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
 

      const numSelected = this.selectionChoice.selected.length;
      const numRows =  this.dataSource.data.length;
   
      return numSelected === numRows;
    
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    
    
    this.isMasterChecked = !this.isMasterChecked;

    this.tempFix++;

   if(this.isMasterChecked === true){
    for(let data of this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(this.searchInput.nativeElement.value.toLowerCase()) !== -1)){
      data.isSelected = true;
    }
  }
  else{
    for(let data of this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(this.searchInput.nativeElement.value.toLowerCase()) !== -1)){
      data.isSelected = false;
    }
  }

    this.selectedClaimsArray = this.cwDataArray.filter(claims => { return claims.isSelected === true; });

  
  }
  


  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ClaimAssignment): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionChoice.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  setEqualTo(){
   this.selectedClaimsArray = this.cwDataArray.filter(claims => { return claims.isSelected === true; });
  }

  changeTab() {
 
    if(this.selectedClaimsArray != undefined){
      this.getDirections();

      
    if(this.selectedClaimsArray.length > 0) {
      this.selectedTab += 1;

      if (this.selectedTab >= 2) this.selectedTab = 3;
    }
    else{
      alert("Please select a Claim");
    }
  
  }
  else{
    alert("Please select a Claim");
  }

}
  reverseTab(){
    this.selectedTab -= 1;
  }


  calClick(event){

    for(let i = 0; i <=31; i++){
          
      if(event.srcElement.innerHTML == i && event.srcElement.innerHTML != ""){

        this.selectedTab = 1;
      }
    }
  }
}

