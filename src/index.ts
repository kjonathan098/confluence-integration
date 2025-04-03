import dotenv from 'dotenv'
import express from 'express'
import authRouter from './routes/auth.route'
dotenv.config()
const port = 3000

const app = express()

app.get('/', (req, res) => {
	res.send('goodbye')
})

app.use('/api/oauth', authRouter)

app.listen(port, () => {
	console.log(`now listening on port ${port}`)
})
