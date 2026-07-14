/** @param {NS} ns */
export async function getRootAccess(ns: NS, server: Server) {
	let portBreakers = [
		"BruteSSH.exe",
		"FTPCrack.exe",
		"relaySMTP.exe",
		"HTTPWorm.exe",
		"SQLInject.exe",
	];
	let serverName = server.hostname;

	for (let portBreaker of portBreakers) {
		if (ns.fileExists(portBreaker, "home")) {
			let index = portBreakers.indexOf(portBreaker);

			if (index == 0) {
				ns.brutessh(serverName);
			}

			if (index == 1) {
				ns.ftpcrack(serverName);
			}

			if (index == 2) {
				ns.relaysmtp(serverName);
			}

			if (index == 3) {
				ns.httpworm(serverName);
			}

			if (index == 4) {
				ns.sqlinject(serverName);
			}
		}
	}

	let numOfOpenPorts = server.openPortCount ?? 0;
	let requiredHackingLevel = server.requiredHackingSkill ?? 0;
	let portsRequired = server.numOpenPortsRequired ?? 0;
	let currentHackingLevel = ns.getHackingLevel();

	/*ns.tprint(`${numOfOpenPorts} ports open on ${serverName}`)
  ns.tprint(`${requiredHackingLevel} level required to hack ${serverName}`)
  ns.tprint(`${portsRequired} ports required to hack ${serverName}`)
  ns.tprint(`players current level: ${currentHackingLevel}`)*/
	if (
		numOfOpenPorts >= portsRequired &&
		currentHackingLevel >= requiredHackingLevel
	) {
		ns.nuke(serverName);
	}
}
