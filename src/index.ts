import express from 'express'

const port = 3000

const app = express()

app.get('/', (req, res) => {
	res.send('goodbye')
})

app.listen(port, () => {
	console.log(`now listening on port ${port}`)
})
