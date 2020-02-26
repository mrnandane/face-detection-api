const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status('400').json('incorrect form submission');
    }
	//	Load hash from your password DB.
	db.transaction(trx => {
		trx.select('email', 'hash')
		.from('login')
		.where({email})
		.then(userEntry => {
			if(userEntry.length) {
				bcrypt.compare(password, userEntry[0].hash)
				.then((result) => {
					if(result) {
						return trx.select('*').from('users')
						.where({email})
						.then(users => {
							if(users.length){
								res.json(users[0])
							} else {
								res.status('400').json('no match found - in')
							}
						})
					} else {
						res.status('400').json('wrong credentials');
					}
				});
			} else {
				res.status('400').json('no match found')
			}
		})
	})
	.catch(err => {
		res.status('400').json('failed to sing in')
	});
}

module.exports = {
    handleSignin
}