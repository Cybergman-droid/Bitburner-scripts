// type ModifiedServer = Server & { hackWeight: number, chanceOfHacking: number }
interface ModifiedServer extends Server {
	hackWeight: number;
	chanceOfHacking: number;
	expectedValuePerHack: number;
}
export function getServerObjects(ns: NS, serverNames: string[]) {
	let player: Player = ns.getPlayer();

	let servers: ModifiedServer[] = [];
	for (let serverName of serverNames) {
		let serverObj: Server = ns.getServer(serverName);
		let chanceOfHack = ns.formulas.hacking.hackChance(serverObj, player) * 100;
		let weight: number =
			(serverObj.moneyMax ?? 0) / (serverObj.minDifficulty ?? 0);
		let valuePerHack: number =
			((serverObj.moneyMax ?? 0) * chanceOfHack) /
			(serverObj.minDifficulty ?? 0);

		let modifiedServerObj: ModifiedServer = {
			...serverObj,
			chanceOfHacking: chanceOfHack,
			hackWeight: weight,
			expectedValuePerHack: valuePerHack,
		};
		servers.push(modifiedServerObj);
	}
	return servers;
}
