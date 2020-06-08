import React, {Component} from 'react';
import './RangeSlider.css';

export default class RangeSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			posHorizontal: 0
		}

		this.refRange = React.createRef();
	}
	handleMouseDown = (e) => {
		e.preventDefault();
		const startPosition = e.clientX;
		const prevPosHorizontal = this.state.posHorizontal;
		const maxRange = this.refRange.current.getBoundingClientRect().width;

		const trackMouseMovie = (e) => {
			const currentPosition = e.clientX;
			const diff = currentPosition - startPosition;
			
			let posHorizontal = prevPosHorizontal + diff;

			if (posHorizontal < 0) posHorizontal = 0;
			if (posHorizontal > maxRange) posHorizontal = maxRange;

			this.setState({posHorizontal})

		}	

		const handleMouseUp = (e) => {
			// this.props.onChangeRange(Math.cell(posHorizontal / stepRange) * from)
			document.removeEventListener("mousemove", trackMouseMovie);
			document.removeEventListener("mouseup", handleMouseUp);
		}

		document.addEventListener("mousemove", trackMouseMovie);

		document.addEventListener("mouseup", handleMouseUp)
	}
	render() {
		const {
			handleMouseDown,
			refRange
		} = this;

		const {
			from,
			to,
			value
		} = this.props;

		const numSteps = to - from;

		const {posHorizontal} = this.state;

		return (
			<div 
				className='range-slider'
				ref={refRange}
			>
				<span
					className='range-slider__highlight'
					style={{
						width: posHorizontal
					}}
				>
				</span>
				<span
					className='range-slider__thumbler'
					onMouseDown={handleMouseDown}
					style={{
						left: posHorizontal
					}}
				>
				</span>
				{Array.from({length: numSteps + 1}, (step, i) => (
					<span 
						key={i}
						className='range-slider__step'
						style={{
							left: (100 / numSteps)  * i  + "%"
						}}
						data-step-value={from + i}
					>
					</span>
				))}
			</div>
		)
	}
}