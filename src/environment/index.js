import dotenv from 'dotenv';


dotenv.config();

export default (({
  NODE_ENV, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET, DB_CONNECTION_STRING, ADMIN_PHONE,
  INF_NAME,
}) => ({
  environment: NODE_ENV,
  adminEmail: ADMIN_EMAIL,
  adminPassword: ADMIN_PASSWORD,
  jwtSecret: JWT_SECRET,
  dbConnectionString: DB_CONNECTION_STRING,
  adminPhone: ADMIN_PHONE,
  infName: INF_NAME,
}))(process.env);
