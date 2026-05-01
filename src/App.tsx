import * as React from "react";
import styles from "./App.module.css";

const EXAMPLE_URL: string = "https://bplace.art/?pixel=699634,424290";

function App() {
	const [input, setInput] = React.useState(EXAMPLE_URL);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInput(e.target.value); };
	const setExampleUrl = () => { setInput(EXAMPLE_URL); };

	let output: React.JSX.Element;

	const inputUrl = new URL(input);
	const pixelParam = inputUrl.searchParams.get("pixel");
	if(!pixelParam) {
		output = <div>Invalid URL, click <button onClick={setExampleUrl}>here</button> to load an Example URL</div>;
	} else {
		const parts = pixelParam.split(",");
		const tileX = Math.floor(parseInt(parts[0]) / 512);
		const tileY = Math.floor(parseInt(parts[1]) / 512);

		const URL = `https://tiles.bplace.art/tile-images/${tileX}_${tileY}.png`;
		output = (
			<>
				<div><a href={URL} target="_blank">Open Tile ({URL})</a></div>
				<div><img onError={() => {}} className={styles.tile} src={URL} alt="Tile Image"/></div>
				<div><span>If the image fails to load inspect the url and make sure there are pixels at the location.</span></div>
			</>
		);
	}

	return (
		<>
			<h1>Better Place Tile Extract</h1>
			<br/>
			<p>Enter a bPlace Pixel URL here:</p>
			<div>
				<div><input onChange={handleInputChange} style={{width: "50%"}} value={input}/></div>
				<div>{output}</div>
			</div>
		</>
	);
}

export default App;