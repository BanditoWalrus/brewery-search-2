import React, { useState, useEffect } from "react";
import "./output.css";


const Details = ({ brewery }) => {
    const address = (brewery.street != null ? brewery.street + ", " : "") + brewery.city + ", " + brewery.state + " " + brewery.postal_code;
	const phone = brewery.phone != null ? "(" + brewery.phone.substr(0,3) + ")" + brewery.phone.substr(3,3) + "-" + brewery.phone.substr(6) : "";
	const breweyType = brewery.brewery_type[0].toUpperCase() + brewery.brewery_type.substr(1);
	const latLong = brewery.latitude != null && brewery.longitude != null ? "Lat: " + brewery.latitude + ", Long: " + brewery.longitude : "";
    const [showDetails, setShowDetails] = useState(false);

	const isOddDay = () => {
		var today = new Date();
		return today.getDate() % 2 == 1;
	};

    return (
		<>
			<li key={brewery.id}
				data-toggle='modal'
				data-target={"#breweryDetails" + brewery.id}
			>
				<div>
					<button class="bg-green-300 border-green-600 border-b p-4 rounded w-full"
						type='button'
						id='button-addon1'
						data-ripple-color='dark'
                            onClick={() => setShowDetails(!showDetails)}
					>
						<h3>{brewery.name + " - " + (isOddDay() ? breweyType + " - " : "") + brewery.city + ", " + brewery.state}</h3>
					</button>
				</div>
			</li>
			{showDetails && (
				<div>
					<div class = "bg-lime-100 p-4"
						id={"breweryDetails_" + brewery.id}
						tabIndex='-1'
						role='dialog'
						key={brewery.id}
					>
						<div role='document'>
							<div>
								<p>
									{breweyType}
								</p>
								<p>
									{address}
								</p>
								<p>
									{phone}
								</p>
								<p class = "text-blue-400">
									<a
										target="_blank" 
										href ={brewery.website_url}>
										{brewery.website_url}
									</a>									
								</p>
								<p>
									{latLong}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
    );
};




function SearchApp() {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [breweries, setBreweries] = useState([]);
    const [emptyResult, setEmptyResult] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const getBreweries = () => {
		//If there is nothing in the search, by default show everything. Otherwise pull the data from the API search.
        fetch(search === '' ? `https://api.openbrewerydb.org/breweries?per_page=50` : `https://api.openbrewerydb.org/breweries?by_name=${search}`)
            .then((response) => response.json())
            .then((data) => {
                setLoading(true);
                setTimeout(function () {
					
                    // If the response of the data array is empty
                    if (data.length < 1) {
                        setEmptyResult(true);
                    }
					
                    setBreweries(data);
                    setLoading(false);
                }, 500);
            })
            .catch((error) => {
                console.error(error.message);
                alert("There was an error fetching the data");
            });
		setInitialized(true);
    };
		
	const isOddDay = () => {
		var today = new Date();
		return today.getDate() % 2 == 0;
	};

	const toggleDetails = (breweryID) => {
		var details = document.getElementById("breweryDetails_" + breweryID);
		if (details.style.display === "none") {
			details.style.display = "block";
		} else {
			details.style.display = "none";
		}
	};

    const sortBreweries = breweries
        .sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        })
        .map((brewery) => (
            <>
                <Details brewery={brewery} />
            </>
        ));

	useEffect(() => {
		if(!initialized)
			getBreweries();
	});

    return (
        <>
            <main>
                <p class = "w-full text-center text-2xl m-4">
                    Brewery Search
                </p>
                <div>
                    <div>
                        <input class = "border-2 m-2 p-1 rounded w-96"
                            type='text'
                            value={search}
                            placeholder='Search breweries by name...'
                            label='Search'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button class = "m-2 bg-green-200 border-green-900 border-2 p-1 rounded"
                            className='btn btn-dark mx-1'
                            type='button'
                            id='button-addon1'
                            data-ripple-color='dark'
                            onClick={getBreweries}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div class="bg-green-300 border-green-600 border-b px-4 w-full content-center">
                    {loading && (
                        <div role='status'>
                            <span className='sr-only'>Loading...</span>
                        </div>
                    )}
                    <ul>{breweries && sortBreweries}</ul>
                    {emptyResult === true && (
                        <p className='lead text-center'>NO RESULTS</p>
                    )}
                </div>
            </main>
        </>
    );
}

export default SearchApp;
