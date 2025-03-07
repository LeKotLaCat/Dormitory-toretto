//config.js
module.exports = {
    // db: {
    //   host: process.env.DB_HOST || 'localhost',
    //   user: process.env.DB_USER || 'root',
    //   password: process.env.DB_PASSWORD || '',
    //   database: process.env.DB_NAME || 'project',
    //   waitForConnections: true,
    //   connectionLimit: 10,
    //   queueLimit: 0
    // },
    jwt: {
      secret: process.env.JWT_SECRET || 'manop888',
      expiresIn: '10h'
    }    
  };