// Turn into module.
export {}

interface UnifiedjsGenerateFields {
  group?: string | undefined
}

declare module 'vfile' {
  interface DataMapMatter extends UnifiedjsGenerateFields {}

  interface DataMap {
    matter: DataMapMatter
  }
}
