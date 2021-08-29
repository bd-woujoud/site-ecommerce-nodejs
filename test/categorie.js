const supertest = require("supertest");
const categorie= require('../models/categoriemodel')
const app = require('../newserver');



test("create categorie test", async () => {
    const data = { 

    name_categorie : "sssss",
    id_categorie : "santé"

   }
  
    await supertest(app).post("/categorie/addcategorie")
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        console.log('response',response.body.data)
        expect(response.body.data._id).toBeTruthy();
        expect(response.body.data.name_categorie).toBe(data.name_categorie);
        expect(response.body.data.id_categorie).toBe(data.id_categorie);
  
       // Check data in the database
        const post = await categorie.findOne({ _id: response.body.data._id });
       console.log('post',post);
        expect(post.name_categorie).toBe(data.name_categorie);
      });
  });

test("GET all categories", async () => {
    const post = await categorie.create({   name_categorie : "sssss", type_categorie : "santé"});
  
    await supertest(app).get("/categorie/allcategorie")
      .expect(200)
      .then((response) => {
          console.log('get',response.body.data)
        // Check type and length
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toEqual(1);

        // Check data

        expect(response.body.data[0]._id).toBeTruthy;
        expect(response.body.data[0].name_categorie).toBe(post.name_categorie);
        expect(response.body.data[0].type_categorie).toBe(post.type_categorie);
        
      });
  });



test("GET categorie by id", async () => {

  const post = await categorie.create ({ name_categorie : "sssss",type_categorie : "santé"});
  
    await supertest(app).get(`/categorie/getcategoriebyid/${post.id}`)
     .expect(200)
     .then((response) => {console.log('getID',response.body.data);
     expect(response.body.data._id).toBe(post.id);

             expect(response.body.data.name_categorie).toBe(post.name_categorie);
             expect(response.body.data.type_categorie).toBe(post.type_categorie);
    
    });
  });


test("update by id", async () => {
  
  const post = await categorie.create({  name_categorie : "sssss", type_categorie : "santé" });
  const data = { name_categorie: "alaai",type_categorie : "public"};

  await supertest(app).put( "/categorie/updatecategorie/" +post.id)
    .send(data)
    .expect(200)
    .then(async (response) => {
      console.log('get',response.body.data)

      // Check the response
      expect(response.body.data._id).toBe(post.id);
     
       expect(response.body.data.name_categorie).toBe(post.name_categorie);
       expect(response.body.data.type_categorie).toBe(post.type_categorie);
     
     //  Check the data in the database

      const newPost = await categorie.findOne({ _id: response.body.data._id });
      expect(newPost).toBeTruthy();
      
      expect(newPost.name_categorie).toBe(data.name_categorie);
      expect(newPost.id_categorie).toBe(data.id_categorie);

   
});
});



test("DELETE by id", async () => {
  const post = await categorie.create({
   name_categorie : "sssss", type_categorie : "santé"

  });

  await supertest(app)
    .delete("/categorie/deletecategorie/" + post.id)
    .expect(200)
    .then(async () => {

      expect(await categorie.findOne({ _id: post.id })).toBeFalsy();
  
    });

});