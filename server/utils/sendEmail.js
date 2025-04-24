const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Создаем транспорт для отправки email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Настройки email
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Если есть HTML-версия
  if (options.html) {
    message.html = options.html;
  }

  // Отправка email
  const info = await transporter.sendMail(message);

  console.log(`Сообщение отправлено: ${info.messageId}`);
};

module.exports = sendEmail; 