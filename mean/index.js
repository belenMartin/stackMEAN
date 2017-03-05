var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var http = require("http");
var server = http.createServer(app);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notaSchema = new Schema({
    idNota:Number,
    nombre:String
});

var db = "misNotas";

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride());

mongoose.connect("mongodb://localhost:27017/misNotas",function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Conectado a MongoDB');
    }
});

var notas = mongoose.model('nota',notaSchema);

app.get("/crearNota",function(req,res){
   res.sendFile(__dirname+"/public/index.html");
});

app.get("/notas",function(req,res){
   notas.find(function(err,nota){
     if(err){
         res.status(500).send(err.message);
     }
     if(!nota.length){
       console.log("No hay nada que mostrar");
     }
     if(nota.length){
       console.log("Hay algo que mostrar");
     }
     console.log(nota);
     //res.status(200).json(nota);
     nota.forEach(function(item,index){
       res.write("<p style='border:1px solid black;width:150px;height:150px;background-color:yellow;'>"+item.nombre+"</p><br>");
     });
     res.end();
   });
});

app.post("/addNota",function(req,res){
  console.log(req.body.nombre);
  var note = new notas({
    idNota:req.body.id,
    nombre:req.body.nota
  });
  note.save(function(err,note){
    if(err){
        res.status(500).send(err.message);
    }
    console.log(typeof(note));
    res.status(200).send("Nota creada con éxito&nbsp;&nbsp;&nbsp;<a href='/crearNota'>Volver al formulario</a>");
  });
});

app.post("/actualizarNota",function(req,res){
  notas.findOne({"idNota":req.body.id},function(err,note){
    note.nombre = req.body.nombre;
    note.save(function(err){
      if(err) return res.status(500).send(err.message);
      res.status(200).send("Nota modificada con éxito&nbsp;&nbsp;&nbsp;<a href='/crearNota'>Volver al formulario</a>");
    });
  });
});

app.post("/borrarNota",function(req,res){
  notas.findOne({"idNota":req.body.id},function(err,note){
    note.remove(function(err){
    if(err) return res.status(500).send(err.message);
    res.status(200).send("Nota eliminada con éxito&nbsp;&nbsp;&nbsp;<a href='/crearNota'>Volver al formulario</a>");
    });   
  });
});

app.listen(8080,function(){
  console.log('App escuchando en puerto 8080');
});
