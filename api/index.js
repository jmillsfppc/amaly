const express = require('express')
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/userRouter')
const sellerRouter = require('./routers/sellerRouter')
const gigRouter = require('./routers/gigRouter')
const categoryRouter = require('./routers/categoryRouter')


// parsers //
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
dotenv.config({path : './config.env'})

//serve static files
app.use(express.static('public'))

// setup routers
app.use(userRouter);
app.use(sellerRouter);
app.use(gigRouter);
app.use(categoryRouter)


// connect to database
const db = process.env.DATABASE; 
const connectDB = () => {
         mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            //  useCreateIndex: true,
            // useFindAndModify: false,
        }).then(res => console.log('Database connected...'))
        .catch(err => console.log(err));
        
}
 
// listening to server //
const PORT = process.env.PORT;  
app.listen(PORT, () => {
    connectDB();
    console.log('server is running on ' + PORT)
})