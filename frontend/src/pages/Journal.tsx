import React, { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import axios from 'axios'

interface Memory {
    id: string
    country: string
    city: string
    description: string
    imageUrl: string
}

function Journal() {
    const [memories, setMemories] = useState<Memory[]>([])
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [description, setDescription] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        fetchJournalMemories()
    }, [])

    async function fetchJournalMemories() {
        try {
            const response = await axios.get(
                'http://localhost:3000/api/memories'
            )
            setMemories(response.data)
        } catch (error) {
            console.error('Error fetching memories:', error)
        }
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImageFile(event.target.files[0])
        }
    }

    const handleEdit = async (id: string) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/memories/${id}`
            )
            setCountry(response.data.country)
            setCity(response.data.city)
            setDescription(response.data.description)
            setEditingId(id)

            window.scrollTo({top: 0, behavior: 'smooth'})
        } catch (error) {
            console.error('Error editing memory:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/memories/${id}`)
            fetchJournalMemories()
        } catch (error) {
            console.error('Error deleting memory:', error)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!editingId && !imageFile) {
            alert('Please select an image.')
            return
        }
        const formData = new FormData()
        formData.append('country', country)
        formData.append('city', city)
        formData.append('description', description)

        if (imageFile) {
            formData.append('ImageFile', imageFile)
        }

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:3000/api/memories/${editingId}`,
                    formData
                )
            } else {
                await axios.post('http://localhost:3000/api/memories', formData)
            }
            fetchJournalMemories()

            setCountry('')
            setCity('')
            setDescription('')
            setImageFile(null)
            setEditingId(null)
        } catch (error) {
            console.error('Error submitting memory:', error)
        }
    }

    return (
        <div className="Home-page">
            <h1>My Journal</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input type="file" onChange={handleImageChange}
                value={imageFile === null ? '' : undefined}
                />
                <button type="submit">
                    {editingId ? 'Update Memory' : 'Create Memory'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setEditingId(null)
                        setCountry('')
                        setCity('')
                        setDescription('')
                        setImageFile(null)
                    }}
                >
                    Clear
                </button>
            </form>

            <div className="Documented-memories">
                {memories.map((memory) => (
                    <div key={memory.id} className="Documented-memories-card">
                        <img src={memory.imageUrl} alt={memory.country} />
                        <div className="Documented-memories-card-content">
                            <h3>{memory.country}</h3>
                            <p>{memory.city}</p>
                            <p>{memory.description}</p>
                            <button
                                onClick={() => handleEdit(memory.id)}
                            >Edit</button>
                            <button onClick={() => handleDelete(memory.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Journal
