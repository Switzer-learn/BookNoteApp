import e from "express";
import bodyParser from "body-parser";
import pg from "pg";
import ejs from "ejs";
import axios from "axios";

const app=e();
const port=3000;
const apiUrl="https://covers.openlibrary.org/b/isbn/";
let passedId=0;

const db=new pg.Client({
    user:"postgres",
    password:"123456",
    host:"localhost",
    database:"BookThatIRead",
    port:5432
})

db.connect();

async function fetchBookData(){
    const result = await db.query("SELECT * FROM Books");
    return result.rows;
}

async function fetchUserData(username,password){
    try {
        const result = await db.query("SELECT * FROM Book_User WHERE username=$1 AND password=$2",[username,password]);
        return result.rows;    
    } catch (error) {
        return [];
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(e.static("public"));

app.get("/",async(req,res)=>{
    const data= await fetchBookData();
    let result=[];
    data.forEach(item=>(result.push(item)));
    res.render("index.ejs",{books:result});
})

app.get("/booklist",async(req,res)=>{
    const data = await fetchBookData();
    let result=[];
    data.forEach(item=>(result.push(item)));
    res.render("booklist.ejs",{books:result});
})

app.post("/edit",async(req,res)=>{
    const id = parseInt(req.body.id);
    //console.log(id);
    try {
        const data = (await db.query("SELECT * FROM books WHERE id=$1",[id])).rows;
        //console.log(data);    
        res.render("new.ejs",{book:data});
    } catch (error) {
        console.log(error);
    }
})

app.post("/editBook",async(req,res)=>{
    //console.log("editbook route");
    const data=req.body;
    try {
        await db.query("UPDATE books SET title=$1,description=$2,summary=$3,personal_note=$4,isbn=$5 WHERE id=$6",[data.title,data.description,data.summary,data.personalNote,data.isbn,data.id]);
        passedId=data.id;
        res.redirect("/detail");
    } catch (error) {
        console.log(error);
    }
})

app.get("/detail", async(req,res)=>{
    try {
        const data = (await db.query("SELECT * FROM books WHERE id=$1",[passedId])).rows; 
        res.render("details.ejs",{book:data});
    } catch (error) {
        console.log(error);
    }
})

app.post("/detail",async(req,res)=>{
    const id = req.body.id;
    try {
        const data = (await db.query("SELECT * FROM books WHERE id=$1",[id])).rows;
        res.render("details.ejs",{book:data});
        passedId=0;
    } catch (error) {
        console.log(error);
    }
})

app.post("/delete",async(req,res)=>{
    const id=req.body.id;
    try{
        await db.query("DELETE FROM books WHERE id=$1",[id]);
        res.redirect("/");
    }catch(error){
        console.log(error);
    }
})

app.post("/submit",async(req,res)=>{
    const data=req.body;
    try {
        await db.query("INSERT INTO books(title,description,summary,personal_note,isbn) VALUES ($1,$2,$3,$4,$5)",[data.title,data.description,data.summary,data.personalNote,data.isbn]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
})

app.get("/new",(req,res)=>{
    res.render("new.ejs");
})

app.listen(port,(err,res)=>{
    console.log(`Server running on port ${port}`);
    if(err){
        console.log(err);
    }
})
