import { useEffect, useRef, useState } from "react";
import type { APIError } from "../../lib/ErrorTypes";

export function useFormErrorsUI() {
    const [validationErrors, setValidationErrors] = useState<{ path?: string; message?: string }[]>([]);
    const errorContainerRef = useRef<HTMLDivElement | null>(null);

    const addError = (path: string, message: string) => {
        setValidationErrors((prev) => [...prev, { path, message }]);
    };

    const setFormErrors = (errors: APIError) => {
        if (errors.message === 'Validation Error') {
            setValidationErrors(errors.errors as any[]);
        }
    };

    const clearErrors = () => {
        setValidationErrors([]);
    };

    const clearError = (path: string) => {
        setValidationErrors((prev) => prev.filter((error) => error.path !== path));
    };

    const getError = (path: string) => {
        return validationErrors.find((error) => error.path === path);
    };

    const hasErrors = () => {
        return validationErrors.length > 0;
    };

    useEffect(() => {
        if (hasErrors()) {
            console.log("Current Form Errors:", validationErrors);
            requestAnimationFrame(() => {
                errorContainerRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        }
    }, [validationErrors]);

    const highlightErrorField = (path: string) => {
        return validationErrors.find(e => e.path?.split('.').includes(path)) ? "text-red-600 border-red-200 focus:border-red-500" : "text-slate-800 border-slate-100 focus:border-primary-500"
    }

    const renderError = () => {
        if (!hasErrors()) return null;

        return (
            <div
                ref={errorContainerRef}
                className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in slide-in-from-top-2 mb-6"
            >
                <p className="text-red-800 text-sm font-bold flex items-center mb-2">
                    <span className="mr-2">⚠️</span> Please fix the following error(s)
                </p>
                <ul className="list-disc list-inside text-red-600 text-xs font-semibold space-y-1">
                    {validationErrors.map((error, index) => (
                        <li key={index}>
                            {error.path ? (
                                <>
                                    <span className="capitalize font-bold">{error.path}</span>
                                    {": "}
                                    {error.message}
                                </>
                            ) : (
                                <>{error}</>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return {
        validationErrors,
        addError,
        setFormErrors,
        clearErrors,
        clearError,
        getError,
        hasErrors,
        renderError,
        highlightErrorField
    };
}
