const dotenv = require("dotenv")
dotenv.config({ path:"./config.env" })
const mongoose = require("mongoose")
const app = require("./app")

// mongoose.connect(process.env.DATABASE).then(con => {
//    console.log("DB connection successfull...")
// })

// const server = app.listen(process.env.PORT,()=>{
//    console.log(`Server is listening...`)
// })



mongoose.connect(process.env.DATABASE).then(con => {
   console.log("DB connection successfull...")
})


const server = app.listen(process.env.PORT,()=>{
   console.log(`Server is listening...`)
})


process.on("unhandledRejection" , (err) => {
   console.log("UNHANDLED REJECTION 🔥🔥🔥. Shutting down...")
   console.log(err.name,err.message)
   server.close(() => {
      process.exit(1)
   })
})
