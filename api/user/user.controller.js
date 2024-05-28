import { userService } from "./user.service.js"

export async function getUsers(req, res){
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        res.status(400).send(`Cannot get users`)
    }
}

export async function getUser(req, res) {
    try {
        const userId = req.params.userId
        const user = await userService.getById(userId)
        res.send(user)
    } catch (err) {
        res.status(400).send(`Cannot get user`)
    }
}

export async function removeUser(req, res) {
    try {
        const userId = req.params.userId
        await userService.remove(userId)
        res.send('deleted')
    } catch (err) {
        res.status(400).send(`Cannot remove user`)
    }
}

export async function updateUser(req, res){
    const { _id, fullname, username, password, score } = req.body 
    let userToSave = { _id, fullname, username, password, score }

    try {
        userToSave = await userService.save(userToSave)
        res.send(userToSave)
    } catch (err) {
        res.status(400).send(`Cannot save user`)
    }
}

export async function addUser(req, res){
    const { fullname, username, password, score } = req.body 
    let userToSave = { fullname, username, password, score }
    try {
        userToSave = await userService.save(userToSave)
        res.send(userToSave)
    } catch (err) {
        res.status(400).send(`Cannot save user`)
    }
}