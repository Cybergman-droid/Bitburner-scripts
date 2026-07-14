// type ModifiedServer = Server & { hackWeight: number, chanceOfHacking: number }
interface ModifiedServer extends Server {
	hackWeight: number;
	chanceOfHacking: number;
	expectedValuePerHack: number;
	expectedValuePerSec: number;
}
export function getServerObjects(ns: NS, serverNames: string[]) {
	let player: Player = ns.getPlayer();

	let servers: ModifiedServer[] = [];
	for (let serverName of serverNames) {
		let serverObj: Server = ns.getServer(serverName);
		let chanceOfHack = ns.formulas.hacking.hackChance(serverObj, player);
		let percentPerHack = ns.formulas.hacking.hackPercent(serverObj, player);
		let timePerHack = ns.formulas.hacking.hackTime(serverObj, player);

		let weight: number =
			((serverObj.moneyMax ?? 0) * chanceOfHack) /
			(serverObj.minDifficulty ?? 1);

		let valuePerHack: number =
			chanceOfHack * (serverObj.moneyMax ?? 0) * percentPerHack;

		let valuePerSec: number =
			(chanceOfHack * (serverObj.moneyMax ?? 0) * percentPerHack) /
			(timePerHack / 1000);

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
