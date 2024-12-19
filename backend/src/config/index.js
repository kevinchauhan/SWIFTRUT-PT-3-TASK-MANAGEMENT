import { config } from 'dotenv'
config()

const { PORT, DB_URL, ACCESS_TOKEN_SECRET, FRONTEND_URL, EMAIL_USER, EMAIL_PASSWORD } = process.env

export const Config = {
    PORT,
    DB_URL,
    ACCESS_TOKEN_SECRET,
    FRONTEND_URL,
    EMAIL_USER,
    EMAIL_PASSWORD,

}
