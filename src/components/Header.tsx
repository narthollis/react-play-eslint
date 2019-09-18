import React from 'react';

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const PageHeader = styled.header`
    font-size: ${(p): string => p.theme.header.fontSize};

    height: ${(p): string => p.theme.header.size};
    flex: 0 0 ${(p): string => p.theme.header.size};
    display: flex;
    flex-direction: row;

    color: ${(p): string => p.theme.header.color};
    background: ${(p): string => p.theme.header.background};

    h1 {
        font-size: ${(p): string => p.theme.header.brandSize};
        font-weight: normal;
        padding: 0;
        margin: 0 1rem;
        flex: 0 0;
        white-space: nowrap;
    }

    nav {
        flex: 1;
        display: flex;
        flex-direction: row;
    }

    a {
        line-height: ${(p): string => p.theme.header.size};
        color: ${(p): string => p.theme.header.color};
        padding: 0;
        margin: 0 1rem;
        white-space: nowrap;

        &:hover {
            color: ${(p): string => p.theme.header.color};
        }

        & + a {
            margin-left: 0;
        }

        &.active {
            color: magenta;
        }
    }
`;

export const Header: React.FunctionComponent = () => (
    <PageHeader>
        <h1>Play App</h1>
        <nav>
            <NavLink to="/here" activeClassName="active">
                Here
            </NavLink>
            <NavLink to="/there" activeClassName="active">
                There
            </NavLink>
            <NavLink to="/everywhere" activeClassName="active">
                Everywhere
            </NavLink>
            <NavLink to="/somewhere-else" activeClassName="active">
                Somewhere Else
            </NavLink>
            <NavLink to="/over-there" activeClassName="active">
                Over There
            </NavLink>
        </nav>
    </PageHeader>
);
