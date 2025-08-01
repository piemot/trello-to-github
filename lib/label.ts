import chalk, { type ChalkInstance } from "chalk";
import invariant from "tiny-invariant";

// A label that doesn't exist in the map file.
// It won't be transferred to GitHub.
export type SkippedLabel = {
	type: "skipped";
	trello: {
		name: string;
		color: string;
	};
};

// A label that will be created in GitHub.
export type ToCreateLabel = {
	type: "toCreate";
	trello: {
		name: string;
		color: string;
	};
	github: {
		name: string;
		color?: string;
	};
};

// A label that couldn't be found in GitHub.
export type MissingLabel = {
	type: "missing";
	trello: {
		name: string;
		color: string;
	};
	githubLookup: number | string;
};

// A properly mapped label
export type MappedLabel = {
	type: "mapped";
	trello: {
		name: string;
		color: string;
	};
	github: {
		id: number;
		name: string;
		color: string;
	};
};

// A GitHub label granted to cards originating from a certain Trello list,
// but it couldn't be found in GitHub.
export type MissingListLabel = {
	type: "missingList";
	trelloList: { id: string; name: string };
	githubLookup: number | string;
};

// A GitHub label granted to cards originating from a certain Trello list
export type ListMappedLabel = {
	type: "listMapped";
	trelloList: { id: string; name: string };
	github: {
		id: number;
		name: string;
		color: string;
	};
};

export type Label =
	| SkippedLabel
	| ToCreateLabel
	| MissingLabel
	| MappedLabel
	| MissingListLabel
	| ListMappedLabel;

// Labels that have come from Trello
export type TrelloLabel =
	| SkippedLabel
	| ToCreateLabel
	| MissingLabel
	| MappedLabel;

// Labels that are going to GitHub
export type GithubLabel = ToCreateLabel | MappedLabel | ListMappedLabel;

// A map of Trello color names to their hex values.
const colorMap: Record<string, ChalkInstance> = {
	lime_light: chalk.bgHex("#D3F1A7"),
	lime: chalk.bgHex("#94C748"),
	lime_dark: chalk.bgHex("#5B7F24"),
	red_light: chalk.bgHex("#FFD5D2"),
	red: chalk.bgHex("#F87168"),
	red_dark: chalk.bgHex("#C9372C"),
	orange_light: chalk.bgHex("#FEDEC8"),
	orange: chalk.bgHex("#FEA362"),
	orange_dark: chalk.bgHex("#C25100"),
	yellow_light: chalk.bgHex("#F8E6A0"),
	yellow: chalk.bgHex("#F5CD47"),
	yellow_dark: chalk.bgHex("#946F00"),
	green_light: chalk.bgHex("#BAF3DB"),
	green: chalk.bgHex("#4BCE97"),
	green_dark: chalk.bgHex("#1F845A"),
	sky_light: chalk.bgHex("#C6EDFB"),
	sky: chalk.bgHex("#6CC3E0"),
	sky_dark: chalk.bgHex("#227D9B"),
	blue_light: chalk.bgHex("#CCE0FF"),
	blue: chalk.bgHex("#579DFF"),
	blue_dark: chalk.bgHex("#0C66E4"),
	purple_light: chalk.bgHex("#DFD8FD"),
	purple: chalk.bgHex("#9F8FEF"),
	purple_dark: chalk.bgHex("#6E5DC6"),
	pink_light: chalk.bgHex("#FDD0EC"),
	pink: chalk.bgHex("#E774BB"),
	pink_dark: chalk.bgHex("#AE4787"),
	black_light: chalk.bgHex("#DCDFE4"),
	black: chalk.bgHex("#8590A2"),
	black_dark: chalk.bgHex("#626F86"),
};

export function renderTrelloLabel(label: TrelloLabel): string {
	const makeColor = colorMap[label.trello.color];
	invariant(makeColor, () => {
		const formatter = new Intl.ListFormat("en", {
			style: "long",
			type: "disjunction",
		});
		const validColors = formatter.format(Object.keys(colorMap));
		return `label "${label.trello.name}"'s color ("${label.trello.color}") should be a valid Trello color (${validColors}).`;
	});
	return makeColor(` ${label.trello.name} `);
}

export function renderGithubLabel(label: GithubLabel): string {
	if (label.type === "toCreate") {
		if (label.github.color) {
			return `${chalk.bold("Will create:")} ${chalk.bgHex(label.github.color)(` ${label.github.name} `)}`;
		} else {
			return `Will create: ${chalk.bold(label.github.name)}`;
		}
	}
	const makeColor = chalk.bgHex(label.github.color);
	return makeColor(` ${label.github.name} `);
}

const fieldColorMap: Record<string, string> = {
	BLUE: "#0969da",
	GRAY: "#59636e",
	GREEN: "#1a7f37",
	ORANGE: "#bc4c00",
	PINK: "#bf3989",
	PURPLE: "#8250df",
	RED: "#d1242f",
	YELLOW: "#9a6700",
};
// const fieldColorMap: Record<string, string> = {
// 	BLUE: "#ddf4ff",
// 	GRAY: "#f6f8fa",
// 	GREEN: "#dafbe1",
// 	ORANGE: "#fff1e5",
// 	PINK: "#ffeff7",
// 	PURPLE: "#fbefff",
// 	RED: "#ffebe9",
// 	YELLOW: "#fff8c5",
// };

export function renderGithubFieldOption(option: {
	id: string;
	name: string;
	color: string;
}): string {
	const makeColor = chalk.bold.hex(fieldColorMap[option.color]);
	return ` ${makeColor("●")} ${chalk.reset(option.name)}`;
}
