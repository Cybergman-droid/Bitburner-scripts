/** @param {NS} ns */
export async function main(ns: NS) {
	const args: ScriptArg[] = ns.args;
	const currentServer = ns.getHostname();

	const passedTarget: ScriptArg = args[0];
	const target: string =
		typeof passedTarget === "string" && ns.serverExists(passedTarget)
			? passedTarget
			: currentServer;

	// Smart thresholds
	const moneyTargetPct = 0.95; // grow until 95% full
	const securityMargin = 2; // weaken if security is 2 above minimum

	ns.tprint(`Smart hack deployed on ${target} from ${currentServer}`);

	while (true) {
		const moneyMax: number = ns.getServerMaxMoney(target);
		const moneyNow: number = ns.getServerMoneyAvailable(target);
		const secNow: number = ns.getServerSecurityLevel(target);
		const secMin: number = ns.getServerMinSecurityLevel(target);

		const moneyThresh: number = moneyMax * moneyTargetPct;
		const secThresh: number = secMin + securityMargin;

		// Smart decision logic
		if (secNow > secThresh) {
			await ns.weaken(target);
		} else if (moneyNow < moneyThresh) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}
