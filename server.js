'use strict';
require('dotenv').config();
const express=require('express');
const cors=require('cors');
const data =require(`./ Movie Data/data.json`);
const { get } = require('express/lib/response');
const axios=require('axios')
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL)


const port =`${process.env.PORT}`;
let url=`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`


const server=express();
server.use(cors());
server.use(express.json());


function Movie(id,title,poster_path,release_date,overview){
    this.id=id;
    this.title=title;
    this.poster_path=poster_path;
    this.release_date=release_date;
    this.overview=overview;
}

server.get('/',handel);
function handel(req,res){
    
        let obj=new Movie(data.title,data.poster_path,data.overview);
        return res.status(200).send(obj);

    
}
server.get('/favorite',handelfavourite)
function handelfavourite(req,res){
    console.log('favorite')
    return res.status(200).send("Welcome to Favorite Page");
}

server.get('/trending',trendinghandler);
function trendinghandler(req,res){
    axios.get(url).then((result)=>{
        let arr=[];
        let movie = result.data.results.forEach((val,i)=>{
            if(i==0){
            var obj1 = new Movie(val.id,val.title,val.poster_path,val.release_date,val.overview);
            arr.push(obj1);}
            return arr;
        })
        res.status(200).send(arr);
        console.log(arr);
    }).catch((err)=>{
            handelerror(err,req,res);
})

}
server.get('/search',searchhandler);
function searchhandler(req,res){
    let url=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=Peter`
    axios.get(url).then(result=>{
        let arr=[];
        let movie = result.data.results.forEach((val,i)=>{
            if(i==0){
            var obj1 = new Movie(val.id,val.title,val.poster_path,val.release_date,val.overview);
            arr.push(obj1);}
            return arr;
        })
        res.status(200).send(arr);

    }).catch(err=>{
        handelerror(err,req,res);

    })
}
server.post('/addMovie',addMoviehandler)
function addMoviehandler(req,res){
    const movie=req.body;
    let sql=`INSERT INTO favMovie(title,poster_path,overview,release_date) VALUES($1,$2,$3,$4) RETURNING *;`
    let values=[movie.title,movie.poster_path,movie.overview,movie.release_date]
    client.query(sql,values).then(data =>{
        res.status(200).json(data.rows);
    }).catch(error=>{
        handelerror(error,req,res)
    });
}


server.get('/getMovies',getMoviehandler)

function getMoviehandler(req,res){
    let sql = `SELECT * FROM favMovie;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        handelerror(error,req,res)
    });
}

server.use(handelerror);
function handelerror(error,req,res){
   const err={
       status:500,
       message:error
 
    }
    res.status(500).send(err);
}

server.use('*',handelNotFound);
function handelNotFound(req,res){
    return res.status(404).send('This page does not exist :/ ')}

    client.connect().then(()=>{
        server.listen(port,()=>{
            console.log(`listining to port ${port}`)
        })
    })