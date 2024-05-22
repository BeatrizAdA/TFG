"use strict";

class DAOInformation {

    constructor(pool){
        this.pool = pool;
    }

    insertFood(email, information, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.id AS id_patient, i.id AS id_information FROM patient p JOIN patient_information p_i ON p.id = p_i.id_patient JOIN information i ON p_i.id_information = i.id WHERE p.email = ? AND i.date = ?", [email, information.date],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length === 0){
                            connection.query("SELECT id FROM patient WHERE email = ?", [email],
                            function(err, rows2){
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    connection.query("INSERT INTO information (date) VALUES (?)", [information.date],
                                    function(err, rows3){
                                        if(err){
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            connection.query("INSERT INTO patient_information (id_patient, id_information) VALUES (?, ?)", [rows2[0].id, rows3.insertId],
                                            function(err, rows4){
                                                if(err){
                                                    callback(new Error("Error de acceso a la base de datos"));
                                                }
                                                else {
                                                    connection.query("INSERT INTO food (hour, option_food, ingredients, total_carbohydrates, insulin) VALUES (?, ?, ?, ?, ?)", [information.hour, information.option_food, information.ingredients, information.total_carbohydrates, information.insulin],
                                                    function(err, rows5){
                                                        if(err){
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        }
                                                        else {
                                                            connection.query("INSERT INTO information_food (id_information, id_food) VALUES (?, ?)", [rows3.insertId, rows5.insertId],
                                                            function(err, rows6){
                                                                connection.release();
                                                                if(err){
                                                                    callback(new Error("Error de acceso a la base de datos"));
                                                                }
                                                                else {
                                                                    callback(null);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            connection.query("INSERT INTO food (hour, option_food, ingredients, total_carbohydrates, insulin) VALUES (?, ?, ?, ?, ?)", [information.hour, information.option_food, information.ingredients, information.total_carbohydrates, information.insulin],
                            function(err, rows2){
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    connection.query("INSERT INTO information_food (id_information, id_food) VALUES (?, ?)", [rows1[0].id_information, rows2.insertId],
                                    function(err, rows4){
                                        connection.release();
                                        if(err){
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            callback(null);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    selectIngredient(email, ingredient, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.id AS id_patient, i.id AS id_ingredient, i.ingredient, i.grams, i.carbohydrates FROM patient p JOIN patient_ingredient p_i ON p.id = p_i.id_patient JOIN ingredient i ON p_i.id_ingredient = i.id WHERE p.email = ? AND i.ingredient LIKE ?", [email, "%" + ingredient + "%"],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length !== 0){
                            callback(null, rows1);
                        }
                        else {
                            callback(null, 0);
                        }
                    }
                });
            }
        });
    }

    selectIngredientID(email, id, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.id AS id_patient, i.id AS id_ingredient, i.ingredient, i.grams, i.carbohydrates FROM patient p JOIN patient_ingredient p_i ON p.id = p_i.id_patient JOIN ingredient i ON p_i.id_ingredient = i.id WHERE p.email = ? AND i.id = ?", [email, id],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length !== 0){
                            callback(null, rows1);
                        }
                        else {
                            callback(null, 0);
                        }
                    }
                });
            }
        });
    }

    selectRationTable(ingredient, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT id, ingredient, grams, carbohydrates FROM ration_table WHERE ingredient LIKE ?", ["%" + ingredient + "%"],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length !== 0){
                            callback(null, rows1);
                        }
                        else {
                            callback(null, 0);
                        }
                    }
                });
            }
        });
    }

    selectRationTableID(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT id, ingredient, grams, carbohydrates FROM ration_table WHERE id = ?", [id],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length !== 0){
                            callback(null, rows1);
                        }
                        else {
                            callback(null, 0);
                        }
                    }
                });
            }
        });
    }

    addFood(email, food, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT id FROM patient WHERE email = ?", [email],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        connection.query("INSERT INTO ingredient (ingredient, grams, carbohydrates) VALUES (?, ?, ?)", [food.ingredient, food.grams, food.carbohydrates],
                        function(err, rows2){
                            if(err){
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                connection.query("INSERT INTO patient_ingredient (id_patient, id_ingredient) VALUES (?, ?)", [rows1[0].id, rows2.insertId],
                                function(err, rows3){
                                    connection.release();
                                    if(err){
                                        callback(new Error("Error de acceso a la base de datos"));
                                    }
                                    else {
                                        callback(null, rows3);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    
    insertBloodSugar(email, information, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.id AS id_patient, i.id AS id_information FROM patient p JOIN patient_information p_i ON p.id = p_i.id_patient JOIN information i ON p_i.id_information = i.id WHERE p.email = ? AND i.date = ?", [email, information.date],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length === 0){
                            connection.query("SELECT id FROM patient WHERE email = ?", [email],
                            function(err, rows2){
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    connection.query("INSERT INTO information (date) VALUES (?)", [information.date],
                                    function(err, rows3){
                                        if(err){
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            connection.query("INSERT INTO patient_information (id_patient, id_information) VALUES (?, ?)", [rows2[0].id, rows3.insertId],
                                            function(err, rows4){
                                                if(err){
                                                    callback(new Error("Error de acceso a la base de datos"));
                                                }
                                                else {
                                                    connection.query("INSERT INTO blood_sugar (hour, option_blood_sugar, blood_sugar, hyperglycemia, hypoglycemia) VALUES (?, ?, ?, ?, ?)", [information.hour, information.option_blood_sugar, information.blood_sugar, information.hyperglycemia, information.hypoglycemia],
                                                    function(err, rows5){
                                                        if(err){
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        }
                                                        else {
                                                            connection.query("INSERT INTO information_blood_sugar (id_information, id_blood_sugar) VALUES (?, ?)", [rows3.insertId, rows5.insertId],
                                                            function(err, rows6){
                                                                connection.release();
                                                                if(err){
                                                                    callback(new Error("Error de acceso a la base de datos"));
                                                                }
                                                                else {
                                                                    callback(null);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            connection.query("INSERT INTO blood_sugar (hour, option_blood_sugar, blood_sugar, hyperglycemia, hypoglycemia) VALUES (?, ?, ?, ?, ?)", [information.hour, information.option_blood_sugar, information.blood_sugar, information.hyperglycemia, information.hypoglycemia],
                            function(err, rows2){
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    connection.query("INSERT INTO information_blood_sugar (id_information, id_blood_sugar) VALUES (?, ?)", [rows1[0].id_information, rows2.insertId],
                                    function(err, rows4){
                                        connection.release();
                                        if(err){
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            callback(null);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    insertSport(email, information, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.id AS id_patient, i.id AS id_information FROM patient p JOIN patient_information p_i ON p.id = p_i.id_patient JOIN information i ON p_i.id_information = i.id WHERE p.email = ? AND i.date = ?", [email, information.date],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length === 0){
                            connection.query("SELECT id FROM patient WHERE email = ?", [email],
                            function(err, rows2){
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    connection.query("INSERT INTO information (date) VALUES (?)", [information.date],
                                    function(err, rows3){
                                        if(err){
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            connection.query("INSERT INTO patient_information (id_patient, id_information) VALUES (?, ?)", [rows2[0].id, rows3.insertId],
                                            function(err, rows4){
                                                if(err){
                                                    callback(new Error("Error de acceso a la base de datos"));
                                                }
                                                else {
                                                    connection.query("INSERT INTO sport (hour, type_sport, sport_time) VALUES (?, ?, ?)", [information.hour, information.type_sport, information.sport_time],
                                                    function(err, rows5){
                                                        if(err){
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        }
                                                        else {
                                                            connection.query("INSERT INTO information_sport (id_information, id_sport) VALUES (?, ?)", [rows3.insertId, rows5.insertId],
                                                            function(err, rows6){
                                                                connection.release();
                                                                if(err){
                                                                    callback(new Error("Error de acceso a la base de datos"));
                                                                }
                                                                else {
                                                                    callback(null);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            connection.query("INSERT INTO sport (hour, type_sport, sport_time) VALUES (?, ?, ?)", [information.hour, information.type_sport, information.sport_time],
                            function(err, rows2){
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    connection.query("INSERT INTO information_sport (id_information, id_sport) VALUES (?, ?)", [rows1[0].id_information, rows2.insertId],
                                    function(err, rows4){
                                        connection.release();
                                        if(err){
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            callback(null);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    getInformation(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.full_name, i.id, i.date FROM patient p JOIN patient_information p_i ON p.id = p_i.id_patient JOIN information i ON p_i.id_information = i.id WHERE p.email = ?", [email],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null, rows);
                    }
                });
            }
        });
    }

    getInformationFoodID(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.full_name, i.id, i.date, i.comment, f.hour, f.option_food, f.ingredients, f.total_carbohydrates, f.insulin FROM patient p JOIN patient_information p_i ON p.id = p_i.id_patient JOIN information i ON p_i.id_information = i.id JOIN information_food i_f ON i.id = i_f.id_information JOIN food f ON i_f.id_food = f.id WHERE i.id = ?", [id],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null, rows);
                    }
                });
            }
        });
    }

    getInformationBloodSugarID(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.full_name, i.id, i.date, i.comment, b_s.hour, b_s.option_blood_sugar, b_s.blood_sugar, b_s.hyperglycemia, b_s.hypoglycemia FROM patient p JOIN patient_information p_i ON p.id = p_i.id_patient JOIN information i ON p_i.id_information = i.id JOIN information_blood_sugar i_b_s ON i.id = i_b_s.id_information JOIN blood_sugar b_s ON i_b_s.id_blood_sugar = b_s.id WHERE i.id = ?", [id],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null, rows);
                    }
                });
            }
        });
    }

    getInformationSportID(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT p.full_name, i.id, i.date, i.comment, s.hour, s.type_sport, s.sport_time FROM patient p JOIN patient_information p_i ON p.id = p_i.id_patient JOIN information i ON p_i.id_information = i.id JOIN information_sport i_s ON i.id = i_s.id_information JOIN sport s ON i_s.id_sport = s.id WHERE i.id = ?", [id],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null, rows);
                    }
                });
            }
        });
    }

    addComment(id, comment, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("UPDATE information SET comment = ? WHERE id = ?", [comment, id],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    }

    getInformationGraphic(email, start_date, end_date, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT b_s.hour, b_s.blood_sugar FROM patient p JOIN patient_information p_i ON p.id = p_i.id_patient JOIN information i ON p_i.id_information = i.id JOIN information_blood_sugar i_b_s ON i.id = i_b_s.id_information JOIN blood_sugar b_s ON i_b_s.id_blood_sugar = b_s.id WHERE p.email = ? AND i.date >= ? AND i.date <= ?", [email, start_date, end_date],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null, rows);
                    }
                });
            }
        });
    }

    getRationTable(callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM ration_table",
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null, rows);
                    }
                });
            }
        });
    }

}

module.exports = DAOInformation;