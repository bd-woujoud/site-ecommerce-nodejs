const supertest = require("supertest");
const product= require('../models/productModel')
const app = require('../newserver');



test("create product test", async () => {
    const data = { 

    name : "sssss",
    price: 5336564,
    description:"jghfdshjbgf",
    image:"azerty"

   }

    await supertest(app).post("/product/addproduct")
      .send(data)
      .expect(200)
      .then(async (response) => {
            // Check the response
        console.log('response',response.body.data)
        expect(response.body.data._id).toBeTruthy();
        expect(response.body.data.name_product).toBe(data.name_product);
        expect(response.body.data.id_product).toBe(data.id_product);
  
       // Check data in the database
        const post = await product.findOne({ _id: response.body.data._id });
       console.log('post',post);
        expect(post.name_product).toBe(data.name_product);
      });
  });

test("GET all products", async () => {
    const post = await product.create({   name_product : "sssss", type_product : "santé"});
  
    await supertest(app).get("/product/allproduct")
      .expect(200)
      .then((response) => {
          console.log('get',response.body.data)
        // Check type and length
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toEqual(1);

        // Check data

        expect(response.body.data[0]._id).toBeTruthy;
        expect(response.body.data[0].name_product).toBe(post.name_product);
        expect(response.body.data[0].type_product).toBe(post.type_product);
        
      });
  });



test("GET product by id", async () => {

  const post = await product.create ({ name_product : "sssss",type_product : "santé"});
  
    await supertest(app).get(`/product/getproductbyid/${post.id}`)
     .expect(200)
     .then((response) => {console.log('getID',response.body.data);
     expect(response.body.data._id).toBe(post.id);

             expect(response.body.data.name_product).toBe(post.name_product);
             expect(response.body.data.type_product).toBe(post.type_product);
    
    });
  });


test("update by id", async () => {
  
  const post = await product.create({  name_product : "sssss", type_product : "santé" });
  const data = { name_product: "alaai",type_product : "public"};

  await supertest(app).put( "/product/updateproduct/" +post.id)
    .send(data)
    .expect(200)
    .then(async (response) => {
      console.log('get',response.body.data)

      // Check the response
      expect(response.body.data._id).toBe(post.id);
     
       expect(response.body.data.name_product).toBe(post.name_product);
       expect(response.body.data.type_product).toBe(post.type_product);
     
     //  Check the data in the database

      const newPost = await product.findOne({ _id: response.body.data._id });
      expect(newPost).toBeTruthy();
      
      expect(newPost.name_product).toBe(data.name_product);
      expect(newPost.id_product).toBe(data.id_product);

   
});
});



test("DELETE by id", async () => {
  const post = await product.create({
   name_product : "sssss", type_product : "santé"

  });

  await supertest(app)
    .delete("/product/deleteproduct/" + post.id)
    .expect(200)
    .then(async () => {

      expect(await product.findOne({ _id: post.id })).toBeFalsy();
  
    });

});