import { Component, OnInit, HostListener } from '@angular/core';
import { RealtorService } from '../../shared/realtorService';
import * as moment from 'moment';

import * as _ from 'lodash';

export class SelSession {
  public dialogue : any[];
  constructor(
    dialogue?: any[]
  ){
  }
}

@Component({
  selector: 'app-conversations',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

  sessionsData: any = [];
  usersData: any = [];
  public sel_session = {dialogue: []};
  public sel_user: any = [];

  public height: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight - 105 +'px';
  }

  public avatarDataSquare: any = {
        size: 150,
        //        background: '#F39C12', // by default it will produce dynamic colors
        fontColor: '#FFFFFF',
        border: "2px solid #d3d3d3",
        isSquare: true,
        text: "Rajan Gunasekaran"
    };

  constructor( private realtorService: RealtorService ) {
    this.loadRealtorsData();
    this.height = window.innerHeight - 55 +'px';
  }

  ngOnInit() {
    this.sel_session = new SelSession();
  }

  getMessageInfo(session) {
    this.getSelectedUserfromSession(session);
    this.sel_session = session;
  }

  public loadRealtorsData():void {
    this.realtorService.realtorsData$.subscribe(data => {
      console.log('data ', data);
      this.parseSessionData(data);
    });
    this.realtorService.getDetailedRealtorData();
  }

  private parseSessionData(data:any) {
    let self = this;
    let parsedData = data.docs[0];
    let sessionsData = data.docs[0].sessions;
    let usersData = data.docs[0].users;
    _.each(sessionsData, function(_session) {
        let matchingUser = _.find(usersData, function (_user) {
          return _user.senderId === _session.senderId;
        });
        if (matchingUser && !matchingUser.user_color) {
          matchingUser.user_color = self.getRandomColor();
        }
        _session.user_name = matchingUser && matchingUser.name && matchingUser.name.length > 0 ? matchingUser.name : 'Unknown';
        _session.user_color = matchingUser ? matchingUser.user_color : self.getRandomColor();
        let _lm = _session.dialogue.length > 0 ? _session.dialogue[_session.dialogue.length -1].messages[0]._text : '';
        let ellipsis = _lm.length > 30 ? '...' : '';
        _session.last_message = _lm.substring(0, 25) + ellipsis;
        _session.time_ago = moment(parseInt(_session.lastQuery)).fromNow();
    });
    this.sessionsData = sessionsData.reverse();
    this.usersData = usersData;
  }

  // private getLastUserMessage(dialogue:any) {
  //   let _lm = '';
  //   let lastMessage = _.findLast(dialogue, function(_dl) { 
  //     console.log('_dl ', _dl);
  //     return _dl.sender == 'user'; 
  //    });
  //   if (lastMessage && lastMessage.messages.length > 0) {
  //     _lm = lastMessage.messages[0]._text;
  //   }
  //   return _lm;
  // }

  private getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public getSelectedUserfromSession(session):void {
      for (let i = 0; i < this.usersData.length; i++) {
        if(session.user === this.usersData[i]._id) {
          this.sel_user = this.usersData[i];
        }
      }
  }

  public loadUserfromSession(session):void {
    this.realtorService.realtorData$.subscribe(data => {
      this.usersData = [];
    });
    this.realtorService.getRealtorfromId();
  }
}
