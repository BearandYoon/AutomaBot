import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { Config } from './config/config';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
    static id = "UserService";

    protected basePath: string;
    protected basicAuth = {
        username: '',
        password: ''
    }

    constructor(private http: Http,
        private config: Config) {
        this.basePath = 'https://dev.automabots.com/v1/realtors/';
        this.basicAuth.username = 'restadmin';
        this.basicAuth.password = 'MhakjLHWFmPpW6xtd7IFJmhMlklV0GijDn5C4=';
        this.loginReqOptions = new RequestOptions({ headers: new Headers({ "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Basic " + btoa(this.basicAuth.username + ":" + this.basicAuth.password) }) });
        this.reqOptions = new RequestOptions({ headers: new Headers({ "Content-Type": "application/json", "Authorization": "Basic " + 'ZGFzaGJvYXJkOnMzc3Npb25nM3RrM3k=' }) });
    }

    private reqOptions: any;
    private loginReqOptions: any;

    private url: string;
    private realtorData: Subject<any> = new ReplaySubject<any>(1);

    /**
     * [dataPlatform Account Group$ description]
     * @return {Observable<any>} [description]
     */
    get realtorData$(): Observable<any> {
        return this.realtorData.asObservable();
    }

    /**
     * Reset User Data
     */
    public resetRealtorData(): void {
        this.realtorData = new ReplaySubject<any>(1);
    }

    /**
     * Login user
     */
    login(user): Observable<any> {
        this.basePath = 'https://rest.automabots.com/v1/users/auth?';
        let data = JSON.stringify(user);
        let url = this.basePath + 'username=' + user.name + '&password=' + user.password + '&apikey=C3FgUPt7P6Z0cWU7EfX1';
        return this.http.post(url, data, this.loginReqOptions)
            .map(x => x.json())
    }

    /**
     * Is LoggedIn user
     */
    isLoggedIn() {
         let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let realtorObject = JSON.parse(localStorage.getItem('realtorObject'));
        if (currentUser && currentUser.realtor_id && realtorObject) {
            this.config.realtorId = currentUser.realtor_id;
            this.config.realtorObject = realtorObject;
            return true;
        } else {
            if(this.config.user_type === 'client') {
                if(this.config.realtorId && this.config.realtorObject) {
                    return true;
                } else {
                   return false;
                }  
            } else if(this.config.user_type === 'staff') {
                return true;
            } else {
                return false;
            }
        }
    }

    getRealtorDatafromId(): Observable<any> {
        if (this.config.realtorId) {
            this.basePath = 'https://dev.automabots.com/v1/realtors/';
            this.url = this.basePath + this.config.realtorId + '?accesskey=' + this.config.accesskey;
            return this.http.get(this.url, this.reqOptions)
                .map(x => x.json());
        }
    };

    updateRealtorData(data): Observable<any> {
        this.basePath = 'https://dev.automabots.com/v1/realtors/';
        this.url = this.basePath + this.config.realtorId;
        return this.http.put(this.url, data, this.reqOptions)
            .map(x => x);
    };

    getUserDatafromId(userId): Observable<any> {
        if(userId) {
            this.basePath = 'https://dev.automabots.com/v1/users/';
            this.url = this.basePath + userId + '?accesskey=' + this.config.accesskey + '&populate=sessions';
            return this.http.get(this.url, this.reqOptions)
                            .map(x => x.json());
        }
    };

    getRealtorsName(): Observable<any> {
        if(this.config.user_type === 'staff') {
            this.basePath = 'https://dev.automabots.com/v1/realtors?projection=name';
            this.url = this.basePath;
            return this.http.get(this.url, this.reqOptions)
                .map(x => x.json());
        }
    };
}
