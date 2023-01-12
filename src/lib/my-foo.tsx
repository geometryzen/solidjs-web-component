import { Accessor, createEffect, createSignal, JSX, Setter } from "solid-js"
import { render } from "solid-js/web"

/**
 * The (HTML) attributes of the MyFoo Web Component.
 */
export interface MyFooAttributes {
    "bar": string
    "ugg"?: boolean
    "onCount"?: any
}

/**
 * 
 */
export interface MyFooCountEvent extends CustomEvent<number> {
    detail: number
}

export class MyFoo extends HTMLElement {
    static get observedAttributes() {
        return ["bar", "ugg"]
    }
    readonly #bar: Accessor<string>
    readonly #setBar: Setter<string>
    readonly #ugg: Accessor<boolean>
    readonly #setUgg: Setter<boolean>
    #cleanUp: (() => void) | undefined
    #countId: number | undefined
    constructor() {
        super()
        const [bar, setBar] = createSignal<string>('')
        const [ugg, setUgg] = createSignal<boolean>(false)
        this.#bar = bar
        this.#setBar = setBar
        this.#ugg = ugg
        this.#setUgg = setUgg
    }

    connectedCallback() {
        const MyFooJsx = (): JSX.Element => {
            const [count, setCount] = createSignal(0)

            createEffect(() => {
                // https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
                const event = new CustomEvent<number>('count', { detail: count() })
                this.dispatchEvent(event)
            })

            this.#countId = window.setInterval(() => setCount(count() + 1), 1000)
            return (
                <>
                    <h1>This is coming from MyFoo</h1>
                    <p>Here is bar: {JSON.stringify(this.#bar())}</p>
                    <p>Here is ugg: {JSON.stringify(this.#ugg())}</p>
                    <div>Count: {count()}</div>
                    <button onClick={() => setCount(count() - 1)}>Click Me</button>
                </>
            )
        }

        const shadow = this.attachShadow({ mode: 'open' })
        this.#cleanUp = render(() => <MyFooJsx />, shadow)

        // You can also use the Light DOM...
        // this.#cleanUp = render(() => <MyFooJsx />, this)
    }

    disconnectedCallback() {
        if (this.#countId) {
            window.clearInterval(this.#countId)
            this.#countId = void 0
        }
        if (this.#cleanUp) {
            this.#cleanUp()
            this.#cleanUp = void 0
        }
    }

    adoptedCallback() {
        console.warn('MyFoo.adoptedCallback.')
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case "bar": {
                this.#setBar(newValue)
                break
            }
            case "ugg": {
                this.#setUgg(true)
                break
            }
            default: {
                console.warn(`MyFoo.attributeChanged ${name} changed ${oldValue}=>${JSON.stringify(newValue)}.`)
            }
        }
    }

    customMethod() {
        console.log('MyFoo.customMethod called')
    }
}
