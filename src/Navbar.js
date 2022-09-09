import React from 'react';
// import logo from './images/logo.png';

function Navbar() {
	return (
		<nav>
			<div className='navTitle'>
				<img src='https://global-uploads.webflow.com/621674a0d159e26d0003821e/628a51e3226efd232f8d6921_Frame%204.svg' alt='logo' />
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
