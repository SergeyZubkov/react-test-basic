import React, {Component} from 'react';
import './RangeSlider.css';

import {throttle} from 'lodash'

export default class RangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			posKnob: 0
		}

		this.refRange = React.createRef();
	}
	componentDidMount() {
		this.maxRange = this.getSliderWidth();
		console.log(this.maxRange)
	}
	getSliderWidth = () => {
		return this.refRange.current.getBoundingClientRect().width;
	}
	getStepRangePx = () => {
		const {to, from} = this.props;
		return this.getSliderWidth() / (to - from);
	}
	calculateValue = () => {
		const {posKnob} = this.state;

		const {from} = this.props;

		const stepRangePx = this.getStepRangePx();

		return Math.floor(posKnob / stepRangePx) + from;
	}

	setPosKnob = (e ) => {
		const currentPosition = e.clientX;
		const diff = currentPosition - this.startPosition;
		const {posKnob} = this.state
		
		let newPosKnob = posKnob + diff;

		if (newPosKnob < 0) newPosKnob = 0;
		if (newPosKnob > this.maxRange) newPosKnob = this.maxRange;

		this.setState({posKnob: newPosKnob}, () => this.props.onChangeRange(this.calculateValue()));

	}
	handleClick = (e) => {
		if (e.target.classList.contains('range-slider__thumbler')) return 

		this.startPosition = this.state.posKnob + this.refRange.current.getBoundingClientRect().left;
		this.setPosKnob(e);
	}
	handleMouseDown = (e) => {
		e.preventDefault();
		this.startPosition = e.clientX;

		const throttleSetPosKnob = throttle(this.setPosKnob, 100);

		const handleMouseUp = (e) => {

			document.removeEventListener("mousemove", throttleSetPosKnob);
			document.removeEventListener("mouseup", handleMouseUp);
		}

		document.addEventListener("mousemove", throttleSetPosKnob);

		document.addEventListener("mouseup", handleMouseUp)
	}
	componentDidUpdate(prevProps) {
		const {
			value,
			from
		} = this.props;


		if (value !== prevProps.value) {

			this.setState({
				posKnob: this.getStepRangePx() * (value - from)
			});		

		}
	}
	render() {
		const {
			handleMouseDown,
			handleClick,
			refRange,
			getStepRangePx
		} = this;

		const {
			value,
			from,
			to
		} = this.props;

		const {
			posKnob
		} = this.state;

		const numSteps = to - from;

		return (
			<div 
				className='range-slider'
				ref={refRange}
				onClick={handleClick}
			>
				<span
					className='range-slider__highlight'
					style={{
						width: posKnob
					}}
				>
				</span>
				<span
					className='range-slider__thumbler'
					onMouseDown={handleMouseDown}
					style={{
						left: posKnob
					}}
				>
				</span>
				{Array.from({length: numSteps + 1}, (s, i) => (
					<span 
						key={i}
						className='range-slider__step'
						style={{
							left: (100 / numSteps)  * i + "%"
						}}
						data-step-value={from + i}
					>
					</span>
				))}
			</div>
		)
	}
}