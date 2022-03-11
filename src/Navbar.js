import React from 'react';
import logo from './images/logo.png';

function Navbar() {
	return (
		<nav>
			<div className='navTitle'>
				<img src={logo} alt="logo" />
				<h1>nemo</h1>
			</div>

			<div className='links'>
				<p>Explore</p>
				<p>Drops</p>
				<p>Artists</p>
				<p>Foundations</p>
				<div className='connectWallet'>
					<div className='walletBtn'>
						<h3>Connect Wallet</h3>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
