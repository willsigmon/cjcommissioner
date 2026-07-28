import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import QRCode from "qrcode";

const target = "https://cjcommissioner.com/donate";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "public", "qr");

await mkdir(output, { recursive: true });

const svg = await QRCode.toString(target, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 4,
  color: { dark: "#0E1B2AFF", light: "#FFFDF7FF" },
});
await writeFile(join(output, "donate.svg"), svg, "utf8");

await QRCode.toFile(join(output, "donate-2048.png"), target, {
  type: "png",
  errorCorrectionLevel: "H",
  margin: 4,
  width: 2048,
  color: { dark: "#0E1B2AFF", light: "#FFFDF7FF" },
});

await writeFile(
  join(output, "README.txt"),
  [
    "Target: https://cjcommissioner.com/donate",
    "Generated reproducibly with `npm run generate:qr`.",
    "Production gate: test both files at 1-inch and 2-inch print sizes on iPhone and Android cameras.",
    "",
  ].join("\n"),
  "utf8",
);
