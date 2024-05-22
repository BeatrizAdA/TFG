"use strict";

const express = require("express");
const router_information = express.Router();
const mysql = require("mysql");
const config = require("../config");
const DAO_user = require("../dao/DAOUser");
const DAO_information = require("../dao/DAOInformation");
const pool = mysql.createPool(config.mysqlConfig);
const dao_user = new DAO_user(pool);
const dao_information = new DAO_information(pool);

let min_before_food = 80;
let max_before_food = 130;
let after_food = 180;
let min_before_sport = 90;
let max_before_sport = 250;
let medium_before_sport = 150;
let email_patient;

router_information.get("/", function(request, response, next){
    if(!request.session.currentUser){
        response.redirect("/login");
    }
    else {
        dao_user.getUserData(request.session.currentUser, function(err, result1){
            if(err){
                next(err);
            }
            else {
                if(result1[0].is_doctor){
                    dao_user.getPatientDoctor(result1[0].id, function(err, result2){
                        if(err){
                            next(err);
                        }
                        else {
                            if(result2){
                                let show_graphic_button = false;
                                if(!result1[0].is_doctor){
                                    show_graphic_button = true;
                                }
                                response.render("main", { user_data: result1, information: result2, busqueda: false, medico: false, show_graphic_button: show_graphic_button, patient_doctor: true });
                            }
                            else {
                                dao_information.getInformation(request.session.currentUser, function(err, result3){
                                    if(err){
                                        next(err);
                                    }
                                    else {
                                        for(let i = 0; i < result3.length; i++){
                                            let month = result3[i].date.getMonth() + 1;
                                            result3[i].date = result3[i].date.getDate() + "/" + month + "/" + result3[i].date.getFullYear();
                                        }
                                        result3.sort(function (a, b) {
                                            if (a.date > b.date) {
                                              return -1;
                                            }
                                            if (a.date < b.date) {
                                              return 1;
                                            }
                                            return 0;
                                        });
                                        let show_graphic_button = false;
                                        if(!result1[0].is_doctor){
                                            show_graphic_button = true;
                                        }
                                        response.render("main", { user_data: result1, information: result3, busqueda: false, medico: true, show_graphic_button: show_graphic_button, patient_doctor: false });
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    dao_information.getInformation(request.session.currentUser, function(err, result2){
                        if(err){
                            next(err);
                        }
                        else {
                            for(let i = 0; i < result2.length; i++){
                                let month = result2[i].date.getMonth() + 1;
                                result2[i].date = result2[i].date.getDate() + "/" + month + "/" + result2[i].date.getFullYear();
                            }
                            result2.sort(function (a, b) {
                                if (a.date > b.date) {
                                  return -1;
                                }
                                if (a.date < b.date) {
                                  return 1;
                                }
                                return 0;
                            });
                            let show_graphic_button = false;
                            if(!result1[0].is_doctor){
                                show_graphic_button = true;
                            }
                            response.render("main", { user_data: result1, information: result2, busqueda: false, medico: true, show_graphic_button: show_graphic_button, patient_doctor: false });
                        }
                    });
                }
            }
        });
    }
});

router_information.get("/new_food", function(request, response, next){
    let option_food = request.query.meal;
    dao_user.getUserData(request.session.currentUser, function(err, result){
        if(err){
            next(err);
        }
        else {
            let show_graphic_button = false;
            if(!result[0].is_doctor){
                show_graphic_button = true;
            }
            response.render("newFood", { user_data: result, option_food: option_food, show_graphic_button: show_graphic_button });
        }
    });
});

router_information.post("/new_food", function(request, response, next){
    let information = new Object();
    let date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    information.date = date.toISOString().split('T')[0];
    information.hour = date.toISOString().split('T')[1].split('.')[0];
    information.option_food = request.body.option_food;
    information.ingredients = request.body.ingredients;
    information.total_carbohydrates = request.body.total_carbohydrates;
    information.insulin = request.body.insulin;
    dao_information.insertFood(request.session.currentUser, information, function(err, result){
        if(err){
            next(err);
        }
        else {
            response.redirect("/main");
        }
    });
});

router_information.get("/food", function(request, response, next){
    dao_information.selectIngredient(request.session.currentUser, request.query.ingredient, function(err, result1){
        if(err){
            next(err);
        }
        else {
            dao_information.selectRationTable(request.query.ingredient, function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    response.json({ ingredient_table: result1, ration_table: result2 });
                }
            });
        }
    });
});

router_information.post("/food", function(request, response, next){
    let food = new Object();
    food.ingredient = request.body.ingredient;
    food.grams = request.body.grams_modal;
    food.carbohydrates = request.body.carbohydrates_modal;
    dao_information.addFood(request.session.currentUser, food, function(err, result){
        if(err){
            next(err);
        }
        else {
            response.json({ food: result });
        }
    });
});

router_information.get("/food_id", function(request, response, next){
    if(request.query.table === "ration_table"){
        dao_information.selectRationTableID(request.query.id, function(err, result1){
            if(err){
                next(err);
            }
            else {
                response.json({ id_table: result1 });
            }
        });
    }
    else {
        dao_information.selectIngredientID(request.session.currentUser, request.query.id, function(err, result1){
            if(err){
                next(err);
            }
            else {
                response.json({ id_table: result1 });
            }
        });
    }
});

router_information.get("/new_blood_sugar", function(request, response, next){
    let option_blood_sugar = request.query.blood_sugar;
    dao_user.getUserData(request.session.currentUser, function(err, result){
        if(err){
            next(err);
        }
        else {
            let show_graphic_button = false;
            if(!result[0].is_doctor){
                show_graphic_button = true;
            }
            response.render("newBloodSugar", { user_data: result, option_blood_sugar: option_blood_sugar, min_before_food: min_before_food, max_before_food: max_before_food, after_food: after_food, min_before_sport: min_before_sport, max_before_sport: max_before_sport, medium_before_sport:medium_before_sport, show_graphic_button: show_graphic_button });
        }
    });
});

router_information.post("/new_blood_sugar", function(request, response, next){
    let information = new Object();
    let date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    information.date = date.toISOString().split('T')[0];
    information.hour = date.toISOString().split('T')[1].split('.')[0];
    information.option_blood_sugar = request.body.option_blood_sugar;
    information.blood_sugar = request.body.blood_sugar;
    information.hyperglycemia = (request.body.hyperglycemia === 'true');
    information.hypoglycemia = (request.body.hypoglycemia === 'true');
    dao_information.insertBloodSugar(request.session.currentUser, information, function(err, result){
        if(err){
            next(err);
        }
        else {
            response.redirect("/main");
        }
    });
});

router_information.get("/new_sport", function(request, response, next){
    dao_user.getUserData(request.session.currentUser, function(err, result){
        if(err){
            next(err);
        }
        else {
            let show_graphic_button = false;
            if(!result[0].is_doctor){
                show_graphic_button = true;
            }
            response.render("newSport", { user_data: result, show_graphic_button: show_graphic_button });
        }
    });
});

router_information.post("/new_sport", function(request, response, next){
    let information = new Object();
    let date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    information.date = date.toISOString().split('T')[0];
    information.hour = date.toISOString().split('T')[1].split('.')[0];
    information.type_sport = request.body.type_sport;
    information.sport_time = request.body.sport_time;
    dao_information.insertSport(request.session.currentUser, information, function(err, result){
        if(err){
            next(err);
        }
        else {
            response.redirect("/main");
        }
    });
});

router_information.get("/graphic", function(request, response, next){
    let start_date = request.query.start_date;
    let end_date = request.query.end_date;
    dao_user.getUserData(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else {
            let email;
            if(result1[0].is_doctor){
                email = email_patient;
            }
            else {
                email = request.session.currentUser;
            }
            dao_information.getInformationGraphic(email, start_date, end_date, function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    let list_graphic = [];
                    for(let i = 0; i < result2.length; i++){
                        let graphic_value = new Object();
                        graphic_value.hour = result2[i].hour;
                        graphic_value.blood_sugar = result2[i].blood_sugar;
                        list_graphic.push(graphic_value);
                    }
                    let show_graphic_button = false;
                    if(!result1[0].is_doctor){
                        show_graphic_button = true;
                    }
                    response.render("graphic", { user_data: result1, graphic: list_graphic, show_graphic_button: true });
                }
            });
        }
    });
});

router_information.get("/information/:id", function(request, response, next){
    dao_user.getUserData(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else {
            dao_information.getInformationFoodID(request.params.id, function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    dao_information.getInformationBloodSugarID(request.params.id, function(err, result3){
                        if(err){
                            next(err);
                        }
                        else {
                            dao_information.getInformationSportID(request.params.id, function(err, result4){
                                if(err){
                                    next(err);
                                }
                                else {
                                    let list_information = [];
                                    let list_graphic = [];
                                    for(let i = 0; i < result2.length; i++){
                                        result2[i].hour = result2[i].hour.split(":").slice(0, 2).join(":");
                                        let month = result2[i].date.getMonth() + 1;
                                        result2[i].date = result2[i].date.getDate() + "/" + month + "/" + result2[i].date.getFullYear();
                                        list_information.push(result2[i]);
                                    }
                                    for(let i = 0; i < result3.length; i++){
                                        result3[i].hour = result3[i].hour.split(":").slice(0, 2).join(":");
                                        let month = result3[i].date.getMonth() + 1;
                                        result3[i].date = result3[i].date.getDate() + "/" + month + "/" + result3[i].date.getFullYear();
                                        list_information.push(result3[i]);
                                        let graphic_value = new Object();
                                        graphic_value.hour = result3[i].hour;
                                        graphic_value.blood_sugar = result3[i].blood_sugar;
                                        list_graphic.push(graphic_value);
                                    }
                                    for(let i = 0; i < result4.length; i++){
                                        result4[i].hour = result4[i].hour.split(":").slice(0, 2).join(":");
                                        let month = result4[i].date.getMonth() + 1;
                                        result4[i].date = result4[i].date.getDate() + "/" + month + "/" + result4[i].date.getFullYear();
                                        list_information.push(result4[i]);
                                    }
                                    list_information.sort(function (a, b) {
                                        if (a.hour > b.hour) {
                                          return 1;
                                        }
                                        if (a.hour < b.hour) {
                                          return -1;
                                        }
                                        return 0;
                                    });
                                    let show_graphic_button = false;
                                    if(!result1[0].is_doctor){
                                        show_graphic_button = true;
                                    }
                                    response.render("information", { user_data: result1, information: list_information, graphic: list_graphic, show_graphic_button: true });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router_information.post("/information/:id", function(request, response, next){
    dao_information.addComment(request.params.id, request.body.comment, function(err, result){
        if(err){
            next(err);
        }
        else {
            response.redirect("/main/information/" + request.params.id);
        }
    });
});

router_information.get("/search", function(request, response, next){
    dao_user.getUserData(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else {
            if(result1[0].is_doctor){
                dao_user.searchPatient(request.query.text_search, function(err, result2){
                    if(err){
                        next(err);
                    }
                    else {
                        if(!result2){
                            response.redirect("/main");
                        }
                        else {
                            let show_graphic_button = false;
                            if(!result1[0].is_doctor){
                                show_graphic_button = true;
                            }
                            response.render("main", { user_data: result1, information: result2, busqueda: true, medico: false, show_graphic_button: show_graphic_button, patient_doctor: false });
                        }
                    }
                });
            }
            else {
                response.redirect("/main");
            }
        }
    });
});

router_information.get("/search_patient/:name", function(request, response, next){
    dao_user.getUserData(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else {
            dao_user.searchPatient(request.params.name, function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    dao_information.getInformation(result2[0].email, function(err, result3){
                        if(err){
                            next(err);
                        }
                        else {
                            for(let i = 0; i < result3.length; i++){
                                let month = result3[i].date.getMonth() + 1;
                                result3[i].date = result3[i].date.getDate() + "/" + month + "/" + result3[i].date.getFullYear();
                            }
                            result3.sort(function (a, b) {
                                if (a.date > b.date) {
                                  return -1;
                                }
                                if (a.date < b.date) {
                                  return 1;
                                }
                                return 0;
                            });
                            let show_graphic_button = false;
                            if(!result1[0].is_doctor){
                                show_graphic_button = true;
                            }
                            email_patient = result2[0].email;
                            response.render("main", { user_data: result1, information: result3, busqueda: false, medico: true, show_graphic_button: true, patient_doctor: false });
                        }
                    });
                }
            });
        }
    });
});

router_information.get("/ration_table", function(request, response, next){
    dao_user.getUserData(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else {
            dao_information.getRationTable(function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    let show_graphic_button = false;
                    if(!result1[0].is_doctor){
                        show_graphic_button = true;
                    }
                    response.render("ration_table", { user_data: result1, information: result2, show_graphic_button: show_graphic_button });
                }
            });
        }
    });
});

router_information.post("/patient_doctor/:name", function(request, response, next){
    dao_user.getUserData(request.session.currentUser, function(err, result1){
        if(err){
            next(err);
        }
        else {
            dao_user.savePatientDoctor(result1[0].full_name, request.params.name, function(err, result2){
                if(err){
                    next(err);
                }
                else {
                    let show_graphic_button = false;
                    if(!result1[0].is_doctor){
                        show_graphic_button = true;
                    }
                    response.redirect("/main");
                }
            });
        }
    });
});

module.exports = router_information;