
const showVotesBtn = document.getElementById("showVotesBtn");
const voteListContainer = document.getElementById("vote-list-container");
let votesVisible = true;

const submittedVotesContainer = document.getElementById("submittedVotesContainer");
const submittedVotesList = document.getElementById("submittedVotesList");


async function submit(){
    const voteInput = document.querySelector('input[name="vote"]:checked');
    const emailInput = document.getElementById("emailInput");

    
    if(!voteInput && emailInput.value===""){
        alert("Please select a vote option and an email");
    }
    else if(!voteInput){
        alert("Please enter select a vote option")
    }
    else if(emailInput.value===""){
        alert("Please enter your email")
    }
    else if(!isValidEmail(emailInput.value)){
        alert("Please enter a valid email")
    }
    else{
        const vote = voteInput.value;
        const email = emailInput.value;


        await fetch("/api/votes", {
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({email, vote})
        });  

        emailInput.value = ""
        voteInput.checked = false;
        

        alert("Submitted successfully")
    }

    fetchVotes();
}

const isValidEmail = (email) => {
    if(email.includes("@") && email.includes(".com")){
        return true
    }
    else{
        return false
    }
}
/*
async function emailUsed(email){
    const res = await fetch("/api/emails");
    const emails = res.json();
}
*/
showVotesBtn.addEventListener("click", () => {
    if(votesVisible){
        voteListContainer.style.display = "none";
        showVotesBtn.textContent = "Show votes";
        votesVisible=false;
    }
    else{
        votesVisible = true;
        showVotesBtn.textContent = "Hide votes";
        voteListContainer.style.display = "flex";
    }
});

async function fetchVotes(){
    const res = await fetch("/api/votes");
    const data = await res.json();

    submittedVotesList.innerHTML = data.map(v => `<li>${v.email}-${v.vote}</li>`).join("");

    updateCount()
}

async function updateCount() {
    const res = await fetch("/api/count");
    const data = await res.json();

    const totalCountSpan = document.getElementById("totalCountSpan");
    const blueCountSpan = document.getElementById("blueCountSpan");
    const redCountSpan = document.getElementById("redCountSpan");

    blueCountSpan.textContent = data.blueCount;
    totalCountSpan.textContent = data.totalCount;
    redCountSpan.textContent = data.redCount;
}

fetchVotes()