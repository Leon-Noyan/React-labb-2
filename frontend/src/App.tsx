import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Journal from './pages/Journal'
import type { CountryDestination } from './types/destination'

function App() {
    const [savedFutureDestinations, setSavedFutureDestinations] = useState<
        CountryDestination[]
    >(() => {
      const localstorageData = localStorage.getItem('myFutureDestinations')
      return localstorageData ? JSON.parse(localstorageData) : []
    })

    useEffect(() => {
      localStorage.setItem('myFutureDestinations', JSON.stringify(savedFutureDestinations))
    }, [savedFutureDestinations])

    const removeFutureDestination = (name: string) => {
      setSavedFutureDestinations(prev => prev.filter(c => c.name !== name))
    }

    const addFutureDestination = (countryName: string, flagUrl: string) => {
        if (!savedFutureDestinations.find((c) => c.name === countryName)) {
            setSavedFutureDestinations([
                ...savedFutureDestinations,
                { name: countryName, flag: flagUrl }
            ])
        }
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route
                        index
                        element={
                            <Home
                                savedFutureDestinations={
                                    savedFutureDestinations
                                }
                                onRemove={removeFutureDestination}
                            />
                        }
                    />
                    <Route path="/Journal" element={<Journal />} />
                    <Route
                        path="/Explore"
                        element={<Explore onSave={addFutureDestination} />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
