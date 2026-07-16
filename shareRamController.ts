export async function main(ns: NS) {
	let scriptToBeRun = "shareRam.ts";
	let scriptRam = ns.getScriptRam(scriptToBeRun);
	let hostname = "home";
	let maxRam = ns.getServerMaxRam(hostname);
	let usedRam = ns.getServerUsedRam(hostname);
	let freeRam = maxRam - usedRam;
	let numOfThreads = Math.floor(freeRam / scriptRam);
	ns.exec(scriptToBeRun, hostname, numOfThreads);

	ns.tprint(
		`${scriptToBeRun} executed on ${hostname} with ${numOfThreads} threads`,
	);
}
