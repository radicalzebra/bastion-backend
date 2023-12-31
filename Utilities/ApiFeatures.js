class ApiFeatures {

   constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

   filter() {

      const excludedFields = ["sort","limit","fields"]
      const queryObj = {...this.queryString}

      excludedFields.forEach(el => delete queryObj[el])

      //implementing so that values with undefined will be ignored
      Object.keys(queryObj).forEach(key => {

          if (queryObj[key] === "undefined" || queryObj[key].gte === "undefined"  || queryObj[key].lte === "undefined" || queryObj[key].gt === "undefined" || queryObj[key].lt === "undefined") {
            return  delete queryObj[key];
          }

      });

      

      //Advance Filtering
      let queryStr = JSON.stringify(queryObj)
      queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`))



      this.query = this.query.find(queryStr)

      return this
   }

   sort() {

      if (this.queryString.sort) {
         const sortBy = this.queryString.sort.split(',').join(' ');
         this.query = this.query.sort(sortBy);
      } else {
         this.query = this.query.sort('rating price -createdAt');
      }

      return this;
   }


   limitFields() {

      if (this.queryString.fields) {
         const fields = this.queryString.fields.split(',').join(' ');
         this.query = this.query.select(fields);
      } else {
         this.query = this.query.select('-__v');
      }

      return this;
   }
}

module.exports = ApiFeatures
