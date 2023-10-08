const dotenvv = require("dotenv")
dotenvv.config({ path:"./config.env" })
const app = require("./app")
const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE).then(con => {
   console.log("DB connection successfull...")
})

app.listen(process.env.PORT,()=>{
   console.log(`Server is listening...`)
})