const express = require('express')
const db = require('./config/database')
const bodyParser=require('body-parser')
var swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./config/swagger.json');
const path = require('path')
var cors = require('cors')
const port = 5000
const app = express()
app.use(cors())
const server = require('http').createServer(app)
const io = require('socket.io')(server /* ,{cors:{origin:'*'}} */ )
app.set('secretKey','bootcamp')
app.get('/home',(req,res)=>{ 
    res.sendFile(path.join(__dirname,"./views/index.html"))
})


        //socket.on   just for this user
          //io.emit     for all user
          //socket.boradcast.emit     for all user without the current one

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


const userRouter=require('./routers/userRouter');
const productRouter=require('./routers/productRouter');
const categorieRouter=require('./routers/categorieRouter');
const subcategorieRouter=require('./routers/subcategorieRouter');
const commandeRouter=require('./routers/commandeRouter');
const sellerRouter=require('./routers/sellerRouter');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/seller',sellerRouter);
app.use('/subcategorie',subcategorieRouter);
app.use('/users',userRouter);
app.use('/product',productRouter);
app.use('/categorie',categorieRouter);
app.use('/commande',commandeRouter);

app.get('/getfile/:image', function(req,res){
  res.sendFile(__dirname + '/upload/' + req.params.image)//pour afficher limage:hezni lel dossier upload wafichili limage
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req,res, next) {
    let err = new Error();
       err.status = 404;
       next(err);
   });
   // handle errors
   app.use(function(err, req, res, next) {
    console.log(err);
     if(err.status === 404)
      res.status(404).json({message: " Path Not found"});
     else 
       res.status(500).json({message: "Something looks wrong "});
   });


  io.on('connection',(socket)=>{

    console.log('new user connected',/*socket.id*/)

    socket.on('sendMsg',()=>{

        io.to("myRoom").emit('newMsg');
    });
    socket.on('joinRoom',()=>{


       socket.join("myRoom");
    });

      
      });

       /* socket.on('clientEvent',(data)=>{

        console.log('event recieved',data);

      });

      socket.emit('serverEvent');*/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.listen(port,console.log(`server is running at localhost:${port}`));
//module.exports=app