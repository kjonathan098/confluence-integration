import dotenv from 'dotenv'
import express from 'express'
import authRouter from './routes/auth.route'
import errorHandler from './middleware/errorHandler'
dotenv.config()
const port = 3000

const app = express()

app.use('/api/oauth', authRouter)
app.use(errorHandler)

app.listen(port, () => {
	console.log(`now listening on port ${port}`)
})
