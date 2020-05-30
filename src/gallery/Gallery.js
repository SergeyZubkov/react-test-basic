import React, {Component} from 'react';
import './Gallery.css';

import GalleryItem from './gallery-item/GalleryItem';

import dataService from '../services/dataService';

export default class Gallery extends Component {
	state = {
		items: [],
		isLoading: true
	}

	componentDidMount() {
		dataService
		.getData()
		.then(data => {
			this.setState({
				items: data,
				isLoading: false
			})
		})
		.catch(err => console.log(err))
	}

	sorting = (items) => {
		const byNumComments = (item1, item2) => {
			return item2.data.num_comments - item1.data.num_comments;
		}
		return items.sort(byNumComments);
	}

	render() {
		const {
			items,
			isLoading
		} = this.state;
		const sortedItems = this.sorting(items);

		if(isLoading) return 'Loading...'

		return (	
			<div className='gallery container'>
				<h1>Top commented.</h1>
				<ul className="gallery-items">
					{sortedItems.map(({data}) => (
						<GalleryItem 
							key={data.id}
							thumbnail={data.thumbnail} 
							title={data.title}
							num_comments={data.num_comments}
							permalink={data.permalink}
						/>)
					)}
				</ul>
			</div>
		)
	}
}