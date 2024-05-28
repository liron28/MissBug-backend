import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'



const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3030',
        'http://localhost:5173',
        'http://localhost:3030'
    ],
    credentials: true
}
// Express Config:
app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

//Routes
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

app.use('/api/bug',bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.get('/**', (req,res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`Server ready at ${port}`))