import express from 'express'
import { removeBug, getBugs, getBug,updateBug,addBug } from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', removeBug)
router.put('/:bugId', updateBug)
router.post('/', addBug)

export const bugRoutes = router