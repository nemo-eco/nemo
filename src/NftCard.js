import React from 'react';
import './App.css';

function NftCard(props) {
	// store props into nft variable
	const nft = props.nft;
	// store ipfs link
	const uri = nft.token.thumbnail_uri === null ? null : nft.token.thumbnail_uri.slice(7);


	// check if there's a value in royalty or undefined to avoid errors. Otherwise store value
	const royalty =
		nft.token.royalties[0] === undefined
			? 0
			: sumRoyalties(nft.token.royalties).toString().slice(-4, 2);

	// sumRoyalties function checks if the piece has more than one recipient of royalties and sums amount
	function sumRoyalties(arr){
		let sum = 0
		for (let i = 0; i < arr.length; i++) {
			
			sum += nft.token.royalties[i].amount
		}
		
		return sum
	}
	return (
		<div className='card-child'>
			<div className='card-image'>
				
			<a href={`https://objkt.com/asset/${nft.token.fa.contract}/${nft.token.token_id}`} target='_blank' rel='noopener noreferrer'>
				
				<img
					src={`https://ipfs.io/ipfs/${uri}`}
					alt=''
				/>
			</a>
			</div>
			<div className='title'>
				<h2 className='name'>{nft.token.name}</h2>
				<p>{nft.token.description}</p>
				<h4 className='royalties'>Royalties: {royalty || '0'}%</h4>
			</div>
		</div>
	);
}

export default NftCard;
