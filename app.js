const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const client = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){
    res.sendFile( __dirname + "/signup.html")
})

// This allows me to access my static files in the "public" folder:
app.use(express.static("public"))

app.post("/", function(req, res){
    var firstName = req.body.fName
    var lastName = req.body.lName
    var email = req.body.email

    console.log(firstName + " " + lastName + " " + email)

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data)

    const server = "us10"
    const listId = "c24e10a87d"
    const myApiKey = "a72ed236abbc8aef97f7f36ce7cca13e-us10"


    client.setConfig({
    apiKey: myApiKey,
    server: server,
    });

    const run = async () => {
        const response = await client.lists.batchListMembers(listId, jsonData)
        console.log(response)

        if (response.total_created === 1){
            console.log(response.total_created)
            res.sendFile( __dirname + "/success.html")
        } else {
            res.sendFile( __dirname + "/failure.html")
        }

    };

    run();

})


app.post("/failure", function(req, res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Listening to Port 3000!")
})
