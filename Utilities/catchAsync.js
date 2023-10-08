const catchAsync = (fn) => {
   return (req,res) => {
      fn(req,res).catch(err => console.log(err))
   }
}

module.exports = catchAsync;