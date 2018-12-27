export interface BaseComponent {
    propertyChanged(prop: string, value: any, oldValue: any): any;
    requestRender(): any;
    observedProperties: string[] | null;
    element: BaseElement;
    render(props:any): any;
    [prop:string]: any;
  }

  export interface BaseElement extends Element {
    [prop:string]: any;
  }
