import { Injectable, EventEmitter, Input, Output }              from '@angular/core';
import { Headers, Http, Response, RequestOptions }              from '@angular/http';
import { Observable, Subject, ReplaySubject }                   from 'rxjs';
import { Config }                                               from './config/config';
// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule }                                 from 'angular-in-memory-web-api';
import { InMemoryDataService }                                  from '../models/in-memory-data.service';
import 'rxjs/add/operator/map';

@Injectable()
export class RealtorService {

    static id = "RealtorService";
    protected basePath: string;
    protected restBasePath: string;

    constructor(private http: Http,
        private config: Config) {
        this.basePath = this.config.api;
        this.restBasePath = 'https://rest.automabots.com/v1/';
        this.reqOptions = new RequestOptions({
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": "Basic ZGFzaGJvYXJkOnMzc3Npb25nM3RrM3k="
            })
        });
    }

    private reqOptions: any;
    private url: string;
    private realtorsData: Subject<any> = new ReplaySubject<any>(1);
    private realtorData: Subject<any> = new ReplaySubject<any>(1);
    // variable for Messages
    private realtorMsg: Subject<any> = new ReplaySubject<any>(1);
    private updateMsg: Subject<any> = new ReplaySubject<any>(1);
    private cmaMsg: Subject<any> = new ReplaySubject<any>(1);
    private alertMsg: Subject<any> = new ReplaySubject<any>(1);
    private allSessions: Subject<any> = new ReplaySubject<any>(1);

    /**
     * [dataPlatform Account Group$ description]
     * @return {Observable<any>} [description]
     */
    get realtorsData$(): Observable<any> {
        return this.realtorsData.asObservable();
    }
    /**
     * [dataPlatform Account Group$ description]
     * @return {Observable<any>} [description]
     */
    get realtorData$(): Observable<any> {
        return this.realtorData.asObservable();
    }
    /**
     * Reset Realtors Data
     */
    public resetRealtorsData(): void {
        this.realtorsData = new ReplaySubject<any>(1);
    }
    /**
     * Reset Realtors Data
     */
    public resetrealtorData(): void {
        this.realtorData = new ReplaySubject<any>(1);
    }
    /**
     * Load Realtors Data
     */
    getDetailedRealtorData() {
        this.http.get(this.basePath + 'realtors/?populate=sessions,users', this.reqOptions)
            .map(x => x.json())
            .subscribe(data => {
                this.realtorsData.next(data);
            });
    }
    /**
     * Load Reltor Data from id
     */
    getRealtorfromId() {
        if (this.config.realtorId) {
            this.url = this.basePath + 'realtors/' + this.config.realtorId;
            this.http.get(this.url, this.reqOptions)
                .map(x => x.json())
                .subscribe(data => {
                    this.realtorData.next(data);
                });
        }
    }
    /**
    * get ClientMessage
    * https://dev.automabots.com/v1/realtor-messages?accesskey=s3ssiong3tk3y&limit=1
    */
    getRealtorMessage(userId = null) {
        if (userId === null) {
            this.url = this.basePath + 'realtor-messages/';
        } else {
            this.url = this.basePath + 'realtor-messages/' + '?user=' + userId;
        }
        this.http.get(this.url, this.reqOptions)
            .map(x => x.json())
            .subscribe(data => {
                this.realtorMsg.next(data);
            });
    };
    /**
     * [dataPlatform Account Group$ description]
     * @return {Observable<any>} [description]
     */
    get realtorMessage$(): Observable<any> {
        return this.realtorMsg.asObservable();
    }
    /**
     * Reset realtorMessage
     */
    public resetrealtorMessage(): void {
        this.realtorMsg = new ReplaySubject<any>(1);
    }
    /**
    * get ListingUpdate Message
    * https://dev.automabots.com/v1/new-listing-updates?accesskey=s3ssiong3tk3y&limit=1
    */
    getListUpdateMessage(userId = null) {
        if (userId === null) {
            this.url = this.basePath + 'new-listing-updates/';
        } else {
            this.url = this.basePath + 'new-listing-updates/?user=' + userId;
        }
        this.http.get(this.url, this.reqOptions)
            .map(x => x.json())
            .subscribe(data => {
                this.updateMsg.next(data);
            });
    };
    /**
 * [dataPlatform Account Group$ description]
 * @return {Observable<any>} [description]
 */
    get listingUpdateMessage$(): Observable<any> {
        return this.updateMsg.asObservable();
    }
    /**
     * Reset listingUpdateMessage
     */
    public resetlistingUpdateMessage(): void {
        this.updateMsg = new ReplaySubject<any>(1);
    }
    /**
     * get CMA Message
     * https://dev.automabots.com/v1/cma-requests?accesskey=s3ssiong3tk3y&limit=1
     */
    getCMAMessage(userId = null) {
        if (userId === null) {
            this.url = this.basePath + 'cma-requests/';
        } else {
            this.url = this.basePath + 'cma-requests/?user=' + userId;
        }
        this.http.get(this.url, this.reqOptions)
            .map(x => x.json())
            .subscribe(data => {
                this.cmaMsg.next(data);
            });
    };
    /**
 * [dataPlatform Account Group$ description]
 * @return {Observable<any>} [description]
 */
    get CMAMessage$(): Observable<any> {
        return this.cmaMsg.asObservable();
    }
    /**
     * Reset CMA Message
     */
    public resetCMAMessage(): void {
        this.cmaMsg = new ReplaySubject<any>(1);
    }
    /**
     * get Sold Alert Message
     * https://dev.automabots.com/v1/sold-alerts?accesskey=s3ssiong3tk3y&realtor=58804e12af163f27f2a813a0
     */
    getAlertMessage(userId = null) {
        if (userId === null) {
            this.url = this.basePath + 'sold-alerts/';
        } else {
            this.url = this.basePath + 'sold-alerts/?user=' + userId;
        }
        this.http.get(this.url, this.reqOptions)
            .map(x => x.json())
            .subscribe(data => {
                this.alertMsg.next(data);
            });
    };
    /**
 * [dataPlatform Account Group$ description]
 * @return {Observable<any>} [description]
 */
    get soldAlertMessage$(): Observable<any> {
        return this.alertMsg.asObservable();
    }
    /**
     * Reset Sold Alert Message
     */
    public resetsoldAlertMessage(): void {
        this.alertMsg = new ReplaySubject<any>(1);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
    getAllSessions(): Observable<any> {
        if (this.config.realtorId) {
            this.url = this.basePath + 'sessions/?populate=user&limit=100&realtor=' + this.config.realtorId;
            // this.url = this.basePath + 'sessions/?populate=user&limit=100';
            return this.http.get(this.url, this.reqOptions)
                .map(x => x.json());
        }
    };


    getAvailableMarketOptions(): Observable<any> {
        if (this.config.realtorId) {
            this.url = this.basePath + 'available-markets';
            return this.http.get(this.url, this.reqOptions)
                .map(x => x.json());
        }
    };

    getFacebookPendingSites(): Observable<any> {
        this.url = this.restBasePath + 'facebook/queue?apikey=C3FgUPt7P6Z0cWU7EfX1';
        return this.http.get(this.url, this.reqOptions)
            .map(x => x.json());
    };

    deployFacebookSite(site): Observable<any> {
        let url = this.restBasePath + 'facebook/deploy';
        let data: any = {
            page_id: site.id,
            page_access_token: site.access_token,
            apikey: 'C3FgUPt7P6Z0cWU7EfX1',
            sites: site.name
        };

        return this.http.post(url, data, this.reqOptions)
            .map(x => x.json())
    }
}
