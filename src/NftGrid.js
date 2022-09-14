import React from 'react';
import NftCard from './NftCard';

function NftGrid(props) {
	// Store props nfts into variable
	const nfts = props.nfts;

	// Sort NFTs by token ID
	nfts.sort((a,b) => a.token.token_id - b.token.token_id)
	// Return grid with nfts variable mapped into divs with the image
	return (
		
			<div className='grid'>
				{nfts &&
					nfts.map((nft, i) => {
						return (
							<div key={i}>
								<NftCard nft={nft} />
							</div>
						);
					})}
			</div>
		
	);
}

export default NftGrid;
