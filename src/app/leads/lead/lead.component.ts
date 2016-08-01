import { Component, OnInit }        from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Router }                   from '@angular/router';
import { Observable }               from 'rxjs/Observable';
import { DatePipe }                 from '@angular/common';
import { FormsModule }              from '@angular/forms';
import { CommonModule }             from '@angular/common';
import { UserService }              from '../../shared/userService';
import { Config }                   from '../../shared/config/config';
import { RealtorService }           from '../../shared/realtorService';
import { ConversionTableModel }     from '../../models/tableDataModel';
import { ClientMessageTableModel }  from '../../models/tableDataModel';
import { CMARequestTableModel }     from '../../models/tableDataModel';
import { ListingUpdateTableModel }  from '../../models/tableDataModel';
import { SoldAlertsTableModel }     from '../../models/tableDataModel';
// import { RealtorTableComponent }    from '../../shared/realtor-table/realtor-table.component';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss'],
  providers: [
    UserService,
    RealtorService,
    DatePipe
  ]
})
export class LeadComponent implements OnInit {

  id: number;
  private sub: any;
  public conversionColumns:Array<any> = [];
  public clientMsgColumns:Array<any> = [];
  public cmaColumns:Array<any> = [];
  public listingColumns:Array<any> = [];
  public alertColumns:Array<any> = [];
  public queryColumns:Array<any> = [];

  realtorData: any;
  sessions_count: number;
  clientMessages_count: number;
  cmaRequests_count: number;
  newListingUpdates_count: number;
  soldAlerts_count: number;
  userData: any = [];
  sessionData: any = [];
  isArrived: boolean = false;

//Table Data varialbes
  conversionData: any = [];
  clientMessageData: any = [];
  cmaRequestData: any = [];
  listingUpdateData: any = [];
  soldAlertData: any = [];
  QueriesData: any = [];

  visibleTableNumber: number = 0;

  constructor(
		private userService: UserService,
		private config: Config,
    private realtorService: RealtorService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
	) {
      if(this.config.realtorId && this.config.realtorObject) {
        this.realtorData = this.config.realtorObject;
		}
    // console.log('LeadComponent-params = ', this.route.params);

    this.route.params
      .subscribe(params => {
        this.id = params['id'] || 0; // (+) converts string 'id' to a number
      });

    if(this.id === 0) {
      alert('Select a row to view detailed user info');
      this.router.navigate(['/leads/all', this.config.realtorId]);
    } else {
      this.initColumnHeaders();
      this.loadUserData();
      this.loadClientMsgData();
      this.loadCMARequestData();
      this.loadListingUpdateData();
      this.loadSoldAlertsData();
      this.visibleTableNumber = 1;
    }
	}

  ngOnInit() {}

  public loadUserData():void {
    this.userService.getUserDatafromId(this.id)
      .subscribe(data => {
        this.userData = [];
        this.userData = data.docs[0];
        this.loadSessionData();
        this.loadQueriesData();
      });
  };

  public loadQueriesData():void {
    for(let i = 0; i < this.userData.queries.length; i++) {
      let query = this.userData.queries[i];
      let tempQuery = {
        deliveryLine: '',
        neighborhood: '',
        city: '',
        state: '',
        zip: '',
        price: '',
        beds: '',
        baths: '',
        propertyType: ''
      };

      if(query.deliveryLine) {
        tempQuery.deliveryLine = query.deliveryLine;
      }

      if(query.polygonName) {
        let before = 0; 
        let after = 0;
        after = query.polygonName.indexOf(',');
        tempQuery.neighborhood = query.polygonName.substr(before, after);
        before = after;
        after = query.polygonName.indexOf(',', before + 1);
        tempQuery.city = query.polygonName.substr(before, after);
        tempQuery.state = query.polygonName.substr(after);
      }

      if(query.listPrice) {
        tempQuery.price = query.listPrice;
      }

      if(query.beds) {
        tempQuery.beds = query.beds;
      }

      if(query.baths) {
        tempQuery.baths = query.baths.total;
      }

      if(query.propertyType) {
        tempQuery.propertyType = query.propertyType;
      }

      this.QueriesData.push(tempQuery);
    }
    this.isArrived = true;
  };

  public loadSessionData():void {
    this.sessions_count = this.userData.sessions.length;
    this.clientMessages_count = this.userData.conversions.realtorMessages.length;
    this.cmaRequests_count = this.userData.conversions.cmaRequests.length;
    this.newListingUpdates_count = this.userData.conversions.newListingUpdates.length;
    this.soldAlerts_count = this.userData.conversions.soldAlerts.length;

    for(let i = 0; i < this.userData.sessions.length; i++) {
      let tempConversion: ConversionTableModel  = {
        id: '',
        date: '',
        name: '',
        senderId: '',
        platform: '',
        interest: '',
        query_count: '',
        conversion_count: ''
      };

      tempConversion.id = this.userData._id;
      tempConversion.date = this.datePipe.transform(this.userData.created, 'dd/MM/yyyy');
      if(this.userData.name) {
        tempConversion.name = this.userData.name;
      }      
      tempConversion.senderId = this.userData.sessions[i].senderId;
      tempConversion.platform = this.userData.sessions[i].platform;

      for(let j = 0; j < this.userData.sessions[i].queries.length; j++) {
        if(this.userData.sessions[i].queries[j] === 'buy house' || this.userData.sessions[i].queries[j] === 'sell house') {
          if(j < this.userData.sessions[i].queries.length) {
            tempConversion.interest += this.userData.sessions[i].queries[j] + ':' + this.userData.sessions[i].queries[j+1] + '<br>';
          }
        }
      }
      tempConversion.query_count = this.userData.sessions[i].queries.length;
      tempConversion.conversion_count = this.userData.conversions.soldAlerts.length;
      tempConversion.conversion_count += this.userData.conversions.realtorMessages.length;
      tempConversion.conversion_count += this.userData.conversions.newListingUpdates.length;
      tempConversion.conversion_count += this.userData.conversions.cmaRequests.length;

      this.conversionData.push(tempConversion);
    }
  };

  public loadCMARequestData(): void {
    this.realtorService.CMAMessage$.subscribe(data => {
      let receivedData = data.docs;
      // console.log('loadCMARequestData = ', receivedData);
      for(let i = 0; i < receivedData.length; i++) {
        let tempData: CMARequestTableModel  = {
          id: '',
          date: '',
          name: '',
          contact: '',
          location: '',
          address: ''
        };

        if(receivedData[i]._id) {
          tempData.id = receivedData[i]._id;
        }

        if(receivedData[i].created) {
          tempData.date = this.datePipe.transform(receivedData[i].created, 'dd/MM/yyyy');
        }

        if(receivedData[i].name) {
          tempData.name = receivedData[i].name;
        }

        if(receivedData[i].phoneNumber) {
          tempData.contact = receivedData[i].phoneNumber + '/';
        }

        if(receivedData[i].fbid) {
          tempData.contact += receivedData[i].fbid + '/';
        }

        if(receivedData[i].email) {
          tempData.contact += receivedData[i].email;
        }

        if(receivedData[i].city) {
          tempData.location = receivedData[i].city + ' ';
        }

        if(receivedData[i].state) {
          tempData.location += receivedData[i].state + ' ';
        }

        if(receivedData[i].zip) {
          tempData.location += receivedData[i].zip;
        }

        if(receivedData[i].deliveryLine) {
          tempData.address = receivedData[i].deliveryLine;
        }

        this.cmaRequestData.push(tempData);
      }
    });
    this.realtorService.getCMAMessage(this.id);
  };

  public loadClientMsgData(): void {
    this.realtorService.realtorMessage$.subscribe(data => {
      let receivedData = data.docs;
      // console.log('loadClientMsgData = ', receivedData);

      for(let i = 0; i < receivedData.length; i++) {
        let tempData: ClientMessageTableModel  = {
          id: '',
          date: '',
          name: '',
          phoneNumber: '',
          message: ''
        };

        if(receivedData[i]._id) {
          tempData.id = receivedData[i]._id;
        }

        if(receivedData[i].created) {
          tempData.date = this.datePipe.transform(receivedData[i].created, 'dd/MM/yyyy');
        }

        if(receivedData[i].name) {
          tempData.name = receivedData[i].name;
        }

        if(receivedData[i].message) {
          tempData.message = receivedData[i].message;
        }

        if(receivedData[i].phoneNumber) {
          tempData.phoneNumber = receivedData[i].phoneNumber;
        }

        this.clientMessageData.push(tempData);
      }      
    });
    this.realtorService.getRealtorMessage(this.id);
  };

  public loadListingUpdateData(): void {
    this.realtorService.listingUpdateMessage$.subscribe(data => {
      let receivedData = data.docs;
      // console.log('loadListingUpdateData = ', receivedData);
      for(let i = 0; i < receivedData.length; i++) {
        let tempData: ListingUpdateTableModel  = {
          id: '',
          date: '',
          name: '',
          location: '',
          contact: '',
          price: '',
          beds: '',
          baths: '',
          propertyType: '',
        };

        if(receivedData[i]._id) {
          tempData.id = receivedData[i]._id;
        }

        if(receivedData[i].created) {
          tempData.date = this.datePipe.transform(receivedData[i].created, 'dd/MM/yyyy');
        }

        if(receivedData[i].name) {
          tempData.name = receivedData[i].name;
        }

        if(receivedData[i].phoneNumber) {
          tempData.contact = receivedData[i].phoneNumber + '/';
        }

        if(receivedData[i].fbid) {
          tempData.contact = receivedData[i].fbid + '/';
        }

        if(receivedData[i].email) {
          tempData.contact += receivedData[i].email;
        }
        
        if(receivedData[i].minPrice) {
          tempData.price = receivedData[i].minPrice + '/';
        }

        if(receivedData[i].maxPrice) {
          tempData.price += receivedData[i].maxPrice;
        }

        if(receivedData[i].numBeds) {
          tempData.beds = receivedData[i].numBeds;
        }

        if(receivedData[i].numBaths) {
          tempData.baths = receivedData[i].numBaths;
        }

        if(receivedData[i].propertyType) {
          tempData.propertyType = receivedData[i].propertyType;
        }

        if(receivedData[i].zip) {
          tempData.location = receivedData[i].zip + ' ';
        }

        if(receivedData[i].polygonName) {
          tempData.location += receivedData[i].polygonName;
        }

        this.listingUpdateData.push(tempData);
      }
    });
    this.realtorService.getListUpdateMessage(this.id);
  };

  public loadSoldAlertsData(): void {
    this.realtorService.soldAlertMessage$.subscribe(data => {
      let receivedData = data.docs;
      // console.log('loadSoldAlertsData = ', receivedData);
      for(let i = 0; i < receivedData.length; i++) {
        let tempData: SoldAlertsTableModel  = {
          id: '',
          date: '',
          name: '',
          contact: '',
          location: '',
          address: ''
        };

        if(receivedData[i]._id) {
          tempData.id = receivedData[i]._id;
        }

        if(receivedData[i].created) {
          tempData.date = this.datePipe.transform(receivedData[i].created, 'dd/MM/yyyy');
        }

        if(receivedData[i].name) {
          tempData.name = receivedData[i].name;
        }

        if(receivedData[i].phoneNumber) {
          tempData.contact = receivedData[i].phoneNumber + '/';
        }

        if(receivedData[i].fbid) {
          tempData.contact += receivedData[i].fbid + '/';
        }

        if(receivedData[i].email) {
          tempData.contact = receivedData[i].email;
        }

        if(receivedData[i].city) {
          tempData.location = receivedData[i].city + ' ';
        }

        if(receivedData[i].state) {
          tempData.location += receivedData[i].state + ' ';
        }

        if(receivedData[i].zip) {
          tempData.location += receivedData[i].zip;
        }

        if(receivedData[i].deliveryLine) {
          tempData.address = receivedData[i].deliveryLine;
        }

        this.soldAlertData.push(tempData);
      }
    });
    this.realtorService.getAlertMessage(this.id);
  };

  public initColumnHeaders() {
    this.conversionColumns = [
      {title: 'Date', name: 'date'},
      {title: 'Name', name: 'name', sort: 'asc'},
      {title: 'SenderId', name: 'senderId', sort: 'asc'},
      {title: 'Platform', name: 'platform', sort: ''},
      {title: 'Interest', name: 'interest'},
      {title: 'Queries', name: 'query_count'},
      {title: 'Conversion', name: 'conversion_count'}
    ];

    this.clientMsgColumns = [
      {title: 'Date', name: 'date'},
      {title: 'Name', name: 'name', sort: 'asc'},
      {title: 'PhoneNumber', name: 'phoneNumber', sort: 'asc'},
      {title: 'Message', name: 'message', sort: 'asc'},
    ];

    this.cmaColumns = [
      {title: 'Date', name: 'date'},
      {title: 'Name', name: 'name', sort: 'asc'},
      {title: 'Contact Info', name: 'contact', sort: 'asc'},
      {title: 'Address', name: 'address'},
      {title: 'Location', name: 'location'}
    ];

    this.listingColumns = [
      {title: 'Date', name: 'date'},
      {title: 'Name', name: 'name'},
      {title: 'Contact Info', name: 'contact'},
      {title: 'Price', name: 'price'},
      {title: 'Beds', name: 'beds'},
      {title: 'Baths', name: 'baths'},
      {title: 'Property Type', name: 'propertyType'},
      {title: 'Location', name: 'location'}
    ];

    this.alertColumns = [
      {title: 'Date', name: 'date'},
      {title: 'Name', name: 'name', sort: 'asc'},
      {title: 'Contact Info', name: 'contact', sort: 'asc'},
      {title: 'Address', name: 'address'},
      {title: 'Location', name: 'location'}
    ];

    this.queryColumns = [
      {title: 'DeliveryLine', name: 'deliveryLine'},
      {title: 'Neighborhood', name: 'neighborhood'},
      {title: 'City', name: 'city'},
      {title: 'State', name: 'state'},
      {title: 'Zip', name: 'zip'},
      {title: 'Min-Max Price', name: 'price'},
      {title: 'Beds', name: 'beds'},
      {title: 'Baths', name: 'baths'},
      {title: 'PropertyType', name: 'propertyType'}
    ];
  }

  public visibleTable(index) {
    this.visibleTableNumber = index;
  };
}
