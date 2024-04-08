/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const User = require("../models/userModel.js");

const userCategories = require("../userCategories");
const thirdPartyCategories = require("../thirdPartyCategories")

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");
const should = chai.should();

const utils = require("./utils.js");

chai.use(chaiHttp);

//TEST USER API

describe("User tests", () => {
  
  //Flush test database and create mock user

  after(async () => {await utils.flushDB();});

  describe("Model tests", () => {
    let defaultUser;

    beforeEach(async () => {
      await utils.flushDB();
      defaultUser = await User.create({
        name: "Jill",
        email: "jill@example.com",
        password: "123",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      });
    });

    it("should create and save a valid main user", async () => {
      await User.create({
        name: "John",
        email: "john@example.com",
        password: "123",
        type:"main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.not.exist(error, "The user should have been valid");
        })
        .then((user) => {
          should.exist(user);
        });
    });

    it("should create and save a valid third party user", async () => {
      await User.create({
        name: "third",
        email: "third@example.com",
        password: "123",
        type:'third',
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.not.exist(error, "The user should have been valid");
        })
        .then((user) => {
          should.exist(user);
        });
    });

    it("should require name", async () => {
      await User.create({
        email: "john@example.com",
        password: "123",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("ValidationError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });

    it("should require email", async () => {
      await User.create({
        name: "John",
        password: "123",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("ValidationError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });

    it("should require password", async () => {
      await User.create({
        name: "John",
        email: "john@example.com",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("ValidationError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });

    it("should not allow names above 20 characters", async () => {
      await User.create({
        name: "J".repeat(21),
        password: "123",
        email: "john@example.com",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("ValidationError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });

    it("should not allow emails not in correct format", async () => {
      await User.create({
        name: "John",
        password: "123",
        email: "johnexample.com",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("ValidationError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });

    it("should not allow emails above 254 characters", async () => {
      await User.create({
        name: "John",
        password: "123",
        email: "j".repeat(250) + "@example.com",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("ValidationError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });

    it("should not allow a non-unique email", async () => {
      await User.create({
        name: "John",
        password: "123",
        email: "jill@example.com",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("MongoServerError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });

    it("should not accept invalid user category", async () => {
      await User.create({
        name: "John",
        password: "123",
        email: "john@example.com",
        type: "main",
        userCategory: "invalid",
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("ValidationError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });
    
    it("should not accept invalid third party category", async () => {
      await User.create({
        name: "John",
        password: "123",
        email: "john@example.com",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: "invalid",
      })
        .catch((error) => {
          should.exist(error);
          error.should.have.property("name").eql("ValidationError");
        })
        .then((user) => {
          should.not.exist(user, "The user should have been invalid");
        });
    });
  });

  describe("API tests", () => {
    let validToken;
    const defaultUser = {
      name: "Jill",
      email: "jill@example.com",
      password: "123",
      type: "main",
      userCategory: userCategories.PRIVATE,
      thirdPartyCategory: thirdPartyCategories.OTHERS,
    };
    
    before(async () => {
      await utils.flushDB();
      const res = await chai.request(server)
        .post("/api/user/")
        .send(defaultUser);
      
      validToken = res.body.token;
    });

    it("should register a valid user through POST /api/user", async () =>  {
      let validUser = {
        name: "John",
        email: "john@example.com",
        password: "123",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      };

      const res = await chai.request(server)
        .post("/api/user/")
        .send(validUser);
      
      res.should.have.status(201);
      res.body.should.be.a("object");
      res.body.should.have.property("_id");
      res.body.should.have.property("name").eql(validUser.name);
      res.body.should.have.property("email").eql(validUser.email);
      res.body.should.have.property("type").eql(validUser.type);
      res.body.should.have.property("userCategory").eql(validUser.userCategory);
      res.body.should.have.property("thirdPartyCategory").eql(validUser.thirdPartyCategory);
      res.body.should.have.property("token");
    });

    it("should not register a user that does not conform to the model", async () => {
      let noEmailUser = {
        name: "John",
        password: "123",
        email: "johnfakeemail",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      };

      const res = await chai.request(server)
        .post("/api/user/")
        .send(noEmailUser);
      
      res.should.have.status(400);
    });

    it("should not register a user that has a duplicate email", async () => {
      let dupeEmailUser = {
        email: "jill@example.com",
        name: "John",
        password: "123",
        type: "main",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      };

      const res = await chai.request(server)
        .post("/api/user/")
        .send(dupeEmailUser);
      
      res.should.have.status(400);
    });

    it("should login a user with correct credentials through POST /api/user/login", async () => {
      let validUser = {
        email: "jill@example.com",
        password: "123"
      };

      const res = await chai.request(server)
        .post("/api/user/login/")
        .send(validUser);
  
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("_id");
      res.body.should.have.property("name").eql(defaultUser.name);
      res.body.should.have.property("email").eql(defaultUser.email);
      res.body.should.have.property("type").eql(defaultUser.type);
      res.body.should.have.property("userCategory").eql(defaultUser.userCategory);
      res.body.should.have.property("thirdPartyCategory").eql(defaultUser.thirdPartyCategory);
      res.body.should.have.property("token");
    });

    it("should not login a user with the incorrect credentials", async () => {
      let invalidUser = {
        email: "jill@example.com",
        password: "1234"
      };

      const res = await chai.request(server)
        .post("/api/user/login/")
        .send(invalidUser);
      
      res.should.have.status(401);
    });

    it("should not login a user with a malformed request", async () => {
      let invalidUser = {
        password: "1234"
      };

      const res = await chai.request(server)
        .post("/api/user/login/")
        .send(invalidUser);
      
      res.should.have.status(401);
    });

    it("should provide an authorised user with their own profile", async () => {
      const res = await chai.request(server)
        .get("/api/user/profile/")
        .set("Authorization", ("Bearer " + validToken));
      
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("id");
      res.body.should.have.property("name").eql(defaultUser.name);
      res.body.should.have.property("email").eql(defaultUser.email);
      res.body.should.have.property("type").eql(defaultUser.type);
      res.body.should.have.property("userCategory").eql(defaultUser.userCategory);
      res.body.should.have.property("thirdPartyCategory").eql(defaultUser.thirdPartyCategory);
    });

    it("should not provide a user without a bearer token a profile", async() =>  {
      const res = await chai.request(server)
        .get("/api/user/profile/");
      
      res.should.have.status(401);
    });

    it("should not allow a user with an invalid bearer token a profile", async () => {
      const res = await chai.request(server)
        .get("/api/user/profile/")
        .set("Authorization", ("Bearer xyz"));
      
      res.should.have.status(401);
    });

    it("should edit user's details", async () => {
      let changedDetails = {
        name: "Jack",
        password: "NewPassword"
      };
      
      const res = await chai.request(server)
        .patch("/api/user/")
        .send(changedDetails)
        .set("Authorization", ("Bearer " + validToken));

      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("name").eql(defaultUser.name);

      defaultUser.name = changedDetails.name
      defaultUser.password = changedDetails.password

      //Try logging in with new details
      let validUser = {
        email: defaultUser.email,
        password: changedDetails.password
      };

      const res2 = await chai.request(server)
        .post("/api/user/login/")
        .send(validUser);
      
      res2.should.have.status(200);
      res2.body.should.be.a("object");
      res2.body.should.have.property("_id");
      res2.body.should.have.property("name").eql(changedDetails.name);
      res2.body.should.have.property("email").eql(defaultUser.email);
      res2.body.should.have.property("type").eql(defaultUser.type);
      res2.body.should.have.property("userCategory").eql(defaultUser.userCategory);
      res2.body.should.have.property("thirdPartyCategory").eql(defaultUser.thirdPartyCategory);
      res2.body.should.have.property("token");
    }); 

    it("should edit main user's category", async () => {
      let changedCategory = {
        userCategory: "PUBLIC",
      };

      // Change user category
      const res = await chai.request(server)
        .patch("/api/user/userCategory")
        .send(changedCategory)
        .set("Authorization", ("Bearer " + validToken));

      res.should.have.status(200);
      res.body.should.be.a("object");

      defaultUser.userCategory = changedCategory.userCategory

      //Try logging in with new details
      let validUser = {
        email: defaultUser.email,
        password: defaultUser.password
      };

      const res2 = await chai.request(server)
        .post("/api/user/login/")
        .send(validUser);

      res2.should.have.status(200);
      res2.body.should.be.a("object");
      res2.body.should.have.property("_id");
      res2.body.should.have.property("name").eql(defaultUser.name);
      res2.body.should.have.property("email").eql(defaultUser.email);
      res2.body.should.have.property("type").eql(defaultUser.type);
      res2.body.should.have.property("userCategory").eql(changedCategory.userCategory);
      res2.body.should.have.property("thirdPartyCategory").eql(defaultUser.thirdPartyCategory);
      res2.body.should.have.property("token");
    }); 

    it("should not allow third parties to change user category", async () => {
      
      let thirdParty = {
        name: "Third",
        email: "third@example.com",
        password: "123",
        type: "third",
        userCategory: userCategories.PRIVATE,
        thirdPartyCategory: thirdPartyCategories.OTHERS,
      }

      const res = await chai.request(server)
        .post("/api/user/")
        .send(thirdParty);

      thirdPartyToken = res.body.token

      let changedCategory = {
        userCategory: "PUBLIC",
      };

      // Change user category
      const res2 = await chai.request(server)
        .patch("/api/user/userCategory")
        .send(changedCategory)
        .set("Authorization", ("Bearer " + thirdPartyToken));

      res2.should.have.status(401);
    });
  });
}); 