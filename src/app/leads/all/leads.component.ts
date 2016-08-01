import { Component, OnInit }        from '@angular/core';
import { Router }                   from '@angular/router';
import { ActivatedRoute, Params }   from '@angular/router';
import { DatePipe }                 from '@angular/common';
import { UserService }              from '../../shared/userService';
import { Config }                   from '../../shared/config/config';
import { RealtorService }           from '../../shared/realtorService';
import { ConversionTableModel }     from '../../models/tableDataModel';
import { ClientMessageTableModel }  from '../../models/tableDataModel';
import { CMARequestTableModel }     from '../../models/tableDataModel';
import { ListingUpdateTableModel }  from '../../models/tableDataModel';
import { SoldAlertsTableModel }     from '../../models/tableDataModel';


@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
  providers: [
    UserService,
    RealtorService
  ]
})

export class LeadsComponent implements OnInit {

  id: number;
  public conversionColumns:Array<any> = [];
  public clientMsgColumns:Array<any> = [];
  public cmaColumns:Array<any> = [];
  public listingColumns:Array<any> = [];
  public alertColumns:Array<any> = [];

  realtorData: any;
  sessions_count: number;
  clientMessages_count: number;
  cmaRequests_count: number;
  newListingUpdates_count: number;
  soldAlerts_count: number;
  sessionsData: any = [];
  isArrived: boolean = false;

//Table Data varialbes
  conversionData: any = [];
  clientMessageData: any = [];
  cmaRequestData: any = [];
  listingUpdateData: any = [];
  soldAlertData: any = [];

  visibleTableNumber: number = 0;

  constructor(
		private userService: UserService,
		private config: Config,
		private router: Router,
    private realtorService: RealtorService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
	) {
      this.route.params
        .subscribe(params => {
          this.id = params['id'] || 0; // (+) converts string 'id' to a number
          // console.log('LeadsComponent - id', this.id);

          this.initLeadsComponent();
      });
	}

  ngOnInit() {}

  public initLeadsComponent(): void {
      if(this.config.realtorId && this.config.realtorObject) {
        // console.log('LeadsComponent - realtorObject = ', this.config.realtorObject);
        this.isArrived = false;
        this.realtorData = this.config.realtorObject;
        this.initColumnHeaders();
        this.loadAllSessionData();
        this.loadClientMsgData();
        this.loadCMARequestData();
        this.loadListingUpdateData();
        this.loadSoldAlertsData();
        this.visibleTableNumber = 1;

        this.sessions_count = this.realtorData.sessions.length;
        this.clientMessages_count = this.realtorData.conversions.realtorMessages.length;
        this.cmaRequests_count = this.realtorData.conversions.cmaRequests.length;
        this.newListingUpdates_count = this.realtorData.conversions.newListingUpdates.length;
        this.soldAlerts_count = this.realtorData.conversions.soldAlerts.length;
      }
      // console.log('LeadsComponent234 - realtorObject = ', this.config.realtorObject);
  }

  public loadAllSessionData():void {
    this.realtorService.getAllSessions()
      .subscribe(data => {
        this.sessionsData = [];
        this.sessionsData = data.docs;
        this.loadConversionData();
      });
  };

  public loadConversionData():void {
    this.conversionData = [];
    for(let i = 0; i < this.sessionsData.length; i++) {
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

      tempConversion.date = this.datePipe.transform(this.sessionsData[i].created, 'dd/MM/yyyy');
      if(this.sessionsData[i].user) {
        tempConversion.id = this.sessionsData[i].user._id;
        if(this.sessionsData[i].user.name) {
          tempConversion.name = this.sessionsData[i].user.name;
        }        
        tempConversion.conversion_count = this.sessionsData[i].user.conversions.soldAlerts.length;
        tempConversion.conversion_count += this.sessionsData[i].user.conversions.realtorMessages.length;
        tempConversion.conversion_count += this.sessionsData[i].user.conversions.newListingUpdates.length;
        tempConversion.conversion_count += this.sessionsData[i].user.conversions.cmaRequests.length;        
      }      
      tempConversion.senderId = this.sessionsData[i].senderId;
      tempConversion.platform = this.sessionsData[i].platform;

      for(let j = 0; j < this.sessionsData[i].queries.length; j++) {
        if(this.sessionsData[i].queries[j] === 'buy house' || this.sessionsData[i].queries[j] === 'sell house') {
          if(j < this.sessionsData[i].queries.length) {
            tempConversion.interest += this.sessionsData[i].queries[j] + ':' + this.sessionsData[i].queries[j+1] + '<br>';
          }
        }
      }
      tempConversion.query_count = this.sessionsData[i].queries.length;
      this.conversionData.push(tempConversion);
    }
    this.isArrived = true;
  };

  public loadCMARequestData(): void {
    this.cmaRequestData = [];
    this.realtorService.resetCMAMessage();
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

        if(receivedData[i].user) {
          tempData.id = receivedData[i].user;
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
    this.realtorService.getCMAMessage();
  };

  public loadClientMsgData(): void {
    this.clientMessageData = [];
    this.realtorService.resetrealtorMessage();
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

        if(receivedData[i].user) {
          tempData.id = receivedData[i].user;
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
    this.realtorService.getRealtorMessage();
  };

  public loadListingUpdateData(): void {
    this.listingUpdateData = [];
    this.realtorService.resetlistingUpdateMessage();
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

        if(receivedData[i].user) {
          tempData.id = receivedData[i].user;
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
    this.realtorService.getListUpdateMessage();
  };

  public loadSoldAlertsData(): void {
    this.soldAlertData = [];
    this.realtorService.resetsoldAlertMessage();
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

        if(receivedData[i].user) {
          tempData.id = receivedData[i].user;
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
    this.realtorService.getAlertMessage();
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
  }

  public visibleTable(index) {
    this.visibleTableNumber = index;
  };

  selectedRow(row) {
  //  console.log('LeadsComponent - selectedRow = ', row.value.row.id);
   this.router.navigate(['/leads/singlelead', row.value.row.id]);
 };
}
