// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        readonly header: {
            readonly color: string;
            readonly background: string;
            readonly hoverColor?: string;
            readonly hoverBackground?: string;
            readonly activeColor?: string;
            readonly activeBackground?: string;
            readonly size: string;
            readonly brandSize: string;
            readonly fontSize: string;
        };
        readonly colors: {
            readonly background: string;
            readonly main: string;
            readonly secondary: string;
        };
    }
}
