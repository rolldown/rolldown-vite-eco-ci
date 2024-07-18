// @ts-check
import { spawn } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import treeKill from "tree-kill";
import { customAssertMap, verify } from "./verify.mjs";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const appDir = path.resolve(__dirname, "../../apps");
const list = fs.readdirSync(appDir);

// ignore app list
const ignoreList = ["qwik-jsx", "qwik-tsx"];

let hasError = false;
for (let appName of list) {
	if (ignoreList.includes(appName)) {
		console.warn(`Ignoring ${appName}`);
		continue;
	}
	let abPath = path.resolve(appDir, appName);
	let err;
	try {
		await runInApp(abPath, appName);
	} catch (e) {
		err = e;
		hasError = true;
	} finally {
		if (err) {
			console.error(`Error: ${err} when executed ${appName}`, err);
		} else {
			console.log(`Case-${appName} : Success`);
		}
	}
}

if (hasError) {
	process.exit(-1);
}

/**
 * @param {string} dirPath
 * @param {string} caseName
 *
 * */
function runInApp(dirPath, caseName) {
	return new Promise((resolve, reject) => {
		const p = spawn("npm", ["run", "preview"], {
			stdio: "inherit",
			cwd: dirPath,
		});

		setTimeout(async () => {
			let exitCode = p.exitCode;
			let err;
			try {
				await testInBrowser();
			} catch (e) {
				err = e;
				exitCode = -1;
			} finally {
				cleanUp(exitCode, () => {
					if (err) {
						reject(err);
					} else {
						resolve(undefined);
					}
				});
			}
			// TODO: Using regex match to get the port number
		}, 2000);

		async function testInBrowser() {
			const browser = await chromium.launch();
			const page = await browser.newPage();

			// The actual interesting bit
			await page.goto("http://localhost:4173/");

			try {
				await verify(page, customAssertMap[caseName]);
			} catch (err) {
				throw new Error(err);
			} finally {
				await browser.close();
			}

			// Teardown
		}

		function cleanUp(exitCode, cb) {
			// @ts-ignore
			treeKill(p.pid, cb);
		}
	});
}
