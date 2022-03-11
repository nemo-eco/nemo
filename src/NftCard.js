import React from 'react';
import './App.css';

function NftCard(props) {
	const nft = props.nft;

	return (
		<div className='card-child'>
			<div className='card-image'>
				<img
					src={`https://ipfs.io/ipfs/${nft.token.artifact_uri.slice(7)}`}
					alt=''
				/>
			</div>
			<div className='title'>
				<p>{nft.token.description}</p>
			</div>
		</div>
	);
}

export default NftCard;
