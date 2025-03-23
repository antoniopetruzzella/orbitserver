const express=require('express');
const net = require('net');
const app=express();
port=8080;


 
const client =net.createConnection({port:37777,host:'192.168.2.10'},()=>{
    console.log('connected to server!');
    //var command ="ORB:ToggleHudColor\r\n";
    //var command='SHIP:FOCUS:SetEngineGrpLevel:0:1\r\n';
    
      
       // Invia dati al server
  });

app.get("/",(req,res)=>{
    res.send("un saluto a tutti");
});
app.get("/utente/:nome",(req,res)=>{
    console.log(req.params.nome);//si può sempre usare il vecchio req.query
    res.send(req.params.nome);
});

app.get("/comando/:command",(req,res)=>{ //FUNZIONA DA LOCALE E DA REMOTO: http://192.168.2.10:8080/comando/ORB:ToggleHudColor o quello che si vuole, http://192.168.2.10:8080/comando/ship:focus:apsettings che restituisce valori
    //var command ="ORB:ToggleHudColor\r\n";
    var command=req.params.command+"\r\n";
    client.write(command,(result)=>{
    
        if(result){
            console.log(result);
            res.send(result.toString());
        }else{
            console.log(client.address());
            console.log(client.bytesWritten);
            
            console.log(client.readyState)
            console.log("tutto bene");
            client.on('data', (data) => {
                console.log('Ricevuto dal server:', data.toString());
                
                res.send(data.toString());
                
              });
                
            //res.send('comando eseguito');  
        }
        }
    );
    /*client.write = function(command, callback){
        server.write(command+"\r\n");
        server.on('data', function (data) {
            //this data is a Buffer object
            callback(null, (data)=>{
                console.log('Ricevuto dal server:', data.toString());
                res.send(data.toString());
            })
        });
    
        server.on('error', function (error) {
            callback(error, null)
        });
    };*/
})

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
  });

client.on('data', (data) => {
    console.log('Ricevuto dal server:', data.toString());
  });

  client.on('error', (err) => {
    console.error('Errore di connessione:', err);
  });
  
client.on('close', () => {
    console.log('Connessione chiusa');
  });
  
