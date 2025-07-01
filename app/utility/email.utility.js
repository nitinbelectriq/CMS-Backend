//test email=========================

var nodemailer = require('nodemailer');



let mailTransporter = nodemailer.createTransport({ 
	service: 'gmail', 
	auth: { 
		user: 'chunky.exicom@gmail.com', 
		pass: 'barca0987'
	} 
}); 

let mailDetails = { 
	from: 'chunky.exicom@gmail.com', 
	to: 'chunky.yadav@exicom.in', 
	subject: 'Test mail', 
	text: 'Node.js testing mail for GeeksforGeeks'
}; 

mailTransporter.sendMail(mailDetails, function(err, data) { 
	if(err) { 
	} else { 
	} 
}); 

