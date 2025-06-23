const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendAppointmentConfirmation = async (email, appointmentDetails) => {
  await transporter.sendMail({
    from: '"Clínica Médica" <no-reply@clinica.com>',
    to: email,
    subject: 'Confirmación de Cita',
    html: `<p>Su cita ha sido confirmada para ${appointmentDetails.date}</p>`
  });
};