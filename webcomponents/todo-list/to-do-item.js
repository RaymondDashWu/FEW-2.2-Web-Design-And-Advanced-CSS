const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
    display: block;
    font-family: sans-serif;
    }

    .completed {
    text-decoration: line-through;
    }

    button {
    border: none;
    cursor: pointer;
    }
</style>
<li class="item">
    <input type="checkbox">
    <label></label>
    <button>❌</button>
</li>
`;

class TodoItem extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.appendChild.cloneNode(true));

        this.$item = this._shadowRoot.querySelector('.item');
        this.$removeButton = this._shadowRoot.querySelector('button');
        this.$text = this._shadowRoot.querySelector('label');
        this.$checkbox = this._shadowRoot.querySelector('input');

        this.$removeButton.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onRemove', { detail: this.index }));
        });

        this.$checkbox.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onToggle', { detail: this.index }));
        });
    }

    connectedCallback() {
        // We set a default attribute here; if our end user hasn't provided one,
        // our element will display a "placeholder" text instead.
        if(!this.hasAttribute('text')) {
            this.setAttribute('text', 'placeholder');
        }

        this._renderTodoItem();
    }

    _renderTodoItem() {
        if (this.hasAttribute('checked')) {
            this.$item.classList.add('completed');
            this.$checkbox.setAttribute('checked', '');
        } else {
            this.$item.classList.remove('completed');
            this.$checkbox.removeAttribute('checked');
        }

        this.$text.innerHTML = this._text;
    }

    static get observedAttributes() {
        return ['text'];
    }
}
window.customElements.define('to-do-item', TodoItem);