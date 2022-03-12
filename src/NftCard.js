import React from 'react';
import './App.css';

function NftCard(props) {
	// store props into nft variable
	const nft = props.nft;

	// check if there's a value in royalty or undefined to avoid errors. Otherwise store value
	const royalty =
		nft.token.royalties[0] === undefined
			? 0
			: nft.token.royalties[0].amount.toString().slice(0, -1);

	return (
		<div className='card-child'>
			<div className='card-image'>
				<img
					src={`https://ipfs.io/ipfs/${nft.token.artifact_uri.slice(7)}`}
					alt=''
				/>
			</div>
			<div className='title'>
				<h2 className='name'>{nft.token.name}</h2>
				<p>{nft.token.description}</p>
				<h4 className='royalties'>Royalties: {royalty}%</h4>
			</div>
		</div>
	);
}

export default NftCard;
