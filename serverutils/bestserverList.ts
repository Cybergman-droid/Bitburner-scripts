/** @param {NS} ns */
// type ModifiedServer = Server & { hackWeight: number, chanceOfHacking: number }
interface ModifiedServer extends Server {
	hackWeight: number;
	chanceOfHacking: number;
	expectedValuePerHack: number;
}

export function getBestServerList(servers: ModifiedServer[], player: Player) {
	// let hackedServers = servers.filter(server => server.hasAdminRights)
	// console.log('has Admin rights')
	// console.log(hackedServers)
	// let bestHackLevel = hackedServers.filter(server => server.requiredHackingSkill <= (player.skills.hacking / 2))
	// console.log(bestHackLevel)
	// bestHackLevel.sort((a, b) => b.hackWeight - a.hackWeight)
	let filteredServers = servers.filter((server) =>
		filterServers(server, player),
	);

	console.log("filtered servers");
	console.log(filteredServers);
	filteredServers.sort(
		(a, b) => b.expectedValuePerHack - a.expectedValuePerHack,
	);
	console.log("sorted by expected value per hack");
	console.log(filteredServers);
	// console.log(player.skills.hacking)
	return filteredServers;
}

function filterServers(server: ModifiedServer, player: Player) {
	if ((server.moneyMax ?? 0) <= 0) {
		return false;
	}

	if (!server.hasAdminRights) {
		return false;
	}

	if ((server.requiredHackingSkill ?? 0) >= player.skills.hacking / 2) {
		return false;
	}

	return true;
}
