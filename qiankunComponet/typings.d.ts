declare module '*.css';
declare module '*.jpg';
declare module '*.less' {
  const classes: { [className: string]: string };
  export default classes;
}

declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

declare module 'nunjucks' {
  type TParams = {
    [propsName: string]: any;
  };
  export function render(name: string, context: TParams, callback?: () => {}): string;
}
