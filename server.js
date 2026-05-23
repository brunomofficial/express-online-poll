const express = require("express");
const app = express();
const port = 8000;
app.use(express.json());
app.use(express.static("."));


const Database = require("better-sqlite3");
const db = new Database("poll.db");

let exampleVotes = [
    {email:"example@gmail.com", vote:"red"},
    {email:"example2@gmail.com", vote:"blue"},
    {email:"example3@gmail.com", vote:"red"}
]

const addVote = (newVote) => {
    insert = db.prepare("INSERT INTO votes (email, vote, submitTime) VALUES (?,?,?)");
    insert.run(newVote.email, newVote.vote, newVote.submitTime);
}


app.get("/api/votes", (req, res)=>{
    let allVotes = db.prepare("SELECT * FROM votes").all()
    res.json(allVotes);
});

app.get("/api/emails", (req,res)=>{
    let emails = db.prepare("SELECT email FROM votes")
})

app.get("/api/count", (req, res)=>{
    let totalCountQuery = db.prepare("SELECT voteId FROM votes").all()
    let totalCount = totalCountQuery.length;

    let blueCountQuery = db.prepare("SELECT voteId FROM votes WHERE vote = 'blue'").all();
    let blueCount = blueCountQuery.length;

    let redCountQuery = db.prepare("SELECT voteId FROM votes WHERE vote = 'red'").all();
    let redCount = redCountQuery.length;

    res.json({totalCount:totalCount, blueCount: blueCount, redCount: redCount})
})

app.post("/api/votes", (req, res)=>{
    const now = new Date()

    const newVote =  {
        email : req.body.email,
        vote : req.body.vote,
        submitTime: now.toLocaleString()
    }

    const emailsQuery = db.prepare("SELECT email FROM votes").all();
    const emails = []
    let emailUsed;
    for(let email of emailsQuery){
        emails.push(email.email)
    }

    if(emails.includes(newVote.email)){
        emailUsed = true
    }

    if(emailUsed){
        return res.status(409).json({
            success : false,
            message : "This email has already been used",
            errorCode : "EMAIL_ALREADY_USED"
        });
    }
    else{
        addVote(newVote)
        res.status(201).json(newVote);
    }
    
})

app.listen(port, ()=>{
    console.log(`Listening at port ${port}`);
});

