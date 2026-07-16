// type ModifiedServer = Server & { hackWeight: number, chanceOfHacking: number }
interface ModifiedServer extends Server {
	hackWeight: number;
	chanceOfHacking: number;
	expectedValuePerHack: number;
	expectedValuePerSec: number;
}
export function getServerObjects(ns: NS, serverNames: string[]) {
	let player: Player = ns.getPlayer();
	console.log(player);

	let servers: ModifiedServer[] = [];
	for (let serverName of serverNames) {
		let serverObj: Server = ns.getServer(serverName);
		console.log(serverObj);

		let actualHackDifficulty = serverObj.hackDifficulty;
		serverObj.hackDifficulty = serverObj.minDifficulty;
		console.log(
			`hack hackDifficulty changed on ${serverObj.hostname} to ${serverObj.hackDifficulty}`,
		);
		console.log(serverObj);
		console.log(serverObj.hackDifficulty);

		let chanceOfHack = ns.formulas.hacking.hackChance(serverObj, player);
		let percentPerHack = ns.formulas.hacking.hackPercent(serverObj, player);
		let timePerHack = ns.formulas.hacking.hackTime(serverObj, player);
		console.log(`hackChance for ${serverObj.hostname} is ${chanceOfHack}`);
		console.log(`hack percent for ${serverObj.hostname} is ${percentPerHack}`);
		console.log(
			`time per hack for ${serverObj.hostname} is ${timePerHack / 1000}s`,
		);

		let weight: number =
			((serverObj.moneyMax ?? 0) * chanceOfHack) /
			(serverObj.minDifficulty ?? 1);

		let valuePerHack: number =
			chanceOfHack * (serverObj.moneyMax ?? 0) * percentPerHack;

		let valuePerSec: number = valuePerHack / (timePerHack / 1000);

		serverObj.hackDifficulty = actualHackDifficulty;
		console.log(
			`hackDifficulty restored on ${serverObj.hostname} to ${actualHackDifficulty}  ${serverObj.hackDifficulty}`,
		);
		console.log(serverObj);

		let modifiedServerObj: ModifiedServer = {
			...serverObj,
			chanceOfHacking: chanceOfHack * 100,
			hackWeight: weight,
			expectedValuePerHack: valuePerHack,
			expectedValuePerSec: valuePerSec,
		};
		servers.push(modifiedServerObj);
	}

	return servers;
}
