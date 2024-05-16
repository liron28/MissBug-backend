import { bugService } from "./bug.service.js"


export async function getBugs(req, res) {
    const {txt, minSeverity, padeIdx}= req.query
    const filterBy= {txt, minSeverity: +minSeverity, padeIdx}
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (error) {
        res.status(400).send(`Could'nt get bugs`)
    }
}

export async function getBug (req, res) {
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
}

export async function updateBug (req, res) {
    const { _id, title, severity, desc } =req.body 
    let bugToSave ={_id, title, severity: +severity, desc }
    try {
        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        res.status(400).send(`Could'nt save bug`)
    }
}

export async function addBug(req, res) {
    const { title, severity, desc } =req.body 
    let bugToSave ={title, severity: +severity, desc }
    try {
        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        res.status(400).send(`Could'nt save bug`)
    }
}

export  async function removeBug(req, res) {
    try {
        const bugId = req.params.bugId
        await bugService.remove(bugId)
        res.send('removed bug') 
    } catch (error) {
        res.status(400).send(`Could'nt remove the bug`)   
    }
}

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