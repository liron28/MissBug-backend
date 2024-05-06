import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import ms from 'ms'

import { bugService } from './services/bug.service.js'

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
app.use(cors(corsOptions))
app.use(cookieParser())

// app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', async (req, res) => {
    try {
        const bugs = await bugService.query()
        res.send(bugs)
    } catch (error) {
        res.status(400).send(`Could'nt get bugs`)
    }
})

app.get('/api/bug/save', async (req, res) => {
    try {
        let bugToSave ={
            _id : req.query._id,
            title : req.query.title || '',
            severity : +req.query.severity || 0,
            desc: req.query.desc,
            createdAt: req.query.createdAt
        }
        console.log(bugToSave)
        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        res.status(400).send(`Could'nt save bug`)
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    try {
        const bugId = req.params.bugId

        let bugLimiter = req.cookies.bugLimiter
        bugLimiter = updateVisitedBugs(bugId, bugLimiter)
        console.log(bugLimiter);
        res.cookie('bugLimiter', bugLimiter)
        
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (error) {
        if(error.message === 'bugLimit Reached'){
            res.status(401).send(`Wait for a bit`)    
        }else {
            res.status(400).send(`Could'nt get bug`)
        }
    }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    try {
        const bugId = req.params.bugId
        await bugService.remove(bugId)
        res.send('removed bug') 
    } catch (error) {
        res.status(400).send(`Could'nt remove the bug`)   
    }
})

const updateVisitedBugs = (bugId , bugLimiter) =>{
    const timeout = '7 seconds'

    if(!bugLimiter){
        bugLimiter ={
            visitedBugs:[],
            lastVisit: Date.now()
        }
    }
    if(bugLimiter.visitedBugs.length < 3){
        bugLimiter.visitedBugs.push(bugId)
        if (bugLimiter.visitedBugs.length === 3){
            bugLimiter.lastVisit = Date.now()
        }
    }
    else{
        if(Date.now() - bugLimiter.lastVisit > ms(timeout)){
            bugLimiter.visitedBugs=[]
        } else{
            throw new Error('bugLimit Reached')
        }
    }
    return bugLimiter
}

app.listen(3030, () => console.log('Server ready at port 3030'))