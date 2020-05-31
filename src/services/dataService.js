export default {
	getData: () => {
		return fetch("https://www.reddit.com/r/reactjs.json?limit=20")
		.then(res => res.json())
		.then(res => res.data.children)
	}
}