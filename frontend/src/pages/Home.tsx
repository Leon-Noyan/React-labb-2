import backgroundImg from './../assets/travel-backgroundImg.jpg'
import type { CountryDestination } from '../types/destination'

interface HomeProps {
    savedFutureDestinations?: CountryDestination[]
    onRemove: (name: string) => void
}

function Home({ savedFutureDestinations, onRemove }: HomeProps) {
    if (!savedFutureDestinations) {
        return null
    }
    return (
        <div className="Home-page">
            <div
                className="Background"
                style={{ backgroundImage: `url(${backgroundImg})` }}
                aria-label="Background image that consists of the world map"
            >
                <div hidden aria-hidden="true">
                    Image taken from Unsplash.com by Charlotte Noelle
                </div>
                <div className="text-container">
                    <h1>Travel Memories</h1>
                    <h2>
                        Every journey has its own memories. Why not cherish
                        them?
                    </h2>
                </div>
            </div>
            <div className="Future-destinations">
                <h3>My Future destinations</h3>
                <div className="list-destinations">
                    {savedFutureDestinations.length > 0 ? (
                        savedFutureDestinations.map((destination, index) => (
                            <div key={index} className="destination-card">
                                <img
                                    src={destination.flag}
                                    alt={destination.name}
                                />
                                <p>{destination.name}</p>
                                <button
                                    className="removeBtn"
                                    onClick={() => onRemove(destination.name)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="emptyMsg">No destinations saved yet</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
