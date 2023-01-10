declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react';

  export const ReactComponent:
    FunctionComponent<
      SVGProps<SVGSVGElement>&
      { title?: string }
    >;

  const src: string;
  export default src; // Represents the import string for the svg with the svg builder
}
