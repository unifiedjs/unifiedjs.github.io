// Turn into module.
export {}

/**
 * Map of choices; `other` is required.
 */
export interface PluralRules
  extends Partial<Record<Intl.LDMLPluralRule, string>> {
  other: string
}

interface UnifiedjsGenerateFields {
  /**
   * GitHub username of author; data specific to `unifiedjs.github.io`.
   */
  authorGithub?: string | undefined
  /**
   * Index of post; data specific to `unifiedjs.github.io`.
   */
  index?: number | undefined
  /**
   * Group of post; data specific to `unifiedjs.github.io`.
   */
  group?: string | undefined
}

declare module 'vfile' {
  interface DataMapMatter extends UnifiedjsGenerateFields {}

  interface DataMap {
    matter: DataMapMatter
  }
}
