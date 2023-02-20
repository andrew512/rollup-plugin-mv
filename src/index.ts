import { Plugin } from "rollup";
import { move, copy } from "fs-extra";

export interface Files {
  /**
   * Source file or directory
   */
  src: string;
  /**
   * Destination file or directory
   */
  dest: string;
  /**
   * Whether to overwrite destination if it exists
   * @default false
   */
  overwrite?: boolean;
  /**
   * Whether to copy instead of move
   * @default false
   */
  copy?: boolean;
}

export interface PluginOptions {
  /**
   * Whether to mv once even if there are multiple outputs
   * @default false
   */
  once?: boolean;
  /**
   * Whether to overwrite destination if it exists
   * @default false
   */
  overwrite?: boolean;
}

const plugin = (
  files: Files | Files[],
  { once, overwrite }: PluginOptions = {}
): Plugin => {
  const targets = Array.isArray(files) ? files : [files];
  let called = false;

  return {
    name: "mv",
    writeBundle: async () => {
      if (called && once) return;
      called = true;
      for (const target of targets) {
        if (!target.copy) {
          await move(target.src, target.dest, {
            overwrite: target.overwrite ?? overwrite,
          });
        } else {
          await copy(target.src, target.dest, {
            overwrite: target.overwrite ?? overwrite,
          });
        }
      }
    },
  };
};

export default plugin;
