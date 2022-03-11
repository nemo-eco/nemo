import React from 'react';

function NftGrid(props) {
	// Store props nfts into variable
	const nfts = props.nfts;

	// Return grid with nfts variable mapped into divs with the image
	return (
		<div>
			<h1>NFTs</h1>
			<div className='grid'>
				{nfts &&
					nfts.map((nft, i) => {
						return (
							<div className='nftCard' key={i}>
								<h1>NFT {i}</h1>
								<h3>{nft.token.description}</h3>
								<img
									src={`https://ipfs.io/ipfs/${nft.token.artifact_uri.slice(
										7
									)}`}
									alt=''
								/>
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default NftGrid;
