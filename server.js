const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("css-images"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/", (req, res) => {
    const url = "https://us7.api.mailchimp.com/3.0/lists/4dbd9351d3";// this is the endpoint of the api
    var fName = req.body.firstname;
    var lName = req.body.lastname;
    var email = req.body.email;

    var emailData = {
        //here we are creating an object as the data we are giving back to mailchimp servers is required to be structuered format for it to be stored.
        members: [
            {
                email_address: email, //and mailchimp frequiers to send certain properties consisting of the paticular dat here email_address should 
                //contain data of the users email.If the property names are misplaced then there will be problem storing the data and recognizing it in mailchimp.
                status: "subscribed", //mailchimp requiers us to send aproperty called status which tells us a paticular user comest in which category
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName,
                },
            },
        ],
    };

    var jsonEmailData = JSON.stringify(emailData);// here we are converting the object "email data" to json  format as mailchimp requiers data in json

    const options = {// .request also takes something called options  which is a object and consits of certain properties
        method: "POST", // this a propert called method by default it is set to get which means it gives back info but if changed to post it sends the data.
        auth: "ApiKey:79747e30f406d4917ab48af5974a7520-us7",//this is the auth this should conatain the autehrntication key or the api key our api provided us but the key should be written in front of a custom name.
    };//throug this object the request method gets information about certain things.

     const sendData = https.request(url, options, (response) => {//here we are using a prebuilt node package http that helps us to connect with api and external server 
        //before we used to "get" method and get data from the api or external server but here we need to send data to the external server so we have to request and are using "request" method.
        //everything we want to send is a request and what we get back is response.
       if (response.statusCode === 200) {// now when people access the home page we send them the home file after we send the data to the api it gives a  response back to us it tells us if the data transfer was
        // a success or not so if it was success then i send them another response and i send a file called success.html to the same route.
           res.sendFile(__dirname + "/success.html")
       }
       else{
           res.sendFile(__dirname + "/failure.html")//if not i send them  a failure page.
       }
        response.on("data",(impData)=>{
        impData = JSON.parse(impData);
        })
    });
    //sendData.write(jsonEmailData);// send data consist of the whole request you want send to the api and by using write your sending the data present in brackets to the api as a request. As sendData conatains the code for requesting the api 
    // we are writting it inside as senddata and jsonemaildata is present at this function itself and cannot be used outside it.
    sendData.end();//and after this we are ending sendData which means stop sending data to the api as the data is sent.
});
app.post("/failure",(req,res)=>{//here when our website fails to suscribe a user we send him files of the failure page so when he is in it ther is a form that consist of the method post to the 
    // /failure route and we here we are catching the post that comes to this paticular route and when we get the request from the html file to the failure route that time we redirect them back to them home route. 
    res.redirect("/")// this takes the user back to the home route.
})


app.listen(process.env.PORT || 3000, () => {// we are using this weird method cause when we host our server the 
    //heroku server are gonna dynamically alocate a port and host our site so if we have 1 fixed port in our code than it will give us a error so by writting this method allows the website to listen to any port heruko server allocates us to
    console.log("sucssefully hosted the files locally to the port 3000");
});
//API key
//79747e30f406d4917ab48af5974a7520-us7

//mail chimp list id.
//4dbd9351d3 this is a string code knom as list  id that uniquely identifies your list and adds people to it.
