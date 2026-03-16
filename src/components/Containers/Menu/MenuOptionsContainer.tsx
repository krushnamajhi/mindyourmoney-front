import clsx from 'clsx'
import React from 'react'
import { useMenu } from '../../../context/MenuContext'

export default function MenuOptionsContainer({ children }: { children: React.ReactNode }) {
    const { compact } = useMenu();
    return (
        <div className={clsx(compact ? 'flex space-x-1' : 'absolute top-full right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10 flex flex-col')}>
            {children}
        </div>
    )
}