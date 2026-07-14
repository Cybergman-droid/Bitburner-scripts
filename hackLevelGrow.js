/** @param {NS} ns */
export async function main(ns) {
	// Defines the "target server"
	const target = "joesguns";

	// Defines the minimum security level the target server can
	// have. If the target's security level is higher than this,
	// we'll weaken it before doing anything else
	const securityThresh = ns.getServerMinSecurityLevel(target);
	const currentSecurityLevel = ns.getServerSecurityLevel(target);

	ns.tprint(`Hack level grow deployed on ${target} from ${ns.getHostname()}`);

	while (true) {
		if (currentSecurityLevel > securityThresh) {
			// If the server's security level is above our threshold, weaken it
			await ns.weaken(target);
		} else {
			// Otherwise, grow it
			await ns.grow(target);
		}
	}
}
