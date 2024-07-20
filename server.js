const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;
console.log(__dirname);
app.use(bodyParser.json());

app.use(express.static(path.join('./', 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join('./', 'public', 'index.html'));
});

app.post('/payment-success', (req, res) => {
  const paymentDetails = req.body;

  // Log the payment details received
  console.log('Payment Details:', paymentDetails);

  // Set up Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'abhi.barua21@gmail.com', // Replace with your email
      pass: 'iktz hwwt jtix rhee' // Replace with your email password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Email content
  const mailOptions = {
    from: 'abhi.barua21@gmail.com', // Replace with your email
    to: paymentDetails.email, // User email
    subject: 'Invoice for your payment',
    text: `Dear Customer,

    Thank you for your payment.

    Here are the details of your transaction:
    Payment ID: ${paymentDetails.payment_id}
    Order ID: ${paymentDetails.order_id}
    Amount: ${paymentDetails.amount} INR

    Best Regards,
    Naruto Uzumaki`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Failed to send invoice email.', error: error.message });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ success: true, message: 'Invoice email sent successfully.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
