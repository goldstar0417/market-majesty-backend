const config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || 'game_db',
    },
    server: {
        port: process.env.PORT || 3000,
    },
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

module.exports = config;