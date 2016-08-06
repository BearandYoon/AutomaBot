export class Config {
    static id = "config";
    constructor() {}

    name = "Name";
    appName = "ApplicationName";
    version = "1.0.0-alpha";
    api = "https://dev.automabots.com/v1/";
    accesskey = 's3ssiong3tk3y';
    realtorId = "";
    user_type = '';
    realtors: Array<{ _id : string, name : string }>
    realtorObject: any[];
    facebook_appId = '300159316999844';
}
