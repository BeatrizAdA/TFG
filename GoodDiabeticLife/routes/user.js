"use strict";

const express = require("express");
const router_user = express.Router();
const mysql = require("mysql");
const config = require("../config");
const DAO_user = require("../dao/DAOUser");
const pool = mysql.createPool(config.mysqlConfig);
const dao_user = new DAO_user(pool);
const multer = require("multer");
const multer_factory = multer({storage: multer.memoryStorage()});
const fs = require("fs");

router_user.get("/", function(request, response){
    response.redirect("/login");
});

router_user.get("/login", function(request, response){
    response.render("login", { error: null });
});

router_user.post("/login", function(request, response, next){
    let user = new Object();
    user.email = request.body.email;
    user.password = request.body.password;
    dao_user.userExists(user, function(err, result){
        if(err){
            next(err);
        }
        else {
            if(!result){
                response.render("login", { error: "Usuario y/o contraseña incorrectos" });
            }
            else {
                request.session.currentUser = request.body.email;
                response.redirect("/main");
            }
        }
    })
});

router_user.get("/session_log", function(request, response){
    response.render("sessionLog", { error: null });
});

router_user.post("/session_log", multer_factory.single("image"), function(request, response, next){
    if(!request.body.doctor_patient){
        response.render("sessionLog", { error: "No se ha marcado la opción médico o paciente" });
    }
    else if((!request.body.full_name) || (/\d/.test(request.body.full_name))){
        response.render("sessionLog", { error: "El valor del campo nombre no representa un nombre válido" });
    }
    else if(!/\S+@\S+\.\S+/.test(request.body.email)){
        response.render("sessionLog", { error: "El valor del campo email no representa un email válido" });
    }
    else if((request.body.password.length < 8) || (!/[A-Z]/.test(request.body.password)) || (!/[a-z]/.test(request.body.password)) || (!/\d/.test(request.body.password)) || (!/[!@#$%^&*(),.?":{}|<>]/.test(request.body.password))){
        response.render("sessionLog", { error: "El valor del campo contraseña no representa una contraseña válida" });
    }
    else if(request.body.password !== request.body.confirm_password){
        response.render("sessionLog", { error: "El valor del campo contraseña no coincide con el valor de confirmar contraseña" });
    }
    else {
        let user = new Object();
        user.full_name = request.body.full_name;
        user.email = request.body.email;
        user.password = request.body.password;
        user.confirm_password = request.body.confirm_password;
        if(request.file){
            user.image = request.file.buffer;
        }
        else {
            user.image = fs.readFileSync("public/images/user.png");
        }
        if(request.body.doctor_patient === "doctor"){
            user.is_doctor = true;
        }
        else if(request.body.doctor_patient === "patient"){
            user.is_doctor = false;
        }
        dao_user.emailExists(user, function(err, result1){
            if(err){
                next(err);
            }
            else {
                if(result1){
                    response.render("sessionLog", { error: "El email ya existe" });
                }
                else {
                    dao_user.insertUser(user, function(err, result2){
                        if(err){
                            next(err);
                        }
                        else {
                            response.redirect("/login");
                        }
                    });
                }
            }
        });
    }
});

router_user.get("/user_profile", function(request, response){
    dao_user.getUserData(request.session.currentUser, function(err, result){
        if(err){
            next(err);
        }
        else {
            let show_graphic_button = false;
            if(!result[0].is_doctor){
                show_graphic_button = true;
            }
            response.render("userProfile", { user_data: result, show_graphic_button: show_graphic_button });
        }
    });
});

router_user.post("/data_profile", function(request, response){
    let user = new Object();
    user.email = request.session.currentUser;
    user.weight = request.body.weight;
    user.type_diabetes = request.body.type_diabetes;
    user.diabetes_treatment = request.body.diabetes_treatment;
    user.blood_sugar_min = request.body.blood_sugar_min;
    user.blood_sugar_max = request.body.blood_sugar_max;
    user.breakfast_quantity = request.body.breakfast_quantity;
    user.lunch_quantity = request.body.lunch_quantity;
    user.dinner_quantity = request.body.dinner_quantity;
    user.ratio = request.body.ratio;
    dao_user.updateData(user, function(err, result){
        if(err){
            next(err);
        }
        else {
            response.redirect("/user_profile");
        }
    });
});

router_user.get("/image/:id", function(request, response, next){
    dao_user.getUserImage(request.params.id, function(err, result){
        if(err){
            next(err);
        }
        else {
            response.end(result);
        }
    });
});

router_user.get("/sign_off", function(request, response){
    request.session.destroy();
    response.redirect("login");
});

module.exports = router_user;