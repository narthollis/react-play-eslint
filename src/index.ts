async function main(): Promise<void> {
    const { render } = await import('./main');

    const root = document.createElement('div');
    root.className = 'root';
    document.body.appendChild(root);

    await render(root);
}

main().then(
    () => {
        console.info('init finished');
    },
    e => {
        console.error('error running app', e);
    },
);
