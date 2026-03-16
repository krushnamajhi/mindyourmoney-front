import React, { useRef, useEffect } from 'react'
import MenuIcon from '../../UI/Menu/MenuIcon';
import { MenuProvider, useMenu, type MenuSize } from '../../../context/MenuContext';
import MenuOptionsContainer from './MenuOptionsContainer';

function MenuContent({ children }: { children: React.ReactNode }) {
    const { open, closeMenu, compact } = useMenu();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };
        if (compact) {
            return;
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, closeMenu, compact]);

    return (
        <div className="relative" ref={containerRef}>
            <MenuIcon />
            {(open) && <MenuOptionsContainer>{children}</MenuOptionsContainer>}
        </div>
    );
}

export default function MenuContainer({ children, compact = false, size = 'medium', id }: { children: React.ReactNode, compact?: boolean, size?: MenuSize, id: string }) {
    return (
        <MenuProvider isCompact={compact} menuSize={size} id={id}>
            <MenuContent>
                {children}
            </MenuContent>
        </MenuProvider>
    )
}