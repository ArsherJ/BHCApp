const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const saltRounds = 10;

let sql;

// MYSQL
var mysql = require("mysql");
// var connection = mysql.createConnection({
// host: "sql12.freemysqlhosting.net",
//   user: "sql12665534",
//   password: "lurSHfl4wN",
//   database: "sql12665534",
// });

var pool = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: "mysql-158200-0.cloudclusters.net",
  user: "admin",
  password: "mr5SD19J",
  database: "dasma_cho1",
  port: 10048, // Use the correct port number provided by CloudClusters
});
console.log("Pool Configurations:", pool.config);

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

console.log("Before pool.getConnection");
// function handleDisconnect() {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting connection from pool:", err);
//       setTimeout(handleDisconnect, 2000);
//       return;
//     }

//     connection.on("error", function (err) {
//       console.log("db error", err);
//       if (err.code === "PROTOCOL_CONNECTION_LOST") {
//         handleDisconnect();
//       } else {
//         throw err;
//       }
//     });
//     console.log("Connected to database:");
//     console.log("Host:", pool.config.connectionConfig.host);
//     console.log("User:", pool.config.connectionConfig.user);
//     console.log("User:", pool.config.connectionConfig.timeout);
//     console.log("Password:", pool.config.connectionConfig.password);
//     console.log("Database:", pool.config.connectionConfig.database);
//     console.log("connected as id " + connection.threadId);

//     // Additional logic or processing can be done here

//     connection.release();

//     // Log after successful connection
//     console.log("After pool.getConnection");
//   });
// }

// handleDisconnect();

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "dasma.cho1.emergency@gmail.com", // modify this as your authenticated gmail acc
    pass: "hclb qlce rhuz zjwo", // the gmail acc must enable the 2FA. Then search "App Passwords". Create one and use the password to this line
  },
  secure: true,
});

app.use(morgan("dev"));
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://bhc-client.vercel.app",
  "https://bhc-server.vercel.app",
  "https://dasma-cho1.com",
  "https://dasmacho1.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", api);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token:", token);
  if (!token) {
    return res.json({ error: "You are not authenticated." });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ error: "Token error." });
      } else {
        console.log("Decoded token:", decoded);
        req.user_id = decoded.user_id;
        req.first_name = decoded.first_name;
        req.last_name = decoded.last_name;
        req.birthday = decoded.birthday;
        req.contact = decoded.contact;
        req.address = decoded.address;
        req.sex = decoded.sex;
        req.email = decoded.email;
        req.username = decoded.username;
        req.role = decoded.role;

        next();
      }
    });
  }
};

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({
      message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
      db_pool: connection.threadId,
    });
  });
});

app.get("/verify", verifyUser, (req, res) => {
  return res.json({
    status: "Success",
    user_id: req.user_id,
    first_name: req.first_name,
    last_name: req.last_name,
    birthday: req.birthday,
    contact: req.contact,
    address: req.address,
    sex: req.sex,
    email: req.email,
    username: req.username,
    role: req.role,
  });
});

// registration
app.post("/register", (req, res) => {
  const body = req.body;

  const {
    first_name,
    last_name,
    birthday,
    contact,
    address,
    sex,
    email,
    username,
    password,
    confirmPassword,
  } = body;

  const role = "user";

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      return res.status(500).json({ error: "Hashing error" });
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting connection from pool: " + err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const sql = `INSERT INTO bhc_app_user (first_name, last_name, birthday, contact, address, sex, email, username, password, role) VALUES (?,?,?,?,?,?,?,?,?,?)`;

      connection.query(
        sql,
        [
          first_name,
          last_name,
          birthday,
          contact,
          address,
          sex,
          email,
          username,
          hash,
          role,
        ],
        (err) => {
          connection.release();
          if (err) {
            console.error("Error executing query: " + err.message);
            return res.status(500).json({ error: err.message });
          }

          return res.json({ code: 200, message: "success" });
        }
      );
    });
  });
});

// patient records
app.get("/patients", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = "SELECT * FROM bhc_app_user WHERE role = 'user'";
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: err.message });
      }

      console.log("DATA PATIENTS:", data);
      return res.json(data);
    });
  });
});

app.put("/patients", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `UPDATE bhc_app_user SET 
            cesarean_section = ?, 
            philhealth_status = ?,
            philhealth_id = ?,
            head_of_the_family = ?,
            covid_status = ?,
            tobacco_use = ?,
            blood_pressure = ?,
            per_rectum = ?,
            weight = ?,
            height = ?,
            bmi = ?,
            temperature = ?,
            pwd = ?,
            senior = ?,
            injury = ?,
            mental_health = ?
            WHERE id = ?`;

    const {
      cesarean_section,
      philhealth_status,
      philhealth_id,
      head_of_the_family,
      covid_status,
      tobacco_use,
      blood_pressure,
      per_rectum,
      weight,
      height,
      bmi,
      temperature,
      pwd,
      senior,
      injury,
      mental_health,
      id: user_id,
    } = req.body;

    connection.query(
      sql,
      [
        cesarean_section,
        philhealth_status,
        philhealth_id,
        head_of_the_family,
        covid_status,
        tobacco_use,
        blood_pressure,
        per_rectum,
        weight,
        height,
        bmi,
        temperature,
        pwd,
        senior,
        injury,
        mental_health,
        user_id,
      ],
      (err) => {
        connection.release();
        if (err) {
          console.error("Error executing query: " + err.message);
          return res.status(500).json({ error: err.message });
        }

        return res.json({ status: "Success" });
      }
    );
  });
});

app.get("/user", (req, res) => {
  console.log("requesstt:", req.query.user_id);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const sql = "SELECT * FROM bhc_app_user WHERE id = ?";

    connection.query(sql, [req.query.id], (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: err.message });
      }

      console.log("DATA USER:", data);
      return res.json(data);
    });
  });
});

app.put("/user", (req, res) => {
  console.log("reqBody:", req.body);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `UPDATE bhc_app_user SET 
            first_name = ?,
            last_name = ?,
            birthday = ?,
            contact = ?,
            address = ?,
            sex = ?,
            email = ?,
            username = ?,
            role = ?
            WHERE id = ?`;

    const {
      first_name,
      last_name,
      birthday,
      contact,
      address,
      sex,
      email,
      username,
      role,
      user_id,
    } = req.body;

    connection.query(
      sql,
      [
        first_name,
        last_name,
        birthday,
        contact,
        address,
        sex,
        email,
        username,
        role,
        user_id,
      ],
      (err) => {
        connection.release();
        if (err) {
          console.error("Error executing query: " + err.message);
          return res.status(500).json({ error: err.message });
        }

        res.clearCookie("token", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          domain: ".bhc-server.vercel.app",
        });

        // Generate a new token with updated user information
        const newToken = jwt.sign(
          {
            user_id: user_id,
            username: username,
            first_name: first_name,
            last_name: last_name,
            birthday: birthday,
            contact: contact,
            address: address,
            sex: sex,
            email: email,
            role: role,
          },
          "jwt-secret-key",
          {
            expiresIn: "1d",
          }
        );

        // Send the new token in the response
        res.cookie("token", newToken, {
          secure: true,
          httpOnly: true,
          sameSite: "None",
          domain: ".bhc-server.vercel.app",
        });

        return res.json({ status: "Success", newToken: newToken });
      }
    );
  });
});

app.delete("/user", (req, res) => {
  const userId = req.body.userId;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const sql = "DELETE FROM bhc_app_user WHERE id = ?";
    connection.query(sql, [userId], (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: err.message });
      }
      return res.json({ status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM bhc_app_user WHERE username = ?";
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("errpool:", err);
      console.error("Error getting connection from pool: ");
      return res.status(500).json({ error: "Database Pool Connection Error" });
    }

    connection.query(sql, [username], (err, data) => {
      if (err) {
        connection.release();
        return res.json({ error: "Login Error" });
      }

      if (data && data.length > 0) {
        const user = data[0];

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            connection.release();
            return res.json({ error: "Password error" });
          }

          if (result) {
            // console.log('READING HEHEHEANDS')
            res.clearCookie("token", {
              httpOnly: true,
              sameSite: "None",
              secure: true,
              domain: ".bhc-server.vercel.app",
            });
            const token = jwt.sign(
              {
                user_id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                birthday: user.birthday,
                contact: user.contact,
                address: user.address,
                sex: user.sex,
                email: user.email,
                role: user.role,
              },
              "jwt-secret-key",
              {
                expiresIn: "1d",
              }
            );

            res.cookie("token", token, {
              secure: true,
              httpOnly: true,
              sameSite: "None",
              domain: ".bhc-server.vercel.app",
            });

            connection.release();
            return res.json({ status: "Success" });
          } else {
            connection.release();
            return res.json({ error: "Password doesn't match" });
          }
        });
      } else {
        connection.release();
        return res.json({ error: "Username doesn't exist" });
      }
    });
  });
});

app.get("/logout", (req, res) => {
  console.log("Logout");
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    domain: ".bhc-server.vercel.app",
  });
  return res.json({ status: "Success" });
});

// Appointment
app.get("/appointment", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `SELECT 
                    baa.id,
                    baa.appointment_date, 
                    baa.appointment_time, 
                    baa.appointment_reason, 
                    baa.appointment_status, 
                    CONCAT(bu.first_name, ' ', bu.last_name) AS name 
                  FROM bhc_app_appointment baa 
                  JOIN bhc_app_user bu 
                    ON bu.id = baa.patient_id;`;

    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: err.message });
      }

      return res.json(data);
    });
  });
});

app.post("/appointment", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `INSERT INTO bhc_app_appointment (appointment_date, appointment_time, appointment_reason, appointment_status, patient_id) VALUES (?,?,?,?,?)`;

    const appointmentDateValue =
      req.body.appointmentDetails.appointmentDateValue.startDate;
    const appointmentTime = req.body.appointmentDetails.appointmentTime;
    const appointmentReason = req.body.appointmentDetails.appointmentReason;
    const appointmentStatus = 2;
    const patientId = req.body.userDetails.user_id;

    connection.query(
      sql,
      [
        appointmentDateValue,
        appointmentTime,
        appointmentReason,
        appointmentStatus,
        patientId,
      ],
      (err) => {
        connection.release();
        if (err) {
          console.error("Error executing query: " + err.message);
          return res.status(500).json({ error: err.message });
        }

        return res.json({ status: "Success" });
      }
    );
  });
});

app.put("/appointment", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `UPDATE bhc_app_appointment SET appointment_status = ? WHERE id = ?`;
    const appointmentStatus = req.body.status;
    const appointmentId = req.body.id;

    connection.query(sql, [appointmentStatus, appointmentId], (err) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: err.message });
      }

      return res.json({ status: "Success" });
    });
  });
});

app.put("/appointment-bulk", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const bulkData = req.body.selectedAppointmentRows;
    const appointmentStatus = req.body.status;
    let completed = 0;
    const sql = `UPDATE bhc_app_appointment SET appointment_status = ? WHERE id = ?`;

    for (const data of bulkData) {
      const { id } = data;

      connection.query(sql, [appointmentStatus, id], (err) => {
        if (err) {
          console.error("Error executing query: " + err.message);
          connection.release();
          return res.status(500).json({ error: err.message });
        } else {
          completed++;
          if (completed === bulkData.length) {
            connection.release();
            return res.json({ status: "Success" });
          }
        }
      });
    }
  });
});

// DOCTORS
app.get("/doctors", (req, res) => {
  console.log("HELLO was here doctorissnsg");
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `SELECT id, name, position, specialty, status, image FROM bhc_app_doctor`;

    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: err.message });
      }

      const convertedData = data.map((row) => {
        let status = "";
        if (row.status === 0) {
          status = "ONLEAVE";
        } else if (row.status === 1) {
          status = "ACTIVE";
        } else if (row.status === 2) {
          status = "INACTIVE";
        }
        console.log("dataRow:", data);
        if (row.image) {
          const imageHead = "data:image/jpeg;base64,";
          const blobData = Buffer.from(row.image).toString("base64");
          if (row.image) {
            return {
              id: row.id,
              name: row.name,
              position: row.position,
              specialty: row.specialty,
              status: status,
              image: row.image ? `${imageHead}${blobData}` : "",
            };
          }
        } else {
          return {
            id: row.id,
            name: row.name,
            position: row.position,
            specialty: row.specialty,
            status: status,
            image: row.image,
          };
        }
      });

      return res.json(convertedData);
    });
  });
});

app.post("/doctors", upload.single("image"), (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `INSERT INTO bhc_app_doctor (name, position, specialty, status, image) VALUES (?,?,?,?,?)`;
    const { name, position, specialty } = req.body;
    const status = req.body.status || "2";
    let image;
    if (req.body.image) {
      image = undefined;
    } else if (req.file) {
      image = req.file.buffer;
    }

    connection.query(sql, [name, position, specialty, status, image], (err) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: "Failed to add doctor" });
      }

      return res.json({ status: "Success" });
    });
  });
});

app.put("/doctors", upload.single("image"), (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `UPDATE bhc_app_doctor SET name = ?, position = ?, specialty = ?, status = ?, image = ? WHERE id = ?`;
    const { name, position, specialty } = req.body;
    let status = req.body.status === "INACTIVE" ? "2" : req.body.status;
    let image;
    if (req.body.image) {
      image = undefined;
    } else if (req.file) {
      image = req.file.buffer;
    }
    const doctorId = req.body.id;

    connection.query(
      sql,
      [name, position, specialty, status, image, doctorId],
      (err) => {
        connection.release();
        if (err) {
          console.error("Error executing query: " + err.message);
          return res.status(500).json({ error: "Failed to update doctor" });
        }

        return res.json({ status: "Success" });
      }
    );
  });
});

app.delete("/doctors", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `DELETE FROM bhc_app_doctor WHERE id = ?`;
    const doctorId = req.body.id;

    connection.query(sql, [doctorId], (err) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: "Failed to delete doctor" });
      }

      return res.json({ status: "Success" });
    });
  });
});

// Inventory
app.post("/inventory", upload.single("image"), (req, res) => {
  // console.log('req.file.buffer', req.file)
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `INSERT INTO bhc_app_inventory (medicine, dosage, type, quantity, image) VALUES (?,?,?,?,?)`;
    const { medicine, dosage, type, quantity } = req.body;
    let image;
    if (req.body.image) {
      image = undefined;
    } else if (req.file) {
      console.log("buffer:", req.file);
      image = req.file.buffer;
    }

    connection.query(sql, [medicine, dosage, type, quantity, image], (err) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to insert into inventory" });
      }

      return res.json({ status: "Success" });
    });
  });
});

app.get("/inventory", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `SELECT id, medicine, dosage, type, quantity, image FROM bhc_app_inventory`;

    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: "Failed to fetch inventory" });
      }

      // Convert binary blob data to Base64 data URI
      const convertedData = data.map((row) => {
        if (row.image || row.image !== null) {
          const imageHead = "data:image/jpeg;base64,";
          const blobData = Buffer.from(row.image).toString("base64");
          return {
            id: row.id,
            medicine: row.medicine,
            dosage: row.dosage,
            type: row.type,
            quantity: row.quantity,
            image: row.image ? `${imageHead}${blobData}` : "",
          };
        } else {
          return row;
        }
      });

      return res.json(convertedData);
    });
  });
});

app.put("/inventory", upload.single("image"), (req, res) => {
  console.log("REQBODY:", req.body);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `UPDATE bhc_app_inventory SET medicine = ?, dosage = ?, type = ?, quantity = ?, image = ? WHERE id = ?`;
    const { medicine, dosage, type, quantity } = req.body;
    let image;
    if (req.body.image) {
      image = undefined;
    } else if (req.file) {
      image = req.file.buffer;
    }
    const inventoryId = req.body.id;

    connection.query(
      sql,
      [medicine, dosage, type, quantity, image, inventoryId],
      (err) => {
        connection.release();
        if (err) {
          console.error("Error executing query: " + err.message);
          return res.status(500).json({ error: "Failed to update inventory" });
        }

        return res.json({ status: "Success" });
      }
    );
  });
});

app.put("/inventory-quantity", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `UPDATE bhc_app_inventory SET quantity = ? WHERE id = ?`;
    const { quantity } = req.body;
    const inventoryId = req.body.id;

    connection.query(sql, [quantity, inventoryId], (err) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: "Failed to update inventory" });
      }

      return res.json({ status: "Success" });
    });
  });
});

app.delete("/inventory", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `DELETE FROM bhc_app_inventory WHERE id = ?`;
    const inventoryId = req.body.id;

    connection.query(sql, [inventoryId], (err) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res
          .status(500)
          .json({ error: "Failed to delete from inventory" });
      }

      return res.json({ status: "Success" });
    });
  });
});

// news and updates
app.get("/news-updates", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `SELECT * FROM bhc_app_news_updates`;

    connection.query(sql, (err, data) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: "Database Error" });
      }

      const convertedData = data.map((row) => {
        if (row.image || row.image !== null) {
          const imageHead = "data:image/jpeg;base64,";
          const blobData = Buffer.from(row.image).toString("base64");
          return {
            id: row.id,
            headline: row.headline,
            fb_link: row.fb_link,
            image: row.image ? `${imageHead}${blobData}` : "",
          };
        } else return row;
      });

      return res.json(convertedData);
    });
  });
});

app.put("/news-updates", upload.single("image"), (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `UPDATE bhc_app_news_updates SET image = ?, headline = ?, fb_link = ? WHERE id = ?`;
    let image;
    if (req.body.image) {
      image = undefined;
    } else if (req.file) {
      image = req.file.buffer;
    }
    const { headline, fb_link, id } = req.body;

    connection.query(sql, [image, headline, fb_link, id], (err) => {
      connection.release();
      if (err) {
        console.error("Error executing query: " + err.message);
        return res.status(500).json({ error: "Failed to update news update" });
      }

      return res.json({ status: "Success" });
    });
  });
});

app.post("/news-updates", upload.single("image"), (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `INSERT INTO bhc_app_news_updates (image, headline, fb_link) VALUES (?,?,?)`;
    let imageBuffer = req.file ? req.file.buffer : null;
    const headline = req.body.headline;
    const fb_link = req.body.fb_link;

    connection.query(sql, [imageBuffer, headline, fb_link], (err) => {
      connection.release();

      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to add news update" });
      }

      return res.json({ status: "Success" });
    });
  });
});

app.delete("/news-updates", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `DELETE FROM bhc_app_news_updates WHERE id = ?`;
    const newsId = req.body.id;

    connection.query(sql, [newsId], (err) => {
      connection.release();

      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to delete news update" });
      }

      return res.json({ status: "Success" });
    });
  });
});

app.get("/emergency", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql =
      "SELECT location, subject, message, created_date, sender_email FROM bhc_app_emergency";

    connection.query(sql, (err, data) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Failed to fetch emergency details" });
      }

      connection.release();
      return res.status(200).json(data);
    });
  });
});

app.post("/email-emergency", (req, res) => {
  console.log("EMAIL ReQ:", req.body);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `INSERT INTO bhc_app_emergency (location, subject, message, created_date, sender_email) VALUES (?,?,?,?,?)`;
    const { emergencyDetails, userDetails } = req.body;
    const { emergencyLocation, emergencySubject, emergencyMessage } =
      emergencyDetails;
    const { email, first_name, last_name, address, contact } = userDetails;
    const UserFullName = first_name + "" + last_name;
    const dateNow = new Date();

    let date = ("0" + dateNow.getDate()).slice(-2);
    let month = ("0" + (dateNow.getMonth() + 1)).slice(-2);
    let year = dateNow.getFullYear();
    let hours = dateNow.getHours();
    let minutes = dateNow.getMinutes();
    let seconds = dateNow.getSeconds();

    const createdDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

    const mailData = {
      from: "dasma.cho1.emergency@gmail.com", // modify this as your authenticated gmail acc
      to: "cho3emergency@gmail.com", // recipient, change to hospitals email
      subject: emergencySubject,
      // text: req.body.emergencyLocation + "\n" + req.body.emergencyMessage,
      html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>${emergencySubject}</title>
          </head>
          <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; text-align: center;">Emergency Message</h2>
              <p><strong>Location:</strong> ${emergencyLocation}</p>
              <p><strong>Message:</strong> ${emergencyMessage}</p>
              <p><strong>Sent by:</strong> ${UserFullName}</p>
              <p><strong>Registered Email:</strong> ${email}</p>
              <p><strong>Contact Number:</strong> ${contact}</p>
              <p><strong>Registered Address:</strong> ${address}</p>
              <p><strong>Date and Time sent:</strong> ${createdDate}</p>
            </div>
          </body>
        </html>
        `,
    };

    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err.message);
        connection.release();
        return res
          .status(500)
          .json({ status: "Error", message: "Failed to send email" });
      } else {
        connection.query(
          sql,
          [
            emergencyLocation,
            emergencySubject,
            emergencyMessage,
            createdDate,
            email,
          ],
          (err) => {
            connection.release();

            if (err) {
              console.error(err.message);
              return res.status(500).json({
                status: "Error",
                message: "Failed to insert into the database",
              });
            }

            console.log(info);
            return res.json({ status: "Success" });
          }
        );
      }
    });
  });
});

// api for change password
app.post("/change-password", (req, res) => {
  console.log("REQBODYPASSWORD:", req.body);
  const sqlUpdate = `UPDATE bhc_app_user SET password = ? WHERE id = ?`;
  const sqlSelect = `SELECT first_name, last_name, password FROM bhc_app_user WHERE id = ?`;

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const userId = req.body.user_id;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    connection.query(sqlSelect, [userId], (err, data) => {
      if (err) {
        return res.json({ error: "Database connection error" });
      }

      connection.query(sqlSelect, [userId], (err, data) => {
        if (err) {
          connection.release();
          return res.json({ error: "Query error" });
        }

        bcrypt.compare(oldPassword, data[0].password, (err, result) => {
          if (err) {
            connection.release();
            return res.json({ error: "Encryption error" });
          }

          if (result) {
            bcrypt.hash(newPassword, saltRounds, (err, hash) => {
              if (err) {
                connection.release();
                return res.json({ error: "Hashing error" });
              }

              connection.query(sqlUpdate, [hash, userId], (err) => {
                connection.release();
                if (err) {
                  return res.json({ error: "Update error" });
                }
                return res.json({ status: "Success" });
              });
            });
          } else {
            connection.release();
            return res.json({ status: "Failed" });
          }
        });
      });
    });
  });
});

// api for record-table
app.get("/record-table", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `SELECT 
                    id,
                    date,
                    illness_history,
                    physical_exam,
                    assessment,
                    treatment_plan,
                    user_id,
                    notes
                  FROM bhc_app_record`;

    connection.query(sql, (err, data) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: err.message });
      }

      return res.json(data);
    });
  });
});

// api for insert record-table
app.post("/record-table", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `INSERT INTO bhc_app_record (date, illness_history, physical_exam, assessment, treatment_plan, user_id, notes) VALUES (?,?,?,?,?,?,?)`;

    const date = req.body.userRecord.date;
    const illness_history = req.body.userRecord.illness_history;
    const physical_exam = req.body.userRecord.physical_exam;
    const assessment = req.body.userRecord.assessment;
    const treatment_plan = req.body.userRecord.treatment_plan;
    const user_id = req.body.userRecord.user_id;
    const notes = req.body.userRecord.notes;

    connection.query(
      sql,
      [
        date,
        illness_history,
        physical_exam,
        assessment,
        treatment_plan,
        user_id,
        notes,
      ],
      (err) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: err.message });
        }

        return res.json({ status: "Success" });
      }
    );
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
