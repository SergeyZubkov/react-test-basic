import React from 'react';
import './GalleryItem.css';

export default ({
	thumbnail,
	title,
	num_comments,
	permalink
}) =>	{
	return (
		<li className="gallery-item">
			<img
				className="gallery-item__img"
				src={
					thumbnail === "self"
					||thumbnail === "default" 
					? "https://via.placeholder.com/140?text=Gallery" 
					: thumbnail
				}
				alt="..."
				height="140"
				width="200"
			/>
			<div className="gallery-item__title">
				{title}
			</div>
			<div className="gallery-item__num-comments">
				{`Number of comments: ${num_comments}`}
			</div>
			<a 
				className="gallery-item__permalink"
				href={permalink}
			>
				Link
			</a>
		</li>
	)
}
