const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Ruta para enviar correos de contacto
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  const msg = {
    to: "nistalfrancisco2000@gmail.com", // Gmail dueño petshopbouyique
    from: "rcprogramacion23@gmail.com", // Mail programador
    subject: "Mensaje Petshop Boutique Contacto",
    text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
  };

  sgMail
    .send(msg)
    .then(() => res.status(200).send("Email enviado"))
    .catch((error) => {
      console.error("Error al enviar el email:", error);
      res.status(500).send("Error al enviar el email");
    });
});

module.exports = router;
