const Sequelize = require("sequelize");
const hash = require("object-hash");
const { response } = require("express"); 
const sql = require('mssql');
const sqlConfig = {
    user: 'sa',
    password: 'sa',
    database: 'Category_Reports',
    server: 'localhost',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  }

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "8.217.176.252:3306",
  user: "root",
  password: "V2jUQTjVAyMhPIg",
  database: "Category_Reports"
});


// var sequelize = new Sequelize(
//     'd2ld2ku09851kr', 
//     'oeizxsqetprcmc', 
//     '5ef39859c1bbb57bd9eb781daf186d5d3bffb5f01576f2032106aa8ee2c47a72', 
//     {
//         host: 'ec2-54-167-168-52.compute-1.amazonaws.com',
//         dialect: 'postgres',
//         port: 5432,
//         dialectOptions: {
//             ssl: {rejectUnauthorized: false}
//     }
// });

// var sequelize = new Sequelize('postgres', 'postgres', '!Fsunny23', {
//     //    host: 'ec2-3-210-23-22.compute-1.amazonaws.com',
//         host: '127.0.0.1',
//         dialect: 'postgres',
//         port: 5432,
//         // dialectOptions: {
//         //     ssl: { rejectUnauthorized: false }
//         // }
//     });
    

// Initialize Sequelize to connect to sample DB
var sequelize = new Sequelize('Category_Main', 'sa', 'sa', {
    dialect: 'mssql',
    host: 'localhost',
    port: 1433, // Default port
    logging: false, // disable logging; default: console.log

    dialectOptions: {
        requestTimeout: 30000 // timeout = 30 seconds
    }
});


var sequelize = new Sequelize('Category_Main', 'root', 'V2jUQTjVAyMhPIg', {
    dialect: 'mysql',
    host: '8.217.176.252',
    port: 3306, // Default port
    logging: false, // disable logging; default: console.log

    dialectOptions: {
        requestTimeout: 30000 // timeout = 30 seconds
    }
});


var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    }, 
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
}, {
    createdAt: false, 
    updatedAt: true
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    departmentName: Sequelize.STRING
}, {
    createdAt: true,
    updatedAt: true
});

var adm = sequelize.define('adm', {
    username: {
        type: Sequelize.STRING,
        primaryKey: true,
        autoIncrement: false
    },
    pwd: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeNum: Sequelize.INTEGER
}, {
    createdAt: true,
    updatedAt: true
});

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {
            resolve();
        }).catch((err) => {
            console.log(err);
            reject("unable to sync the database");
        });
    });
}

module.exports.getAllEmployees = function() {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            order: ["employeeNum"]
        }).then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch((err) => {
            console.log(err);
            reject("no results returned");
        });
    });
}

module.exports.getDepartments = function() {
    return new Promise((resolve, reject) => {
        Department.findAll().then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch((err) => {
            console.log(err);
            reject("no results returned");
        });
    });
}

module.exports.getAdms = function() {
    return new Promise((resolve, reject) => {
        adm.findAll().then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data);        
        }).catch((err) => {
            console.log(err);
            reject("no results returned");
        })
    })
}

module.exports.getEmployeesByDepartment = function(department) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {department: department},
            order: ["employeeNum"]
        }).then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch((err) => {
            console.log(err);
            reject("no results returned");
        });
    });
}

module.exports.getManagers = function() {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {isManager: true},
            order: ["employeeNum"]
        }).then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch((err) => {
            console.log(err);
            reject("no results returned");
        });
    });
}

module.exports.getEmployeeByNum = function(num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {employeeNum: num}
        }).then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data[0]);
        }).catch((err) => {
            console.log(err);
            reject("no results returned");
        });
    });
}

module.exports.getDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {departmentId: id}
        }).then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data[0]);
        }).catch((err) => {
            console.log(err);
            reject("no results returned");
        });
    });
}

module.exports.getAdmByNam = function(nam) {
    return new Promise((resolve, reject) => {
        adm.findAll({
            where: {username: nam}
        }).then((data) => {
            data = data.map(value => value.dataValues);
            resolve(data[0]);
        }).catch((err) => {
            console.log(err);
            reject("no results returned");
        });
    });
}

module.exports.addEmployee = function(employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let prop in employeeData) {
            if (employeeData[prop] == '') {
                employeeData[prop] = null;
            }
        }
        Employee.create(employeeData).then(() => {
            resolve("employee added");
        }).catch(() => {
            reject("unable to create employee");
        });
    });
}

module.exports.addDepartment = function(departmentData) {
    return new Promise((resolve, reject) => {
        for (let prop in departmentData) {
            if (departmentData[prop] == '') {
                departmentData[prop] = null;
            }
        }
        if(departmentData.departmentName===null){
            reject("department name is empity");
        }
        Department.findAll({
            where: {departmentName: departmentData.departmentName}
        }).then((data) => {
                if (data.length != 0) {
                    reject("duplicate department");
                } else {
                    Department.create(departmentData).then(() => {
                        resolve("department added");
                    }).catch(() => {
                        reject("unable to create department");
                    });
                }
            }) 
        }
    );
}

module.exports.addAdm = function(admData) {
    return new Promise((resolve, reject) => {
        admData.isManager = (admData.isManager) ? true : false;
        let fieldOK = false;
        for (let prop in admData) {
            if (admData[prop] === '') {
                admData[prop] = null;
                fieldOK = false;
                break;
            } else {
                fieldOK = true;
            }
        }
        if (!fieldOK) {
            reject("Some fields left blank");
        } else {
            admData.pwd = hash(admData.pwd);
            adm.findAll({ where: { username: admData.username } }).then((data) => {
                if (data.length != 0) {
                    reject("This user already exists")
                } else {
                    Employee.findAll({ where: { employeeNum: admData.employeeNum } }).then((data) => {
                        if (data.length == 0) {
                            reject("This employee number does not exist")
                        } else {
                            adm.findAll({ where: { employeeNum: admData.employeeNum } }).then((data) => {
                                if (data.length != 0) {
                                    reject("There is already an account for this employee number")
                                } else {
                                    adm.create(admData).then(() => {
                                        resolve("user account added");
                                    }).catch(() => {
                                        reject("unable to create user account");
                                    });
                                }
                            })
                        }
                    })
                }
            }).catch(() => {
                reject("unable to create user account");
            })
        }
    });
}


module.exports.updateEmployee = function(employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let prop in employeeData) {
            if (employeeData[prop] == '') {
                employeeData[prop] = null;
            }
        }
        Employee.update(employeeData,{
            where: {employeeNum: employeeData.employeeNum}
        }).then(() => {
            resolve("employee successfully updated");
        }).catch(() => {
            reject("unable to update employee");
        });
    });
}

module.exports.updateDepartment = function(departmentData) {
    return new Promise((resolve, reject) => {
        for (let prop in departmentData) {
            if (departmentData[prop] == '') {
                departmentData[prop] = null;
            }
        }
        if(departmentData.departmentName===null){
            reject("department name is empity");
        }

        Department.findAll({
            where: {departmentName: departmentData.departmentName}
        }).then((data) => {
                if (data.length != 0) {
                    reject("duplicate department");
                } else {
                    Department.update(departmentData,{
                        where: {departmentId: departmentData.departmentId}
                    }).then(() => {
                        resolve("department successfully updated");
                    }).catch(() => {
                        reject("unable to update department");
                    });
                }
            })
        }
    );
}

module.exports.updateAdm = function(admData) {
    return new Promise((resolve, reject) => {
        admData.isManager = (admData.isManager) ? true : false;
        let fieldOK = false;
        for (let prop in admData) {
            if (admData[prop] === '') {
                admData[prop] = null;
                fieldOK = false;
                break;
            } else {
                fieldOK = true;
            }
        }
        if (!fieldOK) {
            reject("Some fields left blank");
        } else {
            admData.pwd = hash(admData.pwd);
            adm.update(admData, {
                where: { username: admData.username }
            }).then(() => {
                resolve("User account successfully updated");
            }).catch(() => {
                reject("unable to update user account");
            });
        };
    });
}

module.exports.deleteEmployeeByNum = function(empNum) {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: {employeeNum: empNum}
        }).then(() => {
            resolve("employee successfully deleted");
        }).catch(() =>{
            reject("unable to delete employee");
        })
    });
}

module.exports.deleteDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        Department.destroy({
            where: {departmentId: id}
        }).then(() => {
            resolve("department successfully deleted");
        }).catch(() =>{
            reject("unable to delete department");
        })
    });
}

module.exports.deleteAdmByNam = function(usrNam) {
    return new Promise((resolve, reject) => {
        adm.destroy({
            where: {username: usrNam}
        }).then(() => {
            resolve("User account successfully deleted");
        }).catch(() =>{
            reject("unable to delete user account");
        })
    });
}

module.exports.validateLogin = function(inputData) {
    inputData.pwd = hash(inputData.pwd);
    return new Promise((resolve, reject) => {
        adm.findAll({
            where: {username: inputData.username}
        }).then((usr) => {
            resolve(usr[0]);
        }).catch(() =>{
            reject("username not found");
        })
    });
}

module.exports.askforConfirm = ()=>{
    return new Promise((resolve, reject) => {
        let receive = "";
        (async () => {
            const response = await prompts({
            type: 'text',
            name: 'value',
            message: 'Are you sure you want delete this record?',
            validate: value => (value != "yes") ? `reqest cancelled` : true
            });
            receive = response.valye;
            console.log(response.value); // => { value: 24 }
        })().then(()=>{console.log("get value" + response);
            resolve(true);
            }
        ).catch((err)=>{
            console.log(err);
            reject(false);
        })
    })
}


var SystemLog = sequelize.define('SystemLog', {
    
    activityId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    activityType:Sequelize.STRING,
    activityTime: Sequelize.DATE,
    description: Sequelize.STRING
}, {
    createdAt: true,
    updatedAt: true
});

module.exports.addLog = function(logData) {
    // console.log(logData);
    return new Promise((resolve, reject) => {
        for (let prop in logData) {
            if (logData[prop] == '') {
                logData[prop] = null;
            }
        }
        SystemLog.create(logData).then(() => {
            resolve("log added");
        }).catch((err) => {
            console.log(err);
            reject("unable to create log");
        });
        }
    );
}


module.exports.getDataByQuery = function(qry) {
    // console.log(qry);
    return new Promise((resolve, reject) => {
        // sequelize.query("select 1 as dddddd", {
        //     type: sequelize.SELECT
        //   }).then((data)=>{
        //     data = data.map(value => value.dataValues);
        //     console.log(JSON.stringify(data[0], null, 2));
        //     resolve(data)
        //   }).catch((err) => {
        //     console.log(err);
        //     reject("no result returned");
        //   });

        // sql.connect(sqlConfig).then(()=>{
        //     sql.query(qry).then((result)=>{
        //         console.log(result);
        //         resolve(result);
        //     }).catch((err)=>{
        //         console.log(err);
        //         reject("no result returned");
        //     })
        // })

        let nameList = "";
        let errorString = "";
        // Create connection
        // sql.connect(sqlConfig, function (err) {

        sql.connect(sqlConfig).then(()=>{
          // Create Request object
          let sqlRequest = new sql.Request();
      
          // QueryString
        //   let queryString = `select * from NAME`;
          // Run the query
          sqlRequest.query(qry).then((data)=>{
            // data.recordset.forEach((el) => {
            //     nameList += '<li>${el.name}</li>';
            //   });
            //   resolve(nameList);
            // console.log(data.recordset);
            // data = data.recordset.map(value => value.dataValues);
            data = data.recordset;
            resolve(data);
        }).catch((err)=>{
                console.log(err);
                reject("get list error");
           })
        }).catch((err)=>{
            console.log(err);
            reject("connect error");
        });    
   });
}

