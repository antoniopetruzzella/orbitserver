var http = require('http');
var fs = require('fs');

const express=require('express');
const net = require('net');
var cors = require('cors')
const app=express();
app.use(cors());
port=8080; //http://localhost:8080/parametro/p;
var commands=[];
var counter;
var datatoreturn=null;
const client =net.createConnection({port:37777,host:'localhost'},()=>{//ATTENZIONE SE PERDE IP...'192.168.2.10', NON E' VERO, COSì FUNZIONA NEL SETUP RASPBERRY+PC CON I LORO IP


    console.log('connected to server!');
    //var command ="ORB:ToggleHudColor\r\n";
    //var command='SHIP:FOCUS:SetEngineGrpLevel:0:1\r\n';
    //var command="subscribe:4:ship:focus:apsettings";
    counter=0;
    //qui sto creando un array di comandi che vengono poi processati in 
    commands.push("nav:focus:elements2");
    commands.push("nav:iss:elements2");
    commands.push("ship:focus:accel");
    
      
       // Invia dati al server
  });

app.get("/parametro/:parametro",(req,res)=>{ 
  //console.log(pet);
  //non venendo gestito "parametro", tutto viene restituito  
  res.send(datatoreturn);
  
   
});



  app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
  });

client.on('data', (data) => {
  datatoreturn=data;  
  console.log('Ricevuto dal server:', data.toString());
    //apsettingsarray=data.toString();
    //pet=apsettingsarray.split(",")[19];
    //console.log('Ricevuto dal server:', pet);
  });

  client.on('error', (err) => {
    console.error('Errore di connessione:', err);
  });
  
client.on('close', () => {
    console.log('Connessione chiusa');
  });

setInterval(()=>{//funzione principale che scrive i dati sulla porta 37777
  
  command=commands[counter]+"\r\n";
  
  //var elements2command="nav:focus:elements2"+"\r\n";
  //var apsettingscommand="ship:focus:apsettings"+"\r\n";
  //var accellcommand="ship:focus:accel"+"\r\n";
  client.write(command,(result)=>{
    
    if(result){
        console.log(result);
        
    }else{

            
          
    }
})
counter=(counter==commands.length-1)?0:counter+1;

},100)

http.createServer(function (req, res) {
  fs.readFile('client.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(80,'localhost');
  
