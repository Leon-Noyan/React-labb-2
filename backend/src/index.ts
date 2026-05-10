import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url'
import type { MemoryI } from './types.js'
import type { MulterReqI } from './types.js'

dotenv.config()

const app = express()
const PORT = 3000

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __filename = fileURLToPath(import.meta.url)

const uploadsPath = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true })
}

app.use(express.json())
app.use(cors())

app.use('/uploads', express.static(uploadsPath))

// använder en array för att lagra alla memories, istället för att skapa en hel databas
let memories: MemoryI[] = []

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsPath)
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, `image-${uniqueSuffix}${ext}`)
    }
})

const upload = multer({ storage: storage })

// Uploads an image
app.post(
    '/api/memories',
    upload.single('ImageFile'),
    (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).send('No image file was uploaded.')
        }
        const newMemory: MemoryI = {
            id: Date.now().toString(),
            country: req.body.country,
            city: req.body.city,
            description: req.body.description,
            imageUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
        }

        memories.push(newMemory)
        return res.json({ newMemory })
    }
)

// Get all memories

app.get('/api/memories', (req: Request, res: Response) => {
  res.json(memories)
})

// Get a single memory

app.get('/api/memories/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const memory = memories.find(memory => memory.id === id)
    if (!memory) {
        return res.status(404).send('Memory was not found.')
    }
    return res.json(memory)
})

// Update a memory

app.put('/api/memories/:id', upload.single('ImageFile'), (req: Request, res: Response) => {
  const multerReq: MulterReqI = req as unknown as MulterReqI
  if (multerReq.file) {
    console.log(multerReq.file.filename)
  }
    const id = req.params.id
    const updatedMemory = memories.findIndex(memory => memory.id === id)
     const existingMemory = memories[updatedMemory]
    if (updatedMemory === -1 || !existingMemory) {
      return res.status(404).send('Could not update memory.')
    }

    let newImageUrl = existingMemory.imageUrl

    if (req.file) {
      try {
        const oldFilename = path.basename(existingMemory.imageUrl)
        const oldFilepath = path.join(uploadsPath, oldFilename)
        if (fs.existsSync(oldFilepath)) {
          fs.unlinkSync(oldFilepath)
        }
      } catch (error) {
        console.error('Could not delete old image:', error)
      }
      newImageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`
    }

    memories[updatedMemory] = {
      ...existingMemory,
      country: req.body.country || existingMemory.country,
      city: req.body.city || existingMemory.city,
      description: req.body.description || existingMemory.description,
      imageUrl: newImageUrl
    }

    return res.json(memories[updatedMemory])
})

// Delete memory

app.delete('/api/memories/:id', (req: Request, res: Response) => {
  const id = req.params.id
  const deletedMemory = memories.find(memory => memory.id === id)
  if (!deletedMemory) {
      return res.status(404).send('Could not delete memory.')
  }

  const filename = path.basename(deletedMemory.imageUrl)
  const filepath = path.join(uploadsPath, filename)

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }

  memories = memories.filter(memory => memory.id !== id)
  return res.json(deletedMemory)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
