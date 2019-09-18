// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        readonly header: {
            readonly color: string;
            readonly background: string;
            readonly size: string;
            readonly brandSize: string;
            readonly fontSize: string;
        };
        readonly colors: {
            readonly main: string;
            readonly secondary: string;
        };
    }
}
