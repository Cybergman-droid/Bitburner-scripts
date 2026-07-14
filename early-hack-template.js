/** @param {NS} ns */
export async function main(ns) {
	// Defines the "target server"
	// TODO	add script arguments to dynamically change the target
	const currentServer = ns.getHostname();
	const target = "omega-net"; //|| currentServer

	// Defines how much money a server should have before we hack it
	// In this case, it is set to the maximum amount of money.
	const moneyThresh = ns.getServerMaxMoney(target);

	// Defines the minimum security level the target server can
	// have. If the target's security level is higher than this,
	// we'll weaken it before doing anything else
	const securityThresh = ns.getServerMinSecurityLevel(target);

	ns.tprint(`Early hack deployed on ${target} from ${currentServer}`);

	// Infinite loop that continously hacks/grows/weakens the target server
	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			// If the server's security level is above our threshold, weaken it
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			// If the server's money is less than our threshold, grow it
			await ns.grow(target);
		} else {
			// Otherwise, hack it
			await ns.hack(target);
		}
	}
}
