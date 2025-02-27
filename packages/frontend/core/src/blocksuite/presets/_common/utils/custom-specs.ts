import { BlockViewIdentifier } from '@blocksuite/affine/block-std';
import { PageEditorBlockSpecs } from '@blocksuite/affine/blocks';
import type { ExtensionType } from '@blocksuite/affine/store';
import { literal } from 'lit/static-html.js';

export const CustomPageEditorBlockSpecs: ExtensionType[] = [
  ...PageEditorBlockSpecs,
  {
    setup: di => {
      di.override(
        BlockViewIdentifier('affine:page'),
        () => literal`affine-page-root`
      );
    },
  },
];
