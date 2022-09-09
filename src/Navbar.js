import React from 'react';
import logo from './images/logo.png';

function Navbar() {
	return (
		<nav>
			<div className='navTitle'>
				<img src={logo} alt='logo' />
				<h1>nemo</h1>
			</div>

			<div className='links'>
				<p>How to buy an NFT</p>
				<p>Coral Hub</p>
				<p>Artists</p>
				<p>NFT collection</p>
			</div>

			<div className='connectWallet'>
				<div className='walletBtn'>
					<h3 className='wallet-text'>Connect Wallet</h3>
					<h3 className='wallet-text-small'>Wallet</h3>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
