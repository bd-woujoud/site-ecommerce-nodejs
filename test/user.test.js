const supertest = require("supertest");
const User= require('../models/userModel')
const app = require('../newserver');
let refresh='',
userId='',
accessToken='',
resetLink=''
/*test unitaire*/

test("create user test", async () => {
    const data = { 
         "nom" : "sssss",
    "prenom" : "sssss",
    "email" : "pppp@gmail.com",
    "password" : "123",
    "phone" : 1236544788}
  
    await supertest(app).post("/users/addUser")
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBeTruthy();
        expect(response.body.data.nom).toBe(data.nom);
        expect(response.body.data.email).toBe(data.email);
  
        // Check data in the database
        const post = await User.findOne({ _id: response.body.data._id });

        //expect(post.email).toBe(data.email);
      });
  });

test("GET all users", async () => {
    const post = await User.create({ nom: "fifi",prenom:"aaaa",password:"123456" , email: "aaaaa@gmail.com" });
  
    await supertest(app).get("/users/getUser")
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toEqual(1);

        // Check data

        expect(response.body.data[0]._id).toBeTruthy;
        expect(response.body.data[0].nom).toBe(post.nom);
        expect(response.body.data[0].email).toBe(post.email);
        
      });
  });



test("GET user by id", async () => {
  const post = await User.create({ nom: "fifi",prenom:"aaaa",password:"123456" ,email: "aaaaa@gmail.com" });
  
  
    await supertest(app).get("/users/getUserById/" + post.id)
      .expect(200)
     .then((response) => {
     expect(response.body.data._id).toBe(post.id);
        expect(response.body.data.nom).toBe(post.nom);
      
     expect(response.body.data.prenom).toBe(post.prenom);
      });
  });


test("update by id", async () => {
  
  const post = await User.create({ nom: "fifi",prenom:"aaaa",password:"123456" ,email: "aaaaa@gmail.com" });
  const data = { nom: "ali", prenom: "kkkkkk" };

  await supertest(app).put("/users/updateUserById/"+post.id)
    .send(data)
    .expect(200)
    .then(async (response) => {

      // Check the response
      expect(response.body.data._id).toBe(post.id);
      expect(response.body.data.nom).toBe(post.nom);
      expect(response.body.data.prenom).toBe(post.prenom);

      //  Check the data in the database
      const newPost = await User.findOne({ _id: response.body.data._id });
      expect(newPost).toBeTruthy();
      expect(newPost.nom).toBe(data.nom);
      expect(newPost.prenom).toBe(data.prenom);

    });
});



test("DELETE by id", async () => {
  const post = await User.create({
    nom: "aliiii",
    prenom: "mhamad",
    password:"333333",
    email:"fezfezf@gmail.com"

  });

  await supertest(app)
    .delete("/users/deleteUserById/" + post.id)
    .expect(200)
    .then(async () => {

      expect(await User.findOne({ _id: post.id })).toBeFalsy();
  
    });

});

test("signin", async () => {
  
  const post = await User.create({ nom: "fifi",prenom:"aaaa",password:"123456" ,email: "aaaaa@gmail.com" });
  const data = {password:"123456",email: "aaaaa@gmail.com" };

  await supertest(app).post("/users/signin")
    .send(data)
    .expect(200)
    .then(async (response) => {
        refresh=response.body.refreshToken
        userId=response.body.user._id
        accessToken=response.body.accessToken
      // Check the response
      expect(response.body.accessToken).toBeTruthy();
      expect(response.body.user._id).toBe(post.id);
      expect(response.body.user.email).toBe(post.email);
      expect(response.body.user.password).toBe(post.password);

      //  Check the data in the database
      const newPost = await User.findOne({ email: response.body.user.email });
      expect(newPost).toBeTruthy();
      expect(newPost.email).toBe(post.email);
      expect(newPost.password).toBe(post.password);
    });
});


test("refreshtoken", async () => {


  const data = { _id: userId,
   refreshToken: refresh};

  await supertest(app).post("/users/refrech")

    .send(data)
    .expect(200)
    .then(async (response) => {
      //Check the response
      expect(response.body.accesstoken).toBeTruthy();
    });
});

test("logout", async () => {
  const data = {refreshToken : refresh};
  const headers = {"x-access-token": accessToken }; // elle va verifier si header contient accesstoken ou nn (ecriture de setup header)
  console.log('accessToken',accessToken);
  await supertest(app).post("/users/logout")
  .set(headers) //pour seter le  header déclaré
    .send(data)
    .expect(200)
    .then(async (response) => {
      // Check the response
console.log(response.body);
    });
});



test("send mail", async () => {
  
  const data = {from:"wwwwboudhina@gmail.com", to: "wejdenbdn94@gmail.com",subject:'aaaaaaaaa' , text: 'That was easy!'};

  await supertest(app).post("/users/sendMail")
    .send(data)
    .expect(200)
    .then(async (response) => {
console.log('aaaaaaa',response.body);
      
 expect(response.body.message).toBe('Email Sent');

    });
});


test("forget password", async () => {

  const post =await User.create({ nom: "aliiii", prenom: "mhamad", email:"wejdenbdn94@gmail.com" , password:"333333" });

  const data ={email:post.email}
await supertest(app).post("/users/forgotPass")
    .send(data)
    .expect(200)
    .then(async (response) => {
      console.log('resForgetPassword',response.body);
     resetLink=response.body.data//il faut l'exporter pour l'utiliser dans la fction reset password
      // Check the response
     
     expect(response.body.status).toBe('Success')

});
});


test("reset password",async() => {

  const post =await User.create({ nom: "aliiii", prenom: "mhamad", email:"wejdenbdn94@gmail.com" , password:"333333" ,resetLink/*eli fel model*/:resetLink/*declaré lfou9*/});

  const data ={resetLink:post.resetLink,newPass:123456789}

await supertest(app).post("/users/resetPass")
    .send(data)
    .expect(200)

    .then(async (response) => {
      console.log('resetPassword',response.body);
    //  resetLink=response.body.data,//exporter pour l'utiliser dans la fction reset password
      // Check the response
     // console.log("response",response)
     expect(response.body.status).toBe('Success')

});
});






