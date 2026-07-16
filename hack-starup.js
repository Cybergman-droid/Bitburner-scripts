import { getServerNames } from "serverutils/server_name_list.ts";
import { getRootAccess } from "serverutils/server_nuke";
import { getServerObjects } from "serverutils/server_obj_list.ts";
import { getBestServerList } from "serverutils/bestserverList.ts";
import { serverReset } from "serverutils/server-reset";
/** @param {NS} ns */
export async function main(ns) {
	let scriptToBeRun = "smart-hack-template.ts";
	let scriptRam = ns.getScriptRam(scriptToBeRun);
	let serverNames = getServerNames(ns);
	let hackedServers = new Set(["home"]);
	let currentBestServer = null;
	let totalThreads = 0;

	while (true) {
		let bestServerHasChanged = false;
		let player = ns.getPlayer();
		console.log(player);

		// Always refresh server objects
		const servers = getServerObjects(ns, serverNames);

		// Pick best target using fresh server data
		const bestServers = getBestServerList(servers, player);
		const newBestServer = bestServers[0].hostname;

		if (currentBestServer !== newBestServer) {
			ns.tprint(
				`Best target changed from ${currentBestServer} → ${newBestServer}`,
			);
			currentBestServer = newBestServer;
			console.log("the current best server is");
			console.log(currentBestServer);
			bestServerHasChanged = true;
		}

		// Try to root every server
		for (let server of servers) {
			if (!server.hasAdminRights) {
				//ns.tprint(` Admin rights on ${server.hostname}: ${server.hasAdminRights}`)
				//ns.tprint(`${server.hostname} has not been hacked`)
				await getRootAccess(ns, server);
				//ns.tprint(` Admin rights on ${server.hostname}: ${server.hasAdminRights}`)
			}
		}

		for (let server of servers) {
			const serverName = server.hostname;
			if (!server.hasAdminRights) continue;

			if (bestServerHasChanged) {
				// totalThreads = 0;
				serverReset(ns, server);
			}

			// Skip servers already deployed (unless best changed)
			if (!bestServerHasChanged && hackedServers.has(serverName)) continue;

			let maxRam = server.maxRam;
			let numOfThreads = Math.floor(maxRam / scriptRam);

			if (numOfThreads < 1) continue;

			// Copy script
			ns.scp(scriptToBeRun, serverName, "home");

			// Execute script
			try {
				ns.exec(scriptToBeRun, serverName, numOfThreads, currentBestServer);
				ns.tprint(
					`${scriptToBeRun} executed on ${server.hostname} with ${numOfThreads} threads`,
				);
				totalThreads += numOfThreads;
			} catch (e) {
				ns.tprint(`Error executing on ${serverName}: ${e}`);
			}

			hackedServers.add(serverName);
		}
		ns.tprint(" ");
		ns.tprint(`${scriptToBeRun} executed with ${totalThreads} threads`);
		ns.tprint("Sleeping 5 minutes before next scan...");
		ns.tprint(" ");
		await ns.sleep(300000);
		ns.tprint(" ");
		ns.tprint(
			"===============================================================================",
		);
		ns.tprint("Checking for extra servers to hack");
		ns.tprint(" ");
	}
}
