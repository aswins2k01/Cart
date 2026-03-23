class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    let keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });

    return this;
  }

  // also used to filter the category (productModel.find({category: Laptops})
  filter() {
    let queryStrcopy = { ...this.queryStr };
    // console.log(queryStrcopy);
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryStrcopy[field]);
    let queryString = JSON.stringify(queryStrcopy);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)/g,
      (match) => `$${match}`,
    );
    //   console.log(queryString);

    //  let filterObj= JSON.parse(queryString)
    //  if(filterObj.price){
    //     Object.keys(filterObj.price).forEach(key=>{
    //         filterObj.price[key]= Number(filterObj.price[key])
    //     })
    //  }
    //  this.query= this.query.find(filterObj)
    //   console.log("Final Filter:", this.query.getQuery())
    //  console.log(queryString);
    this.query = this.query.find(JSON.parse(queryString));
    // console.log(this.query); // returns a big object
    return this;
  }

  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}
module.exports = ApiFeatures;
