require('dotenv').config();

CONFIG = {}

CONFIG.port = process.env.PORT  || '3000';

CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'studentenhuis';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || '';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'nc897gwrbfp9uijba9SD#@b98qlksade3fs';
