import { Pipe, PipeTransform } from '@angular/core';

// this pipe filters the live search related to the claim list
@Pipe({ name: 'searchInput' })
export class ClaimFilterPipe implements PipeTransform {
  public transform(claims: any[], searchText: any): any {
    // if there is no live search limitation or there are no claims, then show the full list of claims
    if (searchText == null || claims == null) {
      return claims;
    }

    // Limit searches to 3+ characters for performance and UX
    if(searchText.length > 2){

    // execute this if you've selected the 'selected' radio button from the Claim Filters tab, return the filtered list of selected claims
    if(searchText.toLowerCase() === "selected"){
      return claims.filter(claims => { return claims.isSelected === true; });
    }
    // return the filtered list of claims based on the live search text input
      return claims.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  
    }
    
    // if all else fails, send in the wookie
    else{
      return claims;
    }
  }
}