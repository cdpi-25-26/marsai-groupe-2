# Reglage pour l'expéditeur de l'email

## Dans la fonction sendMail du controller EmailController.js

async function sendMail(to, subject, html) {
  let info = await transporter.sendMail({
    from: '"//YOUR NAME" <//YOUR MAIL>', // sender address, add YOUR NAME & YOUR MAIL
    to, // list of receivers
    subject, // Subject line
    html,
  });
  return info.response;
}


## Modifier 
"//YOUR NAME" 
## avec le nom de l'expéditeur ainsi que
<//YOUR MAIL> 
## avec son adresse email.