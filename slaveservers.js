/** @param {NS} ns */
export async function main(ns) {
	let purchasedServers = [];
	const numOfServersLimit = ns.cloud.getServerLimit();
	const startRam = 2 ** 1;
	const prefix = "slaveserver";
	while (purchasedServers.length < numOfServersLimit) {
		let newServer = ns.cloud.purchaseServer(prefix, startRam);
		purchasedServers.push(newServer);
	}
}
