"use client";

import { useEffect } from "react";

import { UseHeaderContext } from "../../context/header.context";

interface SetupHeaderFiltersProps {
    showDatePicker?: boolean;
    showSearch?: boolean;
    showDateRangePicker?: boolean;
}

export const SetupHeaderFilters = ({
    showDatePicker = false,
    showSearch = false,
    showDateRangePicker = false,
}: SetupHeaderFiltersProps) => {
    const { setShowDatePicker, setShowSearch, setShowDateRangePicker } = UseHeaderContext();

    useEffect(() => {
        setShowDatePicker(showDatePicker);
    }, [setShowDatePicker, showDatePicker]);

    useEffect(() => {
        setShowSearch(showSearch);
    }, [setShowSearch, showSearch]);

    useEffect(() => {
        setShowDateRangePicker(showDateRangePicker);
    }, [setShowDateRangePicker, showDateRangePicker]);

    return null;
};