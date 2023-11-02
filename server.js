const dotenvv = require("dotenv")
dotenvv.config({ path:"./config.env" })
const mongoose = require("mongoose")
const app = require("./app")

// mongoose.connect(process.env.DATABASE).then(con => {
//    console.log("DB connection successfull...")
// })

// const server = app.listen(process.env.PORT,()=>{
//    console.log(`Server is listening...`)
// })

let server

mongoose.connect(process.env.DATABASE).then(con => {
   server = app.listen(process.env.PORT,()=>{
   console.log(`Server is listening...`)
   })
   console.log("DB connection successfull...")
})



process.on("unhandledRejection" , (err) => {
   console.log("UNHANDLED REJECTION 🔥🔥🔥. Shutting down...")
   console.log(err.name,err.message)
   server.close(() => {
      process.exit(1)
   })
})
