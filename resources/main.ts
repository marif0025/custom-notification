import './sass/style.scss';

interface notificationOptions {
    message: string,
    prefix?: string,
    type?: string,
    autoClose?: boolean,
    autoCloseDelay?: number,
    parent?: string
}

const Notification = {
    open(options: notificationOptions) {
        options = Object.assign({}, {
            prefix: 'notification',
            type: 'success',
            autoClose: true,
            autoCloseDelay: 5000
        }, options);

        const floating: boolean = options.parent === undefined;

        const html = `
                    <div class="${options.prefix} ${options.type} ${floating ? 'floating' : ''}">
                        <div class="${options.prefix}--icon">
                            <i class="icon">
                                <svg><use xlink:href="#icon-${options.type}"></use></svg>
                            </i>
                        </div>
                    
                        <div class="${options.prefix}--content">
                            ${options.message}
                        </div>
                    
                        <button class="${options.prefix}--close-btn">
                        </button>
                    </div>`;

        const template = document.createElement('template');
        template.innerHTML = html;

        // Elements
        const notificationEl = <HTMLElement>template.content.querySelector(`.${options.prefix}`);
        const btnClose = <HTMLElement>template.content.querySelector(`.${options.prefix}--close-btn`);

        if (btnClose) {
            btnClose.addEventListener('click', () => {
                this._close(notificationEl);
            });
        }

        options.autoClose && setTimeout(() => {
            this._close(notificationEl);
        }, options.autoCloseDelay);

        if (options.parent === undefined) {
            document.body.appendChild(template.content);

            setTimeout(() => {
                notificationEl.classList.add('show');
            }, 200);
        } else {
            const parentEl = document.querySelector(options.parent);
            parentEl?.prepend(template.content);

            setTimeout(() => {
                notificationEl.classList.add('show');
            }, 200);
        }
    },

    _close(notificationEl: HTMLElement) {
        notificationEl.classList.remove('show');

        setTimeout(() => {
            notificationEl.remove();
        }, 500);
    }
}

export default Notification;

document.querySelector('#button')?.addEventListener('click', (e) => {
    Notification.open({
        prefix: 'notification',
        message: 'Custom Message',
        autoClose: true,
        parent: '.form'
    });
});
