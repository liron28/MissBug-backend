import express from 'express'
import { addBug, getBugs, getBug, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', log, getBugs)
router.get('/:bugId', log, getBug)
router.delete('/:bugId', log, requireUser, removeBug)
router.put('/:bugId', log, requireUser, updateBug)
router.post('/', log, requireUser, addBug)

export const bugRoutes = router