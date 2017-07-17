import React, { Component } from 'react';
import { Container, Panel } from '@extjs/reactor/modern';

export default function Layout({ children }) {
    return (
        <Container fullscreen layout="fit">
            { children }
        </Container>
    );
};
