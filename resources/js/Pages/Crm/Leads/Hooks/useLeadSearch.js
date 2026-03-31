import { useState, useEffect, useCallback, useRef } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

export const useLeadSearch = (filters) => {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [dropdownResults, setDropdownResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchContainerRef = useRef(null);

    // Debounce untuk filter data utama di tabel & kanban
    const handleSearch = useCallback((query) => {
        router.get(
            route("admin.crm.leads.index"),
            { ...filters, search: query },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || "")) {
                handleSearch(searchTerm);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters.search, handleSearch]);

    // Debounce untuk live search dropdown via API
    useEffect(() => {
        if (searchTerm.length < 2) {
            setDropdownResults([]);
            setIsDropdownOpen(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            axios
                .get(route("admin.crm.leads.search", { query: searchTerm }))
                .then((response) => {
                    setDropdownResults(response.data);
                    setIsDropdownOpen(response.data.length > 0);
                });
        }, 250);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchContainerRef]);

    return {
        searchTerm,
        setSearchTerm,
        dropdownResults,
        setDropdownResults,
        isDropdownOpen,
        setIsDropdownOpen,
        searchContainerRef,
        handleSearch,
    };
};
