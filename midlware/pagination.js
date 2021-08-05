

module.exports={

        paginatedResults:  function (model) {
            console.log("aaaaaaaaa");
        return async (req, res, next) => {
          console.log('paraaaaaaaaaaams',req.params);
          const page =  parseInt(req.params.page) 
          const limit = parseInt(req.params.limit) 
          const startIndex = (page - 1) * limit
          const endIndex = page * limit
          const results = {}
          if (endIndex < await model.countDocuments().exec()) {
            results.next = {
              page: page + 1,
              limit: limit
            }
          }
          if (startIndex > 0) {
            results.previous = {
              page: page - 1,
              limit: limit
            }
          }
          try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            console.log("eeeeeeeeeeeeeeeeee",results);
            res.json({msg:"proooood",data:results})
            // next()
          } catch (e) {
            res.status(500).json({ message: e.message })
          }
        }
      }
    /* paginatedResults : function (model) {

        return async (req, res, next) => {
      
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)
    
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const results = {}
    
        if (endIndex < await model.countDocuments().exec()) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }
        
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }
        try {
          results.results = await model.find().limit(limit).skip(startIndex).exec()
          res.paginatedResults = results
          next()
        } catch (e) {
          res.status(500).json({ message: e.message })
        }
    }
}
    */
    }