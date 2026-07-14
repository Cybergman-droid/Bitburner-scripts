/** @param {NS} ns */
export function getServerNames(ns: NS) {
	let servers = ["home"];

	for (let i = 0; i < servers.length; i++) {
		let currentNeighbours = ns.scan(servers[i]);

		for (let j = 0; j < currentNeighbours.length; j++) {
			// skips adding the current server to the list if it is already in general list
			if (servers.includes(currentNeighbours[j])) continue;
			servers.push(currentNeighbours[j]); // else adds the servers to the list
		}
	}
	let excludedServer = "home";
	servers = servers.filter((server) => server !== excludedServer);

	return servers;
}
