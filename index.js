import e from "express";
import bodyParser from "body-parser";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const app=e();
const port=3000;
const apiUrl="https://covers.openlibrary.org/b/isbn/";
let passedId=0;



async function fetchBookData(){
    const result = await supabase.from("books").select("*")
    return result;
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
    res.render("index.ejs",{books:data.data});
})

app.get("/booklist",async(req,res)=>{
    const data = await fetchBookData();
    res.render("booklist.ejs",{books:data.data});
})

app.get("/detail",async(req,res)=>{
    try{
        const data = await supabase.from("books").select("*").eq('id',passedId);
        passedId=0;
        res.render("details.ejs",{book:data.data})
    } catch (error){
        console.log(error);
    }
})

//This edit is to enter new.ejs passing data to be edited from details
app.post("/edit",async(req,res)=>{
    console.log("edit route",req.body);
    const id = parseInt(req.body.id);
    try {
        const data = await supabase.from("books").select("*").eq('id',id)
        res.render("new.ejs",{book:data.data})
    } catch (error) {
        console.log(error);
    }
})

app.post("/editBook",async(req,res)=>{
    const data=req.body;
    console.log("submitted data ",data);
    try {
        const {error} = await supabase.from("books").update({
            title:data.title,
            description:data.description,
            summary:data.summary,
            personal_note:data.personalNote,
            isbn:data.isbn
        }).eq('id',data.id);
        if(error)console.log(error)
        passedId = data.id;
        res.redirect("/detail")
    } catch (error) {
        console.log(error);
    }
})

app.post("/detail",async(req,res)=>{
    const id = req.body.id;
    try {
        const data = await supabase.from("books").select("*").eq('id',req.body.id);
        res.render("details.ejs",{book:data.data})
    } catch (error) {
        console.log(error);
    }
})

app.post("/delete",async(req,res)=>{
    const id=req.body.id;
    try {
        const {error} = await supabase.from("books").delete().eq("id",id);
        if(error) console.log(error);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
    /*try{
        await db.query("DELETE FROM books WHERE id=$1",[id]);
        res.redirect("/");
    }catch(error){
        console.log(error);
    }*/
})

app.post("/submit",async(req,res)=>{
    const data=req.body;
    try {
        const {error} = await supabase.from("books").insert({
            title:data.title,
            description:data.description,
            summary:data.summary,
            personal_note:data.personalNote,
            isbn:data.isbn
        }).returns();
        if(error){
            console.log(error)
        } else{
            console.log("Insert new book succeed!")
        }
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
