import { Component, OnInit }        from '@angular/core';
import { Config }                   from '../../shared/config/config';
import { RealtorService }           from '../../shared/realtorService';
import { DatePipe }                 from '@angular/common';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss'],
  providers: [
    RealtorService,
    DatePipe
  ]
})

export class FacebookComponent implements OnInit {

  public facebookColumns: Array<any> = [];
  facebookQueue: any = [];
  isArrived: boolean = false;

  constructor(
    private config: Config,
    private realtorService: RealtorService,
    private datePipe: DatePipe
  ) {
    this.initColumnHeaders();
    this.loadFacebookQueueData();
  }

  ngOnInit() {
  }

  public initColumnHeaders(): void {
    this.facebookColumns = [
      {title: 'Date', name: 'date'},
      {title: 'Sites', name: 'sites'},
      {title: 'Status', name: 'status'}
    ];
  };
  
  public loadFacebookQueueData(): void {
    this.realtorService.getFacebookPendingSites()
        .subscribe(
          data => {
            this.loadFacebookTableData(data);
            console.log('loadFacebookQueueData = ', data);
          },
          error => {
            console.log('loadFacebookQueueData-error = ', error);
    });
  };

  public loadFacebookTableData(data): void {
    this.facebookQueue = [];

    for(let i = 0; i < data.length; i++) {
      let temp: any  = {
        date: '',
        sites: '',
        status: ''
      };

      temp.date = this.datePipe.transform(data[i].submitted_date, 'dd/MM/yyyy'); 
      temp.sites = data[i].sites;
      temp.status = data[i].status;
      this.facebookQueue.push(temp);
    }
    this.isArrived = true;
  };
}
