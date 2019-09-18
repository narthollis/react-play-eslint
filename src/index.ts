import ReactDOM from 'react-dom';
import React from 'react';

async function main(): Promise<void> {
    const { Main } = await import('./main');

    const root = document.createElement('div');
    root.className = 'root';
    document.body.appendChild(root);

    ReactDOM.render(React.createElement(Main), root);
}

main().then(
    () => {
        console.info('init finished');
    },
    e => {
        console.error('error running app', e);
    },
);
