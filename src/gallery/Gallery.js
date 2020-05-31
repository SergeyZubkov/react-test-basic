import React, {Component} from 'react';
import './Gallery.css';

import GalleryItem from './gallery-item/GalleryItem';

import dataService from '../services/dataService';

import spinner from '../spinner.svg';

export default class Gallery extends Component {
	state = {
		items: [],
		isLoading: true,
		timer: null
	}

	componentDidMount() {
		this.handleResponse(
			this.fetchData()
		)
	}

	fetchData() {
		this.setState({
			isLoading: true
		})

		return dataService.getData();
	}

	handleResponse(res) {
		res.then(data => {
			this.setState({
				items: data,
				isLoading: false
			})
		})
		.catch(err => console.log(err))
	}



	toggleAutoRefresh = (e) => {
		e.preventDefault();

		let {timer} = this.state;
		
		if (timer === null) {
			timer = setInterval(() => {
				this.handleResponse(
					this.fetchData()
				)
			}, 3000)
		} else {
			clearInterval(timer);

			timer = null;
		}

		this.setState({timer})
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
			isLoading, 
			timer
		} = this.state;

		const sortedItems = this.sorting(items);

		let content = (
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
		)

		if(isLoading) content = <img className={"gallery__spinner"} src={spinner} />

		return (	
			<div className='gallery container'>
				<h1>Top commented.</h1>
				<button 
					className="gallery__btn-auto-refresh"
					onClick={this.toggleAutoRefresh}
					style={{
						display: timer ? "none" : ""
					}}
				> 
					Start auto-refresh
				</button>
				<button 
					className="gallery__btn-auto-refresh"
					onClick={this.toggleAutoRefresh}
					style={{
						display: !timer ? "none" : ""
					}}
				> 
					Stop auto-refresh
				</button>
				{content}
			</div>
		)
	}
}