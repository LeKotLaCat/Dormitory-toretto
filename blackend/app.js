// server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const { db } = require('./db'); 
const { verifyToken } = require('./middleware/auth.middleware');

const app = express();
const port = 3000;

const cors = require('cors');

const allowedOrigins = ['http://localhost:8000'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role, firstname: user.firstname, room: user.RoomID, },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
};

app.post('/auth/register', (req, res, next) => {
    const {
        username, password, email, firstName, lastName, dateOfBirth, address, telephone
    } = req.body;
    //const createat = new Date(); // Removed: Use datetime('now') in SQL
    const RoomID = null;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });
    }

    db.all('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (error, existingUsers) => {
        if (error) {
            return next(error);
        }

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'ข้อมูลซ้ำ' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }

            const sql = `INSERT INTO users (username, password, email, firstname, lastname, dob, address, telephone, createat, RoomID, role, userImg)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)
            `;

            db.run(sql, [username, hashedPassword, email, firstName, lastName, dateOfBirth, address, telephone, RoomID, 'user', null], function (error) { // Use function() to access 'this'
                if (error) {
                    return next(error);
                }
                res.status(201).json({ message: 'สมัครสำเร็จ' });
            });
        });
    });
});

app.post('/auth/login', (req, res, next) => {
    const { userIdentifier, password } = req.body;
    if (!userIdentifier || !password) {
        return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });
    }

    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [userIdentifier, userIdentifier], (error, user) => {
        if (error) {
            return next(error);
        }

        if (!user) { // Use !user instead of results.length === 0
            return res.status(401).json({ message: 'ไม่พบ username หรือ email' });
        }

        bcrypt.compare(password, user.password, (err, passwordMatch) => {
            if (err) {
                return next(err);
            }

            if (!passwordMatch) {
                return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
            }

            const accessToken = generateAccessToken(user);
            res.cookie('token', accessToken, { httpOnly: true, maxAge: 3600000, secure: process.env.NODE_ENV === 'production' });
            console.log(user.RoomID);
            res.status(200).json({ role: user.role , room: user.RoomID});
        });
    });
});

app.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/auth/users', verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบที่สามารถใช้คำสั่งนี้ได้' });
    }

    db.all('SELECT id, firstname, lastname FROM users', (error, users) => {
        if (error) {
            return next(error);
        }
        res.status(200).json(users);
    });
});

app.get('/auth/profile', verifyToken, (req, res, next) => {
    const userId = req.user.id;

    if (!req.user) {
        return res.status(403).json({ message: 'โปรดเข้าสู่ระบบ' });
    }

    const sql = `SELECT users.firstname, users.lastname, users.address, users.telephone, users.email, users.userimg, users.RoomID, room.roomname,
    room.roomTypeId FROM users LEFT JOIN room ON users.RoomID = room.id WHERE users.id = ?`;

    db.get(sql, [userId], (error, user) => { 
        if (error) {
            return next(error);
        }

        if (!user) {
            return res.status(404).json({ message: 'ไม่พบบัญชีผู้ใช้' });
        }
        res.status(200).json(user);
    });
});


app.get('/auth/id/:uid', verifyToken, (req, res, next) => {
    const userId = req.params.uid;
    if (!req.user) {
        return res.status(403).json({ message: 'โปรดเข้าสู่ระบบ' });
    }
    db.get(`SELECT firstname, lastname, address, telephone, email, userimg FROM users WHERE id = ?`, [userId], (error, user) => { 
        if (error) {
            return next(error);
        }

        if (!user) {
            return res.status(404).json({ message: 'ไม่พบบัญชีผู้ใช้' });
        }

        res.status(200).json(user);
    });
});

app.put('/auth/edit', verifyToken, (req, res, next) => {
    const userId = req.user.id;
    const { firstname, lastname, address, telephone, email, userImg } = req.body;
    let sql = 'UPDATE users SET firstname = ?, lastname = ?, address = ?, telephone = ?, email = ?';
    const params = [firstname, lastname, address, telephone, email];

    if (typeof userImg === 'string') {
        sql += ', userimg = ?';
        params.push(userImg);
    }
    sql += ' WHERE id = ?';
    params.push(userId);

    db.run(sql, params, function (error) {
        if (error) {
            return next(error);
        }
        res.status(200).json({ message: 'บันทึกข้อมูลเสร็จสิ้น' });
    });
});

// -------------------- AUTH --------------------

// -------------------- Room --------------------

app.get('/rooms', verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบที่ใช้คำสั่งนี้ได้' });
    }
    db.all(`SELECT id, roomName, description, roomTypeId, floor, renterID, roomImg FROM room`, (error, rooms) => {
        if (error) {
            return next(error);
        }
        res.status(200).json({ rooms });
    });
});
app.get('/rooms/:roomId', verifyToken, (req, res, next) => {
    const { roomId } = req.params;

    if (!roomId) {
        return res.status(400).json({ message: 'โปรดกรอก เลขห้อง' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบที่ใช้คำสั่งนี้ได้' });
    }

    db.get(`SELECT id, roomName, description, roomTypeId, floor, renterID FROM room WHERE id = ?`, [roomId], (error, room) => {
        if (error) {
            return next(error);
        }

        if (!room) {
            return res.status(404).json({ message: 'ไม่พบเลขห้องในระบบ' });
        }

        res.status(200).json({ room: room });
    });
});
app.post('/rooms', verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบที่ใช้คำสั่งนี้ได้' });
    }

    const { roomName, description, roomTypeId, floor, userId, roomImg } = req.body;
    if (!roomName || typeof roomName !== 'string' || roomName.length < 3 || roomName.length > 255) {
        return res.status(400).json({ message: 'ข้อมูล ชื่อห้อง ไม่ถูกต้อง' });
    }
    if (!description || typeof description !== 'string' || description.length < 3 || description.length > 255) {
        return res.status(400).json({ message: 'ข้อมูล คำอธิบาย ไม่ถูกต้อง' });
    }
    if (!roomTypeId) {
        return res.status(400).json({ message: 'ข้อมูล ประเภทห้อง ไม่ถูกต้อง' });
    }
    if (!floor) {
        return res.status(400).json({ message: 'ข้อมูล ชั้น ไม่ถูกต้อง' });
    }
    if (userId !== undefined && userId !== null && (typeof userId !== 'string' || userId.length > 255)) {
        return res.status(400).json({ message: 'ข้อมูล รหัสประจำตัวของผู้ใช้ ไม่ถูกต้อง' });
    }
    const sql = `INSERT INTO room (roomName, description, roomTypeId, floor, renterID, roomImg) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [roomName, description, roomTypeId, floor, null, roomImg], function (error) {
        if (error) {
            return res.status(409).json({ message: error })
        }

        res.status(201).json({ roomId: this.lastID });
    });
});
app.delete('/rooms/:roomId', verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบที่ใช้คำสั่งนี้ได้' });
    }

    const { roomId } = req.params;
    if (!roomId) {
        return res.status(400).json({ message: 'โปรดกรอก รหัสห้อง' });
    }

    db.run(`DELETE FROM room WHERE id = ?`, [roomId], function (error) {
        if (error) {
            return next(error);
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'ไม่พบห้องในระบบ' });
        }

        res.status(200).json({ message: 'ลบห้อง สำเร็จ' });
    });
});
app.put('/rooms/:roomId', verifyToken, (req, res, next) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบที่ใช้คำสั่งนี้ได้' });
    }

    const { roomId } = req.params;
    if (!roomId) {
        return res.status(400).json({ message: 'โปรดกรอก รหัสห้อง' });
    }

    const { roomName, description, roomTypeId, floor, userId, roomImg } = req.body;
    if (roomName !== undefined && (typeof roomName !== 'string' || roomName.length < 3 || roomName.length > 255)) {
        return res.status(400).json({ message: 'ไม่พบ roomName' });
    }
    if (description !== undefined && (typeof description !== 'string' || description.length < 3 || description.length > 255)) {
        return res.status(400).json({ message: 'ไม่พบ description' });
    }
    if (roomTypeId !== undefined && (typeof roomTypeId !== 'string' || roomTypeId.length <= 0)) {
        return res.status(400).json({ message: 'ไม่พบ roomTypeId' });
    }
    if (floor !== undefined && (typeof floor !== 'string' || floor.length <= 0)) {
        return res.status(400).json({ message: 'ไม่พบ floor' });
    }
    if (userId !== undefined && userId !== null && (typeof userId !== 'string' || userId.length > 255)) {
        return res.status(400).json({ message: 'ไม่พบ userId' });
    }

    const updates = [];
    const params = [];

    if (roomName !== undefined) {
        updates.push('roomName = ?');
        params.push(roomName);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
    }
    if (roomTypeId !== undefined) {
        updates.push('roomTypeId = ?');
        params.push(roomTypeId);
    }
    if (floor !== undefined) {
        updates.push('floor = ?');
        params.push(floor);
    }

    if (userId !== undefined) {
        updates.push('renterID = ?');
        params.push(userId);
    }

    if (roomImg !== undefined) {
        updates.push('roomImg = ?');
        params.push(roomImg);
    }

    if (updates.length === 0) {
        return res.status(400);
    }

    const sql = `UPDATE room SET ${updates.join(', ')} WHERE id = ?`;
    params.push(roomId);


    db.run(sql, params, function (error) {
        if (error) {
            return next(error);
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'ไม่พบห้อง' });
        }

        res.status(200).json({ message: 'อัปเดตห้องสำเร็จ' });
    });
});
app.put('/rooms/:roomId/clear', verifyToken, (req, res, next) => {
    const { roomId } = req.params;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบที่ใช้คำสั่งนี้ได้' });
    }
    db.get(`SELECT renterID FROM room WHERE id = ?`, [roomId], (error, result) => {
        if (error) {
            return next(error);
        }
        if (result.length === 0 || !result.renterID) {
            return res.status(404).json({ message: 'ไม่พบห้อง' });
        }
        const renterID = result.renterID;
        db.run(`UPDATE room SET renterID = NULL WHERE id = ?`, [roomId], function (error) {
            if (error) {
                return next(error);
            }
            db.run(`UPDATE users SET RoomID = NULL WHERE id = ?`, [renterID], function(error) {
                if (error) {
                    return next(error);
                }

                res.json({ message: 'ลบผู้เช่าห้องสำเร็จ' });
            });
        });
    });
});

app.put('/rooms/:roomId/assign', verifyToken, (req, res, next) => {
    const { roomId } = req.params;
    const { userId } = req.body;

    if (!roomId || !userId) {
        return res.status(400).json({ message: 'ระบบไม่ได้รับ' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบ' });
    }

    db.get(`SELECT id FROM room WHERE renterID = ?`, userId, (error, userResult) => { 
        if (error) {
            return next(error);
        }

        if (userResult) {
            return res.status(409).json({ message: 'ผู้ใช้มีห้องพัก' });
        }

        db.run(`UPDATE room SET renterID = ? WHERE id = ?`, [userId, roomId], function (error) {
            if (error) {
                return next(error);
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: 'ไม่พบห้องในระบบ' });
            }

            db.run(`UPDATE users SET RoomID = ? WHERE id = ?`, [roomId, userId], function (error) {
                if (error) {
                    return next(error);
                }
                if (this.changes === 0) {
                    return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
                }
                res.status(200).json({ message: 'เพิ่มผู้ใช้เข้าห้องพักสำเร็จ' });

            });
        });
    });
});
app.put('/assignByq', verifyToken, (req, res, next) => {
    const { roomId, userId } = req.body;
    console.log(roomId, userId)
    if (!roomId || !userId) {
        return res.status(400).json({ message: 'ระบบไม่ได้ระบบ เลขห้องและรหัสประจำตัวผู้ใช้' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบ' });
    }
    db.get(`SELECT id FROM room WHERE renterID = ?`, userId, (error, userResult) => {
        if (error) {
            return next(error);
        }

        if (userResult) {
            return res.status(409).json({ message: 'ผู้ใช้มีห้องอยู่แล้ว' });
        }
        db.run(`UPDATE room SET renterID = ? WHERE id = ?`, [userId, roomId], function (error) {
            if (error) {
                return next(error);
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'ไม่พบห้องในระบบ' });
            }

            db.run(`UPDATE users SET RoomID = ? WHERE id = ?`, [roomId, userId], function(error) { 
                if (error) {
                    return next(error);
                }
                if (this.changes === 0) {
                    return res.status(404).json({ message: ' ไม่พบผู้ใช้' });
                }
                db.run(`DELETE FROM Queue WHERE userId = ?`, [userId], function(error) {
                    if (error) {
                        return next(error);
                    }
                    if (this.changes === 0) {
                        return res.status(404).json({ message: ' ไม่พบคิว' });
                    }
                    res.status(200).json({ message: 'เพิ่มห้องให้ผู้ใช้เสร็จสิ้น' });
                });
            });
        });
    });
});

// -------------------- Chat --------------------

app.get('/chat', verifyToken, (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "กรุณา login" });
    }

    db.all('SELECT id, message, timestamp FROM chatDataBase ORDER BY timestamp DESC', [], (error, chats) => {
        if (error) {
            return next(error);
        }
        res.status(200).json(chats);
    });
});

app.post('/chat', verifyToken, (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'กรุณา login' });
    }
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'กรุณากรอกข้อความ' });
    }

    const timestamp = new Date(); // Removed

    db.run(
        "INSERT INTO chatDataBase (message, timestamp) VALUES (?, datetime('now', '+7 hours'))",
        [message],
        function (error) {
            if (error) {
                return next(error);
            }

            db.get( // Use db.get()
                'SELECT * FROM chatDataBase WHERE id = ?',
                [this.lastID],
                (error, insertedChat) => {
                    if (error) {
                        return next(error);
                    }

                    if (!insertedChat) {
                        return res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
                    }
                    res.status(201).json({ insertedChat: insertedChat });
                }
            );
        }
    );
});

// -------------------- Chat --------------------

// -------------------- Queue --------------------
app.post('/queue/:roomTypeId', verifyToken, (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "กรุณา login" });
    }
    const { roomTypeId } = req.params;
    const { description, bookingDate, bookingTime } = req.body;
    const queueDate = new Date();
    const userId = req.user.id;
    db.get('SELECT COUNT(id) as vacantCount FROM room WHERE roomTypeId = ?', [roomTypeId], (err, vacantResult) => {
        if (err) {
            return next(err);
        }

        db.get('SELECT COUNT(id) as unavailableCount FROM room WHERE roomTypeId = ? AND renterID IS NOT NULL', [roomTypeId], (err, unavailableResult) => { 
            if (err) {
                return next(err);
            }

            db.get('SELECT COUNT(id) as queueCount FROM Queue WHERE roomTypeId = ?', [roomTypeId], (err, queueResult) => {
                if (err) {
                    return next(err);
                }

                const vacantCount = vacantResult.vacantCount;
                const unavailableCount = unavailableResult.unavailableCount;
                const queueCount = queueResult.queueCount;
                console.log(vacantCount,unavailableCount,queueCount)
                if (queueCount + unavailableCount >= vacantCount) {
                    res.status(409).json({ message: "ไม่สามารถจองคิวได้" });
                } else {
                    const insertQueue = `INSERT INTO Queue (userId, roomTypeId, queueDate, description, bookingDate, bookingTime) VALUES (?, ?, ?, ?, ?, ?);`
                    db.run(insertQueue, [userId, roomTypeId, queueDate, description, bookingDate, bookingTime], function (error) { // Use function()
                        if (error) {
                            return next(error);
                        }

                        res.status(201).json({ roomId: this.lastID });
                    });
                }
            });
        });
    });

});
app.delete('/queue/del/:queueId', verifyToken, (req, res, next) => {
    const { queueId } = req.params;

    const deleteQuery = 'DELETE FROM Queue WHERE id = ?';
    console.log(deleteQuery + queueId);
    db.run(deleteQuery, [queueId], function (error) {
        if (error) {
            return next(error);
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'ไม่พบคิว' });
        }
        return res.status(200).json({ message: 'ลบคิวสำเร็จ' });
    });
});

app.get('/queue', verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบที่ใช้คำสั่งนี้ได้' });
    }

    const selectQuery = `
  SELECT
      q.id,
      q.userId,
      q.roomTypeId,
      q.queueDate,
      q.description,
      q.bookingDate,
      q.bookingTime,
      u.firstname,
      u.lastname,
      u.email,
      u.telephone
  FROM Queue q
  JOIN users u ON q.userId = u.id
  ORDER BY q.queueDate
`;
    db.all(selectQuery, (error, queueEntries) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json(queueEntries);
    });
});

app.get('/queue/vacant/:type', verifyToken, (req, res, next) => {
    const { type } = req.params;

    const selectQuery = `
    SELECT id FROM room WHERE roomTypeId = ? AND renterID IS NULL;
`;
    db.all(selectQuery, [type], (error, vacantroom) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json(vacantroom);
    });
});

app.get('/queue/check/:type', verifyToken, (req, res, next) => {
    const { type } = req.params;

    db.get('SELECT COUNT(id) as vacantCount FROM room WHERE roomTypeId = ?', [type], (err, vacantResult) => { //db.get
        if (err) {
            return next(err);
        }

        db.get('SELECT COUNT(id) as unavailableCount FROM room WHERE roomTypeId = ? AND renterID IS NOT NULL', [type], (err, unavailableResult) => { //db.get
            if (err) {
                return next(err);
            }

            db.get('SELECT COUNT(id) as queueCount FROM Queue WHERE roomTypeId = ?', [type], (err, queueResult) => {  //db.get
                if (err) {
                    return next(err);
                }

                const vacantCount = vacantResult.vacantCount;
                const unavailableCount = unavailableResult.unavailableCount;
                const queueCount = queueResult.queueCount;

                const result = {
                    vacant: vacantCount,
                    unavailable: unavailableCount,
                    queue: queueCount,
                };

                if (queueCount + unavailableCount >= vacantCount) {
                    res.status(409).json({ message: "คิวเต็ม" });
                } else {
                    res.status(200).json({ message: "คิวว่าง" });;
                }
            });
        });
    });
});
console.log("Before app.listen");
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
console.log("After app.listen");