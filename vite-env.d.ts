/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string
  readonly VITE_API_URL?: string
  // Add your env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: (pattern: string) => Record<string, () => Promise<any>>
}