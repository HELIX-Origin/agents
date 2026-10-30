// Root-level "agents ecosystem" plugin.
// Discovers registered projects via `.agents/registry/projects.json`, reports their
// OpenCode plugin readiness, and surfaces the configured sub-repo plugin directories.
// Sub-repo plugin loading itself is config-driven through the `plugins` array in
// `.opencode/opencode.jsonc` (mirrored here as `pluginDirs`).

import { Plugin } from "@opencode/plugin"
import { loadConfig } from "./_config"
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

export interface EcosystemConfig {
  enabled: boolean
  debug: boolean
  registryPath: string
  pluginDirs: string[]
  reportOnStartup: boolean
}

const DEFAULT_CONFIG: EcosystemConfig = {
  enabled: true,
  debug: false,
  registryPath: ".agents/registry/projects.json",
  pluginDirs: [],
  reportOnStartup: true,
}

interface ProjectEntry {
  id: string
  path: string
  kind?: string
  description?: string
}

interface Registry {
  projects?: ProjectEntry[]
}

export default Plugin.define({
  id: "helix.ecosystem",
  async setup(ctx) {
    const config = loadConfig("ecosystem", DEFAULT_CONFIG, ctx)
    if (!config.enabled) return () => {}

    const root = (ctx as { directory?: string }).directory ?? process.cwd()
    const client = (ctx as { client?: { app?: { log?: (input: unknown) => Promise<void> } } }).client

    const log = async (level: string, message: string, extra?: Record<string, unknown>) => {
      if (!client?.app?.log) return
      try {
        await client.app.log({ body: { service: "helix.ecosystem", level, message, extra } })
      } catch {
        // ignore logging failures
      }
    }

    // Read project registry
    let projects: ProjectEntry[] = []
    try {
      const registryFile = join(root, config.registryPath)
      if (existsSync(registryFile)) {
        const raw = readFileSync(registryFile, "utf-8")
        const stripped = raw.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")
        const parsed = JSON.parse(stripped) as Registry
        if (Array.isArray(parsed?.projects)) projects = parsed.projects
      }
    } catch {
      // ignore parse errors
    }

    const pluginDirs = Array.isArray(config.pluginDirs) ? config.pluginDirs : []

    if (config.reportOnStartup) {
      const statuses: string[] = []
      for (const project of projects) {
        const projectPath = join(root, project.path)
        const opencodeDir = join(projectPath, ".opencode")
        const pluginsDir = join(opencodeDir, "plugins")
        let hasOpencode = false
        let pluginCount = 0
        try {
          if (existsSync(opencodeDir) && statSync(opencodeDir).isDirectory()) {
            hasOpencode = true
            if (existsSync(pluginsDir) && statSync(pluginsDir).isDirectory()) {
              pluginCount = readdirSync(pluginsDir).filter(
                (name) => name.endsWith(".ts") || name.endsWith(".js"),
              ).length
            }
          }
        } catch {
          // ignore filesystem errors
        }
        statuses.push(
          `${project.id}: ${hasOpencode ? `ready (${pluginCount} plugins)` : "not started (no .opencode)"}`,
        )
      }

      await log("info", `Ecosystem: ${projects.length} registered, ${pluginDirs.length} configured plugin dirs`, {
        statuses,
        pluginDirs,
      })

      if (config.debug) {
        for (const status of statuses) await log("debug", status)
      }
    }

    return () => {}
  },
})
