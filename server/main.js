import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import DDPRateLimiter from 'meteor/ddp-rate-limiter';
import _ from 'lodash';

// Deny all client-side updates to user documents
Meteor.users.deny({
    update() { return true; }
});

Meteor.methods({
    updateProfile(options) {
        Meteor.users.update({_id: this.userId}, {
            $set : {
                "profile" : { 
                    firstName: options.firstName,
                    lastName: options.lastName,
                    hoursTaken: options.hoursTaken,
                    currentGPA: options.currentGPA,
                    major: options.major,
                }
            },
        });
    },
    addSemester(semesterName, semesterYear) {
        Meteor.users.update({_id: this.userId}, {
            $push : {
                "profile.semestersGPA" : { 
                    _id : new Mongo.ObjectID(),
                    semesterName : String(semesterName),
                    semesterYear: String(semesterYear),
                    courses: [],
                }
            },
        });
    },
    removeSemester(semesterName, semesterYear) {
        Meteor.users.update({_id: this.userId}, {
            $push : {
                "profile.semestersGPA" : { 
                    _id : new Mongo.ObjectID(),
                    semesterName : String(semesterName),
                    semesterYear: String(semesterYear),
                    courses: [],
                }
            },
        });
    },
    addCourse(courseName, courseGrade, semesterId) {
        console.log(courseName, courseGrade);
        Meteor.users.update({_id: this.userId}, {
            $push : {
                "profile.courses" : { 
                    _id : new Mongo.ObjectID(),
                    courseName : String(courseName),
                    courseGrade: String(courseGrade),
                    semesterId: semesterId
                }
            },
        });
    },
    removeCourse(semesterName, semesterYear) {
        Meteor.users.update({_id: this.userId}, {
            $push : {
                "profile.semestersGPA" : { 
                    _id : new Mongo.ObjectID(),
                    semesterName : String(semesterName),
                    semesterYear: String(semesterYear),
                    courses: [],
                }
            },
        });
    },
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
        semestersGPA: [],
        semestersAdvising: [],
    }
    //console.log(options);
    return user;
});

Meteor.startup(() => {
    // code to run on server at startup
});
