import { bugService } from "./bug.service.js"
import { authService } from './../auth/auth.service.js'
import { loggerService } from "../../services/logger.service.js"

export async function getBugs(req, res){
    const { title, severity, label, pageIdx, sortBy } = req.query
    const filterBy = { title, severity: +severity, label, pageIdx, sortBy }

    try {
        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        loggerService.error(`Cannot get bugs`, err)
        res.status(400).send(`Cannot'nt get bugs`)
    }
}

export async function getBug(req, res) {
    try {
        const bugId = req.params.bugId
        // console.log('bugId:', bugId)
        let visitedBugs = req.cookies.visitedBugs || []
        if (visitedBugs.length > 2) return res.status(401).send('Wait for a bit');
        if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId) 
        res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })

        const bug = await bugService.getById(bugId)
        // console.log('bug:', bug)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Cannot get bug`, err)
        res.status(400).send(`Cannot get bug`)
    }
}

export async function removeBug(req, res) {
    
    const {bugId} = req.params
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Not authenticated')

    try {
        await bugService.remove(bugId, req.loggedinUser)
        res.send('deleted')
    } catch (err) {
        loggerService.error(`Cannot remove bug`, err)
        res.status(400).send(`Cannot remove bug`)
    }
}

export async function updateBug(req, res){
    const { _id, title, severity, description, labels } = req.body 
    let bugToSave = { _id, title, severity: +severity, description, labels }

    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Not authenticated')

    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Cannot save bug`, err)
        res.status(400).send(`Cannot save bug`)
    }
}

export async function addBug(req, res){
    const { title, severity, description, labels } = req.body 
    let bugToSave = { title, severity: +severity, description, labels }
    
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Not authenticated')

    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Cannot save bug`, err)
        res.status(400).send(`Cannot save bug`)
    }
}