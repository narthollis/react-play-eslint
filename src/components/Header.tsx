import React from 'react';

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { ThemeSelector } from 'src/style/SelectedThemeProvider';

const PageHeader = styled.header`
    font-size: ${(p): string => p.theme.header.fontSize};

    height: 3rem;
    flex: 0 0 3rem;
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
        line-height: 2.5rem;
        color: ${(p): string => p.theme.header.color};
        padding: 0 1rem;
        margin: 0.5rem 0.25rem 0;
        border-radius: 0.4rem 0.4rem 0 0;
        white-space: nowrap;

        &:hover {
            color: ${(p): string => p.theme.header.hoverColor ?? p.theme.header.color};
            background: ${(p): string => p.theme.header.hoverBackground ?? p.theme.header.background};
            text-decoration: none;
        }

        & + a {
            margin-left: 0;
        }

        &.active {
            color: ${(p): string => p.theme.header.activeColor ?? p.theme.header.color};
            background: ${(p): string => p.theme.header.activeBackground ?? p.theme.header.background};
        }
    }

    ul {
        display: flex;
        flex-direction: row;
        flex: 0 0;
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            flex: 1;
            padding: 0.5rem;
            margin: 0.25rem;
            font-size: 1.2rem;
            cursor: pointer;

            &:hover {
                color: ${(p): string => p.theme.header.hoverColor ?? p.theme.header.color};
                background: ${(p): string => p.theme.header.hoverBackground ?? p.theme.header.background};
                text-decoration: none;
            }

            &.active {
                color: ${(p): string => p.theme.header.activeColor ?? p.theme.header.color};
                background: ${(p): string => p.theme.header.activeBackground ?? p.theme.header.background};
            }
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
        <ThemeSelector />
    </PageHeader>
);
