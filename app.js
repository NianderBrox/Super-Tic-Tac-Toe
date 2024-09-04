const express = require("express");
const fs = require("fs");
const path =require("path");
const app = express();
const port = 80;

//Serving Static Files 
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded());

//Serving Static Files
app.get("/",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,"Public","HTML","welcome.html"));
})

app.post("/",(req,res)=>{
    fs.writeFileSync("./Public/Database/db.txt",JSON.stringify(req.body));
    res.status(200).sendFile(path.join(__dirname,"Public","HTML","index.html"));
})

app.get("/play",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,"Public","HTML","index.html"));
})

app.get("/db.txt",(req,res)=>{
    const names =fs.readFileSync("./Public/Database/db.txt");
    res.status(200).type('json').send(names);
})

app.get('/html/', (req, res) => {
    const filePath = path.join(__dirname, 'Public','HTML',"index.html");

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading the file');
            return;
        }

        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
    });
});

app.get("/css",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,"Public","CSS","style.css"));
})

app.get("/js",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,"Public","JS","program.js"));
})


//Server Listening
app.listen(port,()=>{
    console.log("The Server is listening on http://localhost:80/");
})