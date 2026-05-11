import { useEffect, useState } from 'react'
import axios from 'axios'
import { SearchBar } from '../components/searchBar'
import { useDebounce } from '../Hooks/use-debounce'

interface ExploreProps {
    onSave: (countryName: string, flagUrl: string) => void
}

function Explore({ onSave }: ExploreProps) {
    interface Country {
        name: {
            common: string
        }
        capital: string[]
        currencies: Record<string, { name: string; symbol: string }>
        flags: {
            png: string
            svg: string
            alt: string
        }
    }

    const [countries, setCountries] = useState<Country[]>([])
    const [search, setSearch] = useState('')

    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        const fetchCountryData = async () => {
            try {
                const response = await axios.get<Country[]>(
                    'https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags'
                )
                setCountries(response.data)
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching country data:', error)
            }
        }
        fetchCountryData()
    }, [])

    const filteredCountries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    return (
        <div className="Home-page">
          <div className='Explore-header'>
            <h1>Explore</h1>

            <SearchBar search={search} setSearch={setSearch} />
            </div>

            <div className="Country-list">
                {filteredCountries.map((country, index) => (
                    <div key={index} className="country-cards">
                        <img
                            src={country.flags.png}
                            alt={
                                country.flags.alt ||
                                `Flag of ${country.name.common}`
                            }
                            className="flags"
                        />
                        <h3>{country.name.common}</h3>
                        <p>Capital: {country.capital[0] || 'Unknown'}</p>
                        <button
                            onClick={() =>
                                onSave(country.name.common, country.flags.png)
                            }
                        >
                            Save
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Explore
