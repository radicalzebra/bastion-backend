const express = require("express");

const app = express();

app.get("/",(req,res)=>{
   res.status(200).json({
      message:"hello world",
      ok:"true"
   })
})

const port = 3000
app.listen(port,()=>{
   console.log(`Listening.....`)
})