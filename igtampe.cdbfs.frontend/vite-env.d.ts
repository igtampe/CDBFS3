/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_INSTANCE_NAME: string
    readonly VITE_INSTANCE_LOGO: string

    readonly VITE_BACKEND_URL: string

    readonly VITE_THEME_PRIMARY_COLOR: string
    readonly VITE_THEME_SECONDARY_COLOR: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}