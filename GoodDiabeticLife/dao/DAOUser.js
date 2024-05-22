"use strict";

class DAOUser {

    constructor(pool){
        this.pool = pool;
    }

    emailExists(user, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT id FROM patient WHERE email = ?", [user.email],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length === 0){
                            connection.query("SELECT id FROM doctor WHERE email = ?", [user.email],
                            function(err, rows2){
                                connection.release();
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    if(rows2.length === 0){
                                        callback(null, false);
                                    }
                                    else {
                                        callback(null, rows2[0].id);
                                    }
                                }
                            });
                        }
                        else {
                            connection.release();
                            callback(null, rows1[0].id);
                        }
                    }
                });
            }
        });
    }

    insertUser(user, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                if(user.is_doctor){
                    connection.query("INSERT INTO doctor (full_name, email, password, image) VALUES (?, ?, ?, ?)", [user.full_name, user.email, user.password, user.image],
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
                else {
                    connection.query("INSERT INTO patient (full_name, email, password, image) VALUES (?, ?, ?, ?)", [user.full_name, user.email, user.password, user.image],
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
            }
        });
    }

    userExists(user, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT id FROM patient WHERE email = ? AND password = ?", [user.email, user.password],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length === 0){
                            connection.query("SELECT id FROM doctor WHERE email = ? AND password = ?", [user.email, user.password],
                            function(err, rows2){
                                connection.release();
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    if(rows2.length === 0){
                                        callback(null, false);
                                    }
                                    else {
                                        callback(null, rows2[0].id);
                                    }
                                }
                            });
                        }
                        else {
                            connection.release();
                            callback(null, rows1[0].id);
                        }
                    }
                });
            }
        });
    }

    getUserData(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT id, full_name, email, password, weight, type_diabetes, diabetes_treatment, blood_sugar_min, blood_sugar_max, breakfast_quantity, lunch_quantity, dinner_quantity, ratio FROM patient WHERE email = ?", [email],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length === 0){
                            connection.query("SELECT id, full_name, email, password FROM doctor WHERE email = ?", [email],
                            function(err, rows2){
                                connection.release();
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    rows2[0]["is_doctor"] = true;
                                    callback(null, rows2);
                                }
                            });
                        }
                        else {
                            connection.release();
                            rows1[0]["is_doctor"] = false;
                            callback(null, rows1);
                        }
                    }
                });
            }
        });
    }

    updateData(user, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("UPDATE patient SET weight = ?, type_diabetes = ?, diabetes_treatment = ?, blood_sugar_min = ?, blood_sugar_max = ?, breakfast_quantity = ?, lunch_quantity = ?, dinner_quantity = ?, ratio = ? WHERE email = ?", [user.weight, user.type_diabetes, user.diabetes_treatment, user.blood_sugar_min, user.blood_sugar_max, user.breakfast_quantity, user.lunch_quantity, user.dinner_quantity, user.ratio, user.email],
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

    getUserImage(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT image FROM patient WHERE id = ?", [id],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length === 0){
                            connection.query("SELECT image FROM doctor WHERE id = ?", [id],
                            function(err, rows2){
                                connection.release();
                                if(err){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    if(rows2.length === 0){
                                        callback(null, false);
                                    }
                                    else {
                                        callback(null, rows2[0].image);
                                    }
                                }
                            });
                        }
                        else {
                            connection.release();
                            callback(null, rows1[0].image);
                        }
                    }
                });
            }
        });
    }

    searchPatient(name, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT full_name, email FROM patient WHERE full_name LIKE ?", ["%" + name + "%"],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows.length === 0){
                            callback(null, false);
                        }
                        else {
                            callback(null, rows);
                        }
                    }
                });
            }
        });
    }

    savePatientDoctor(name_doctor, name_patient, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT id FROM doctor WHERE full_name = ?", [name_doctor],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        connection.query("SELECT id FROM patient WHERE full_name = ?", [name_patient],
                        function(err, rows2){
                            if(err){
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                // Si ya existe que lo borre y no que lo inserte
                                connection.query("SELECT * FROM patient_doctor WHERE id_patient = ? AND id_doctor = ?", [rows2[0].id, rows1[0].id],
                                function(err, rows3){
                                    if(err){
                                        callback(new Error("Error de acceso a la base de datos"));
                                    }
                                    else {
                                        if(rows3.length === 0){
                                            connection.query("INSERT INTO patient_doctor (id_patient, id_doctor) VALUES (?, ?)", [rows2[0].id, rows1[0].id],
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
                                        else {
                                            connection.query("DELETE FROM patient_doctor WHERE id_patient = ? AND id_doctor = ?", [rows2[0].id, rows1[0].id],
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
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    getPatientDoctor(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT id_patient FROM patient_doctor WHERE id_doctor = ?", [id],
                function(err, rows1){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows1.length !== 0){
                            let lista = [];
                            let count = 0;
                            for(let i = 0; i < rows1.length; i++){
                                connection.query("SELECT * FROM patient WHERE id = ?", [rows1[i].id_patient],
                                function(err, rows2){
                                    if(err){
                                        callback(new Error("Error de acceso a la base de datos"));
                                    }
                                    else {
                                        lista.push(rows2[0]);
                                        count++;
                                        if (count === rows1.length) {
                                            connection.release();
                                            callback(null, lista);
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            connection.release();
                            callback(null);
                        }
                    }
                });
            }
        });
    }

}

module.exports = DAOUser;