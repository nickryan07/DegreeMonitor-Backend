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
                "profile.firstName": options.firstName,
                "profile.lastName": options.lastName,
                "profile.hoursTaken": options.hoursTaken,
                "profile.currentGPA": options.currentGPA,
                "profile.major": options.major,
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
        //console.log(courseName, courseGrade);
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
    removeCourse(courseId) {
        Meteor.users.update({_id: this.userId}, {
            $pull : {
                "profile.courses" : { _id: courseId }
            }
        })
    },
    changeDates(dates) {
        Meteor.users.update({_id: this.userId}, {
            $set : {
                "profile.advisingDates.censusDate": dates.censusDate,
                "profile.advisingDates.dropDate": dates.dropDate,
                "profile.advisingDates.advisingDate": dates.advisingDate,
                "profile.advisingDates.startDate": dates.startDate,
                "profile.advisingDates.graduationDate": dates.graduationDate,
                "profile.advisingDates.finalsDate": dates.finalsDate,
            }
        })
    },
    updateAdvisingSemester(data) {
        Meteor.users.update({_id: this.userId}, {
            $set : {
                "profile.semestersAdvising.semesterName": data.semesterName,
                "profile.semestersAdvising.semesterYear": data.semesterYear,
            }
        })
    }
});

Accounts.onCreateUser((options, user) => {
    // add your extra fields here; don't forget to validate the options, if needed
    user.profile = {
        courses: [],
        netID: options.username,
        firstName: options.firstName,
        lastName: options.lastName,
        hoursTaken: options.hoursTaken,
        currentGPA: options.currentGPA,
        major: options.major,
        semestersGPA: [],
        semestersAdvising: {
            semesterName: '',
            semesterYear: '',
        },
        advisingDates: {
            startDate: '',
            censusDate: '',
            dropDate: '',
            advisingDate: '',
            graduationDate: '',
            finalsDate: '',
        }
    }
    //console.log(options);
    return user;
});

Meteor.startup(() => {
    // code to run on server at startup
});
