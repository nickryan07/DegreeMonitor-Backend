import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import DDPRateLimiter from 'meteor/ddp-rate-limiter';
import _ from 'lodash';

// Deny all client-side updates to user documents
Meteor.users.deny({
    update() { return true; }
});

Accounts.onCreateUser((options, user) => {
    // add your extra fields here; don't forget to validate the options, if needed
    user.profile = {
        courses: options.courses,
        netID: options.username,
        firstName: options.firstName,
        lastName: options.lastName,
        hoursTaken: options.hoursTaken,
        currentGPA: options.currentGPA,
        major: options.major,
    }
    //console.log(options);
    return user;
});

Meteor.startup(() => {
    // code to run on server at startup
});
