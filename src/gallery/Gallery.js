import React, {Component} from 'react';
import './Gallery.css';

import GalleryItem from './gallery-item/GalleryItem';
import ErrorMsg from '../error-msg/ErrorMsg';
import RangeSlider from '../range-slider/RangeSlider';

import dataService from '../services/dataService';

import spinner from '../spinner.svg';

export default class Gallery extends Component {
	state = {
		items: [],
		isLoading: true,
		timer: null,
		error: null,
		sliderRangeFrom: 0,
		sliderRangeTo: 0,
		sliderRangeValue: 0
	}

	componentDidMount() {
		this.handleResponse(
			this.fetchData()
		)
		.then(data => this.setState({
			sliderRangeFrom: this.sorting(data)[data.length-1].data.num_comments,
			sliderRangeTo: this.sorting(data)[0].data.num_comments,
			sliderRangeValue: this.sorting(data)[0].data.num_comments
		}))
	}

	fetchData() {
		this.setState({
			isLoading: true
		})

		return dataService.getData();
	}

	handleResponse(res) {
		return res.then(data => {
			return new Promise((resolve) => {
				this.setState({
					items: data,
					isLoading: false
				}, 
				 () => resolve(data))
			})

		})
		.catch(err => this.setState({
			isError: true,
			isLoading: false,
			error: err
		}))
	}

	handleSliderRangeChange = (newValue) => this.setState({sliderRangeValue: newValue})

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

	setVisible = (items) => {
		return items.filter(({data}) => data.num_comments >= this.state.sliderRangeFrom&&data.num_comments <= this.state.sliderRangeValue);
	}

	render() {
		const {
			items,
			isLoading, 
			timer,
			error,
			sliderRangeFrom,
			sliderRangeTo,
			sliderRangeValue
		} = this.state;

		const sortedItems = this.sorting(
			this.setVisible(items)
		);

		console.count('render')
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

		if(error) content = <ErrorMsg error={error} />

		if(isLoading&&!error) content = <img 
			className={"gallery__spinner"} 
			src={spinner}
			alt="..."
		/>

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
				<RangeSlider 
					from={sliderRangeFrom} 
					to={sliderRangeTo} 
					value={sliderRangeValue} 
					onChangeRange={this.handleSliderRangeChange}
				/>
				{content}
			</div>
		)
	}
}