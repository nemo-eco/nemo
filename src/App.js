import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import NftGrid from './NftGrid';
import './App.css';

function App() {
	// Create hook to fetch and store NFTs
	const [nfts, setNfts] = useState([]);

	// Make call to Objkt's API
	useEffect(() => {
		const getNfts = async () => {
			const options = {
				method: 'POST',
				url: `https://data.objkt.com/v2/graphql/`,
				headers: {
					'content-type': 'application/json',
				},
				data: {
					query: `{
					holder_by_pk(address: "tz1LMdXbNkqYaQb2gzASiuhnPCTN1AReh1H8") {
						alias
						description
						logo
						tzdomain
						website
						held_tokens(where: {quantity: {_gt: "0"}}) {
							quantity
							token {
								artifact_uri
								description
								name
								royalties {
									amount
								}
								display_uri
								thumbnail_uri
								fa {
								contract
								}
								token_id
      }
    }
  }
}`,
				},
			};

			axios
				.request(options)
				.then(function (response) {
					const res = response.data;
					setNfts(res.data.holder_by_pk.held_tokens);
				})
				.catch(function (error) {
					console.error(error);
				});
		};

		getNfts();
	}, []);

	return (
		<div className='App'>
			<Navbar />
			<NftGrid nfts={nfts} />
		</div>
	);
}

export default App;
