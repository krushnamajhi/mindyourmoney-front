import React, { createContext, useContext, useState } from 'react';

export type MenuSize = 'small' | 'medium' | 'large';

interface MenuContextType {
    open: boolean;
    toggleMenu: (open: boolean) => void;
    closeMenu: () => void;
    compact: boolean;
    setCompact: (compact: boolean) => void;
    size: MenuSize;
    setSize: (size: MenuSize) => void;
    menuId: string;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children, isCompact = false, menuSize = 'medium', id }: { children: React.ReactNode, isOpen?: boolean, isCompact?: boolean, menuSize?: MenuSize, id: string }) {
    const [open, setOpen] = useState<boolean>(isCompact ? true : false);
    const [compact, setCompact] = useState<boolean>(isCompact);
    const [size, setSize] = useState<MenuSize>(menuSize);
    const toggleMenu = (open: boolean) => {
        setOpen(open);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <MenuContext.Provider
            value={{
                open,
                toggleMenu,
                closeMenu,
                compact,
                setCompact,
                size,
                setSize,
                menuId: id
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
}
