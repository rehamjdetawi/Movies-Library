'use strict';

const express=require('express');
const cors=require('cors');
const data =require(`./data.json`)

const server=express();
server.use(cors());
server.get('*',handelNotFound);
function handelNotFound(req,res){
    return res.status(404).send('This page does not exist :/ ')}

function Movie(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

server.get('/homepage',handel);
function handel(req,res){
    
        let obj=new Movie(data.title,data.poster_path,data.overview);
        return res.status(200).send(obj);

    
}
server.get('/favorite',handelfavourite)
function handelfavourite(req,res){
    console.log('favorite')
    return res.status(200).send("Welcome to Favorite Page");
}
server.get('/error',handelerror);
function handelerror(req,res){
    let ob={"status":"500",
    "responseText": "Sorry, something went wrong"}
    console.log(ob);
    return res.status(500).send(ob);
}




server.listen(3000,()=>{

    console.log("hello world")
})