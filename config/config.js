module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  PORT: process.env.PORT,
  URL: process.env.URL,
  mail: {
    GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
    GMAIL_PWD: process.env.GMAIL_PWD,
  },
  twilio:{
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE: process.env.TWILIO_PHONE,
  },
  CONSOLE_LOG_LEVEL: process.env.CONSOLE_LOG_LEVEL,
  FILE_LOG_LEVEL: process.env.FILE_LOG_LEVEL,
};