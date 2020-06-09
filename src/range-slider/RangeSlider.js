import React, {Component} from 'react';
import './RangeSlider.css';

export default class RangeSlider extends Component {
	constructor(props) {
		super(props);

		console.log(props)

		this.state = {
			posHorizontal: 0,
			to: props.to,
			from: props.from,
			stepRange: 100 / (props.to - props.from)
		}

		this.refRange = React.createRef();
	}
	static getDerivedStateFromProps(props, state) {
		console.log(this)
		if (props.to !== state.to||props.from !== state.from) {
			return {
				to: props.to,
				from: props.from,
				stepRange: 100 / (props.to - props.from)
			}
		}
		return null
	}
	getSliderWidth = () => {
		return this.refRange.current.getBoundingClientRect().width;
	}
	getStepRangePx = () => {
		return (this.getSliderWidth() / 100) * this.state.stepRange;
	}
	handleMouseDown = (e) => {
		e.preventDefault();
		const startPosition = e.clientX;
		const prevPosHorizontal = this.state.posHorizontal;
		const maxRange = this.getSliderWidth();

		const trackMouseMovie = (e) => {
			const currentPosition = e.clientX;
			const diff = currentPosition - startPosition;
			
			let posHorizontal = prevPosHorizontal + diff;

			if (posHorizontal < 0) posHorizontal = 0;
			if (posHorizontal > maxRange) posHorizontal = maxRange;

			this.setState({posHorizontal})

		}	

		const handleMouseUp = (e) => {
			const {
				posHorizontal,
				stepRange
			} = this.state;

			const {from} = this.props;

			const stepRangePx = this.getStepRangePx();

			this.props.onChangeRange(Math.floor(posHorizontal / stepRangePx) + from);

			document.removeEventListener("mousemove", trackMouseMovie);
			document.removeEventListener("mouseup", handleMouseUp);
		}

		document.addEventListener("mousemove", trackMouseMovie);

		document.addEventListener("mouseup", handleMouseUp)
	}
	componentDidMount() {
		const {
			value,
			from
		} = this.props;


		if (value) {

			this.setState({
				posHorizontal: this.getStepRangePx() * (value - from)
			});		

		}
	}
	render() {
		const {
			handleMouseDown,
			refRange
		} = this;

		const {
			value
		} = this.props;

		const {
			posHorizontal,
			stepRange,
			from,
			to
		} = this.state;

		const numSteps = to - from;

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
				{Array.from({length: numSteps + 1}, (s, i) => (
					<span 
						key={i}
						className='range-slider__step'
						style={{
							left: stepRange  * i  + "%"
						}}
						data-step-value={from + i}
					>
					</span>
				))}
			</div>
		)
	}
}