import React from "react";
import './ErrorMsg.css';

export default ({error}) => (
	<div className="error-msg"> 
		<img 
			src={`${process.env.PUBLIC_URL}/imgs/error.png`} 
			alt="..." 
			width="100"
			height="80"
		/>
		<p>{error.message}</p>
	</div>)