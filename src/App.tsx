import * as React from "react";
import styles from "./App.module.css";

const EXAMPLE_URL: string = "https://bplace.art/?pixel=676718,459523";

type FetchTileFunc = (x: number, y: number) => string;
const getEarthTile: FetchTileFunc = (x: number, y: number) => `https://tiles-worldmap.bplace.art/${x}_${y}.png`;
const getMoonTile: FetchTileFunc = (x: number, y: number) => `https://tiles-worldmap.bplace.art/moon/${x}_${y}.png`;

const zeroFix = (n: number) => n > 9 ? `${n}` : `0${n}`;

type FetchArchiveTileFunc = (x: number, y: number, date: Date, world: "earth" | "moon") => string;
const getArchiveEarthTile: FetchArchiveTileFunc = (x: number, y: number, date: Date, world: "earth" | "moon") => {
	const year = date.getFullYear();
	const month = zeroFix(date.getMonth() + 1);
	const day = zeroFix(date.getDate());
	switch(world) {
		case "earth": return `http://archive.bplace.art/${year}-${month}-${day}/${x}_${y}.png`;
		case "moon":  return `http://archive.bplace.art/moon/${year}-${month}-${day}/${x}_${y}.png`;
	}
}

function parseURL(input: string): URL | null {
	if(input == "") return null;
	try {
		return new URL(input);
	} catch {
		return null;
	}
}

function getYesterdate(): Date {
	const date = new Date();
	date.setDate(date.getDate() - 1);
	return date;
}

function App() {
	const [archive, setArchive] = React.useState<boolean>(false);
	const [archiveDate, setArchiveDate] = React.useState<Date | null>(getYesterdate());
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
		let URL: string = "";

		const parts: string[] = pixelParam.split(",");
		const tileX: number = Math.floor(parseInt(parts[0]) / 512);
		const tileY: number = Math.floor(parseInt(parts[1]) / 512);

		const world: "earth" | "moon" = inputUrl.pathname == "/moon" ? "moon" : "earth";

		if(archive && archiveDate != null) {
			URL = getArchiveEarthTile(tileX, tileY, archiveDate, world);
		} else {
			let tileFunc: FetchTileFunc = getEarthTile;
			if(inputUrl.pathname == "/moon")
				tileFunc = getMoonTile;

			URL = tileFunc(tileX, tileY);
		}
		
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
				<div>In Archive?<input type="checkbox" onChange={(e) => setArchive(e.target.checked)}/></div>
				{archive ? (
					<div><input type="date" value={archiveDate?.toISOString().split("T")[0] ?? ""} onChange={(e) => setArchiveDate(e.target.valueAsDate)}/></div>
				) : <></>}
				<div>{output}</div>
			</div>
		</>
	);
}

export default App;