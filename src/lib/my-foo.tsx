import { BehaviorSubject, Observable } from "rxjs";
import { Accessor, createEffect, createSignal, JSX, Setter } from "solid-js";
import { render } from "solid-js/web";
export { Observable } from "rxjs";

/**
 * The (HTML) attributes of the MyFoo Web Component.
 * This is used when the web component is used in JSX.
 */
export interface MyFooAttributes {
    "bar": string;
    "debug"?: boolean;
    "ugg"?: boolean;
}

/**
 * The custom methods of the MyFoo component.
 * This is useful when using the component in an IDE.
 */
export interface MyFooCustomMethods {
    count$: Observable<number>;
    customMethod(): void;
}

/**
 * The synthetic 'count' event.
 */
export type MyFooCountEvent = CustomEvent<number>;

/**
 * The MyFoo custom HTML element.
 */
export class MyFoo extends HTMLElement implements MyFooCustomMethods {
    static get observedAttributes() {
        return ["bar", "debug", "ugg"];
    }
    readonly #bar: Accessor<string>;
    readonly #setBar: Setter<string>;
    readonly #debug: Accessor<boolean>;
    readonly #setDebug: Setter<boolean>;
    readonly #ugg: Accessor<boolean>;
    readonly #setUgg: Setter<boolean>;
    #cleanUp: (() => void) | undefined;
    #countId: number | undefined;
    #count = new BehaviorSubject(0);
    count$ = this.#count.asObservable();
    constructor() {
        super();
        const [bar, setBar] = createSignal<string>('');
        const [ugg, setUgg] = createSignal<boolean>(false);
        this.#bar = bar;
        this.#setBar = setBar;
        this.#ugg = ugg;
        this.#setUgg = setUgg;
        const [debug, setDebug] = createSignal<boolean>(false);
        this.#debug = debug;
        this.#setDebug = setDebug;
    }

    connectedCallback() {
        if (this.#debug()) {
            // eslint-disable-next-line no-console
            console.log("MyFoo.connectedCallback()");
        }
        const MyFooJsx = (): JSX.Element => {
            const [count, setCount] = createSignal(0);

            createEffect(() => {
                const value = count();
                this.#count.next(value);
                // https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
                const event = new CustomEvent<number>('count', { detail: value });
                this.dispatchEvent(event);
            });

            this.#countId = window.setInterval(() => setCount(count() + 1), 1000);
            return (
                <>
                    <h1>MyFoo</h1>
                    <p>bar: {JSON.stringify(this.#bar())}</p>
                    <p>ugg: {JSON.stringify(this.#ugg())}</p>
                    <p>count: {count()}</p>
                    <p>debug: {JSON.stringify(this.#debug())}</p>
                    <button onClick={() => setCount(count() + 1)}>Increment Count</button>
                    <button onClick={() => setCount(count() - 1)}>Decrement Count</button>
                </>
            );
        };

        const shadow = this.attachShadow({ mode: 'open' });
        this.#cleanUp = render(() => <MyFooJsx />, shadow);

        // You can also use the Light DOM...
        // this.#cleanUp = render(() => <MyFooJsx />, this)
    }

    disconnectedCallback() {
        if (this.#debug()) {
            // eslint-disable-next-line no-console
            console.log("MyFoo.disconnectedCallback()");
        }
        if (this.#countId) {
            window.clearInterval(this.#countId);
            this.#countId = void 0;
        }
        if (this.#cleanUp) {
            this.#cleanUp();
            this.#cleanUp = void 0;
        }
    }

    adoptedCallback() {
        if (this.#debug()) {
            // eslint-disable-next-line no-console
            console.log("MyFoo.adoptedCallback()");
        }
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (this.#debug()) {
            // eslint-disable-next-line no-console
            console.log(`MyFoo.attributeChanged ${JSON.stringify(name)} changed ${JSON.stringify(oldValue)}=>${JSON.stringify(newValue)}.`);
        }
        switch (name) {
            case "bar": {
                this.#setBar(newValue);
                break;
            }
            case "debug": {
                this.#setDebug(booleanValue(newValue));
                break;
            }
            case "ugg": {
                this.#setUgg(booleanValue(newValue));
                break;
            }
            default: {
                // eslint-disable-next-line no-console
                console.warn(`MyFoo.attributeChanged ${name} changed ${oldValue}=>${JSON.stringify(newValue)}.`);
            }
        }
    }

    customMethod(): void {
        // eslint-disable-next-line no-console
        console.log('MyFoo.customMethod called');
    }
}

/**
 * For use with HTML boolean attributes.
 * @param value 
 */
function booleanValue(value: string | null): boolean {
    if (typeof value === 'string') {
        return true;
    }
    else if (value === null) {
        return false;
    }
    else {
        throw new Error();
    }
}

export function defineCustomElementMyFoo(name: string, options?: ElementDefinitionOptions): void {
    window.customElements.define(name, MyFoo, options);
}

export function isMyFoo(x: unknown): x is HTMLElement & MyFooCustomMethods {
    return x instanceof MyFoo;
}

export function assertMyFoo(element: HTMLElement | null): HTMLElement & MyFooCustomMethods {
    if (isMyFoo(element)) {
        return element;
    }
    else {
        throw new Error();
    }
}
