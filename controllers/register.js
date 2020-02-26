const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status('400').json('incorrect form submission');
    }
    const saltRounds = 10;
	bcrypt.hash(password, saltRounds).then(function(hash) {
		// Store hash in your password DB and enter details in users table
		db.transaction( trx => {
			trx.insert({
				email,
				hash
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0])
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
    });
}

module.exports = {
    handleRegister
}