import { createGlobalStyle } from 'styled-components';

export const BaseStyle = createGlobalStyle`
    :root {
        background: ${(p): string => p.theme.colors.background};
        color: ${(p): string => p.theme.colors.main};
    }
  
    html {
        display: flex;
        width: 100%;
        height: 100%;
        min-height: 0;
    }
  
    body, body > div.root {
        display: flex;
        flex: 1 0 100%;
        flex-direction: column;
        min-height: 0;
        background: ${(p): string => p.theme.colors.background};
        color: ${(p): string => p.theme.colors.main};
    }
    
    h1 {
        font-weight: normal;
    }
    
    main {
        padding: 1rem;
    }
`;
