"use strict";

const config = require("./config");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const body_parser = require("body-parser");
const fs = require("fs");
const {dirname} = require("path");
const session = require("express-session");
const mysql_session = require("express-mysql-session");

const app = express();

const pool = mysql.createPool(config.mysqlConfig);

app.set("view engine", "ejs");

app.use(body_parser.urlencoded({extended: false}));

const static_files = path.join(__dirname, "public");
app.use(express.static(static_files));

const MySQLStore = mysql_session(session);

const session_store = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "good_diabetic_life"
});

const middleware_session = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: session_store
});

app.use(middleware_session);

const DAO_information = require("./dao/DAOInformation");
const DAO_user = require("./dao/DAOUser");
const router_information = require("./routes/information");
const router_user = require("./routes/user");

const dao_information = new DAO_information(pool);
const dao_user = new DAO_user(pool);

app.use("/", router_user);
app.use("/login", router_user);
app.use("/session_log", router_user);
app.use("/main", router_information);

app.use(function(request, response, next){
    response.status(400);
    response.render("error404", { url: request.url });
});

app.use(function(error, request, response, next){
    response.status(500);
    response.render("error500", { mensaje: error.message, pila: error.stack });
});

app.listen(config.port, function(err){
    if(err) {
        console.log("Error al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});