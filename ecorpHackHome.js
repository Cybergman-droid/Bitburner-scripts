export async function main(ns) {
	let scriptToBeRun = "ecorpHack.js";
	let scriptRam = ns.getScriptRam(scriptToBeRun);
	let hostname = "home";
	let maxRam = ns.getServerMaxRam(hostname);
	let usedRam = ns.getServerUsedRam(hostname);
	let freeRam = maxRam - usedRam;
	let numOfThreads = Math.floor(freeRam / scriptRam);
	try {
		ns.exec(scriptToBeRun, hostname, numOfThreads);
	} catch (e) {
		ns.tprint(e);
		numOfThreads -= 1;
		ns.exec(scriptToBeRun, hostname, numOfThreads);
	} finally {
		ns.tprint(
			`${scriptToBeRun} executed on ${hostname} with ${numOfThreads} threads`,
		);
	}
}
