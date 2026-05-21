import esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️  SUPABASE_URL or SUPABASE_ANON_KEY not set. Using placeholder values."
  );
}

let code = readFileSync(join(__dirname, "src", "widget.js"), "utf-8");
code = code.replace("__SUPABASE_URL__", supabaseUrl);
code = code.replace("__SUPABASE_ANON_KEY__", supabaseAnonKey);

const result = await esbuild.transform(code, {
  minify: true,
  target: "es2015",
});

mkdirSync(join(__dirname, "dist"), { recursive: true });
writeFileSync(join(__dirname, "dist", "widget.js"), result.code);
console.log("✅ Built dist/widget.js");

let examplesIndex = readFileSync(
  join(__dirname, "examples", "index.html"),
  "utf-8"
);
examplesIndex = examplesIndex.replace('../src/widget.js', 'widget.js');
writeFileSync(join(__dirname, "dist", "index.html"), examplesIndex);
console.log("✅ Built dist/index.html (demo page)");
