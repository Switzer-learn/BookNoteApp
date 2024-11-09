import e from "express";
import bodyParser from "body-parser";
import pg from "pg";
import ejs from "ejs";
import axios from "axios";

const app=e();
const port=3000;
const apiUrl="https://covers.openlibrary.org/b/isbn/";

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

app.post("/detail",async(req,res)=>{
    const id = req.body.id;
    //console.log(id);
    try {
        const data = (await db.query("SELECT * FROM books WHERE id=$1",[id])).rows;
        //console.log(data);    
        res.render("details.ejs",{book:data});
    } catch (error) {
        console.log(error);
    }
    
    
})

app.get("/new",(req,res)=>{
    res.render("new.ejs");
})

app.post("/new",(req,res)=>{

})

app.listen(port,(err,res)=>{
    console.log(`Server running on port ${port}`);
    if(err){
        console.log(err);
    }
})
