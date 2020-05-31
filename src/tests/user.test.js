const app = require("../app.js");
const request = require("supertest");
const User = require("../models/user")

beforeEach(async () => {
    await User.deleteMany()
    await new User({
        name: "Khai",
        email: "khai@gmail.com",
        password: "12356",
        passwordConfirm: "12356"
    }).save()
})

test("Should NOT register an account", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "Khai",
            email: "khai@gmail.com",
            password: "12356"
        }).expect(400)
})

test("Should NOT register an account", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "Khai",
            email: "khai@gmail.com",
            password: "12356",
            passwordConfirm: "12356"
        }).expect(400)
})

test("Should register an account", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "Khai",
            email: "khai@gmail.com",
            password: "12356",
            passwordConfirm: "12356"
        }).expect(400)
})

test("Should login user", async () => {
    await request(app)
        .post("/auth/login")
        .send({
            email: "khai@gmail.com",
            password: "12356"
        }).expect(200)
        .then(res => expect(res.body.data.user.email).toBe("khai@gmail.com"))
    })

