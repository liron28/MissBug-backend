import fs from 'fs'
import { utillService } from "./util.service.js"

const bugs= utillService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

async function query() {
    try {
        return bugs
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
            bugs[index] = bugToSave
        } else {
            bugToSave._id = utillService.makeId()
            bugToSave.cratedAt = Date.now()
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