import * as React from "react";
import styles from "./App.module.css";

const EXAMPLE_URL: string = "https://bplace.art/?pixel=676718,459523";

type FetchTileFunc = (x: number, y: number) => string;
const getEarthTile: FetchTileFunc = (x: number, y: number) => `https://tiles-worldmap.bplace.art/${x}_${y}.png`;
const getMoonTile: FetchTileFunc = (x: number, y: number) => `https://tiles-worldmap.bplace.art/moon/${x}_${y}.png`;

function parseURL(input: string): URL | null {
	if(input == "") return null;
	try {
		return new URL(input);
	} catch {
		return null;
	}
}

function App() {
	const [input, setInput] = React.useState<string>(EXAMPLE_URL);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInput(e.target.value); };
	const setExampleUrl = () => { setInput(EXAMPLE_URL); };
	const clearURL = () => { setInput(""); };

	let output: React.JSX.Element;

	const inputUrl = parseURL(input);

	const pixelParam: string | null = inputUrl?.searchParams.get("pixel") ?? null;
	if(inputUrl == null || pixelParam == null) {
		output = <div>Invalid URL, click <button onClick={setExampleUrl}>here</button> to load an Example URL.</div>;
	} else {
		let tileFunc: FetchTileFunc = getEarthTile;
		if(inputUrl.pathname == "/moon")
			tileFunc = getMoonTile;

		const parts: string[] = pixelParam.split(",");
		const tileX: number = Math.floor(parseInt(parts[0]) / 512);
		const tileY: number = Math.floor(parseInt(parts[1]) / 512);

		const URL = tileFunc(tileX, tileY);
		const handleOpenURL = () => { window.open(URL, "_blank"); };
		output = (
			<>
				<div><button onClick={handleOpenURL} >Open Tile</button></div>
				<div><img className={styles.tile} src={URL} alt="Tile Image"/></div>
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
				<div><input onChange={handleInputChange} style={{width: "50%"}} value={input}/><button onClick={() => clearURL()}>Clear</button></div>
				<div>{output}</div>
			</div>
		</>
	);
}

export default App;