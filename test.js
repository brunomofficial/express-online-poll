const Database = require("better-sqlite3");
const db = new Database("poll.db");

const emailsQuery = db.prepare("SELECT email FROM votes").all();
    const emails = []
    for(let email of emailsQuery){
        emails.push(email.email)
    }
    const newVote =  {
        email : "a.lice@gmail.com",
        vote : "red",
    }

    if(emails.includes(newVote.email)){
        console.log("email used")
    }
    else{
        console.log("okay")
    }

    console.log(emails)

db.close();