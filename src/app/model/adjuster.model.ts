export class Adjuster {
    public id: number;
    public name: string; 
    public emailAddress: string;
    public FCNNum: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public State: string;
    public Zipcode: string;
    public claimCount: number; 
    public lat: string;
    public lng: string; 
    public isSelected: boolean;
    public certs: string[];
    constructor(values: Object = {}) { Object.assign(this, values); }
}