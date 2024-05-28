import fs from 'fs'
import { utillService } from "../../services/util.service.js"

const PAGE_SIZE =2
const bugs= utillService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

async function query(filterBy ={}) {
    let filterBugs = [...bugs]
    try {
        if(filterBy.txt){
            const regex = new RegExp(filterBy.txt,'i')
            filterBugs = filterBugs.filter(bug => regex.test(bug.title))
        }
        if(filterBy.labels){
            filterBugs = filterBugs.filter(bug => bug.labels.includes(filterBy.labels))
        }
        if(filterBy.minSeverity){
            filterBugs = filterBugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }
        if(filterBy.pageIdx !== undefined){
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filterBugs =filterBugs.slice(startIdx,startIdx + PAGE_SIZE)
        }
        return filterBugs
    } catch (error){
        throw(error)
    }
}

async function getById(bugId){
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        return bug
    } catch (error) {
        throw error
    }
}

async function remove(bugId){
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        bugs.splice(bugIdx,1)
        _saveBugsToFile()
    } catch (error) {
        throw error
    }
}

async function save(bugToSave){
    try {
        if(bugToSave._id){
            const index = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (index < 0) throw `Cant find bug with id ${bugToSave._id}`
            bugToSave.updateAt = Date.now()
            bugs[index] = bugToSave
        } else {
            bugToSave._id = utillService.makeId()
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }
        await _saveBugsToFile()
        return bugToSave
    } catch (error) {
        throw error
    }
}


function _saveBugsToFile(path = './data/bug.json'){
    return new Promise((resolve,reject) =>{
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path , data ,(err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}