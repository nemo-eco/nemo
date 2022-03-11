import React from 'react';
import NftCard from './NftCard';

function NftGrid(props) {
	// Store props nfts into variable
	const nfts = props.nfts;

	// Return grid with nfts variable mapped into divs with the image
	return (
		<div className='site-header'>
			<h1>Saving corals one masterpiece at a time.</h1>
			<p className='paragraph'>
				NFT Marketplace giving coral foundations access to funding through
				digital art royalties, instead of relying on donations & grants.
			</p>
			<div className='grid'>
				{nfts &&
					nfts.map((nft, i) => {
						return (
							<div className='card-parent' key={i}>
								<NftCard nft={nft} />
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default NftGrid;
