class APIFunctionality{
    constructor(query,querystr){
        this.query=query,
        this.querystr=querystr
    }

    search(){
        const keyword=this.querystr.keyword?{
            name:{
                $regex:this.querystr.keyword,
                $options:"i" //case insensitive laptop Laptop LAPTOP
            }
        }:{};
        // console.log(keyword)


        this.query=this.query.find({...keyword});
        return this

        //    let q1 = Product.find(); // query object
        //    let q2 = q1.find({ category: "Shirts" }); // same object-ல் filter add பண்ணுது

        // this.query = Product.find()
        // this.query = this.query.find({...})
        // ⏩ It's like Product.find().find(...)
    }

    filter(){
        const queryCopy={...this.querystr};
        // console.log(queryCopy);

        const removeFields=['keyword','page','limit'];
        removeFields.forEach(key=>delete queryCopy[key])
        // console.log(queryCopy)
        this.query=this.query.find(queryCopy)
        return this
    }

    pagination(resultPerPage){
        const currentPage=Number(this.querystr.page) || 1;
        // console.log(currentPage)
        const skip=resultPerPage*(currentPage-1);

        //ex cP=3 rPP=10 10*(3-1) = 20product skip
        //currently im in 3rd page each page 10 product so 3rd page strat with 21st product
        this.query=this.query.limit(resultPerPage).skip(skip)
        return this

    }
}
module.exports=APIFunctionality;