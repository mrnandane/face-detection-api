const Clarifai = require('clarifai');

const app = new Clarifai.App({
    // TODO: never commit api key.. for security purpose
    // ideally is should come from environment or should be encrypted somewhere
    apiKey: '609c69e065e443168cd60e7ca89bcb1e'
});

const detectFace = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => {
        console.log(err)
        res.status('400').json('Face detection API not working')
    })
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users')
	.where({id})
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0])
	})
	.catch(err => {
		res.status('404').json('unable to get entries')
	})
};

module.exports = {
    handleImage,
    detectFace
};