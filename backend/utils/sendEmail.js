const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Hoặc dùng SMTP khác
        auth: {
            user: process.env.EMAIL_USER, // Email của bạn
            pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng
        },
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;