import { Component, OnInit } from '@angular/core';

export class User {
  name: string;
  sex: string;
  address: string;
  phone: string;
  avatar: string;
}

export class Message {
  title: string;
  body: string;
  user: User;
}

@Component({
  selector: 'app-conversations',
  templateUrl: './msg_place.component.html',
  styleUrls: ['./msg_place.component.scss']
})

export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  sel_message: Message;

  constructor() { 
    this.sel_message = new Message(); 
  }

  ngOnInit() {
    this.messages = [{
      title: 'message1',
      body: 'This is a message1.',
      user: {
        name: 'user1',
        sex: 'male',
        address: 'address1',
        phone: '123456789',
        avatar: '../././assets/img/avatars/1.jpg'
      }
    },
    {
      title: 'message2',
      body: 'This is a message2.',
      user: {
        name: 'user2',
        sex: 'male',
        address: 'address2',
        phone: '123456789',
        avatar: '../././assets/img/avatars/2.jpg'
      }
    },
    {
      title: 'message3',
      body: 'This is a message3.',
      user: {
        name: 'user3',
        sex: 'female',
        address: 'address3',
        phone: '123456789',
        avatar: '../././assets/img/avatars/3.jpg'
      }
    }];

    this.sel_message = this.messages[0];
    console.log('messages = ', this.messages);
  }

  showMessage(message) {
    // console.log('selected Message = ', message);
    this.sel_message = message;
    // console.log('show Message = ', this.sel_message);
  };
}
