// (C) 2025 GoodData Corporation
import { useMemo } from "react";
import { AgGridReactProps } from "ag-grid-react";
import { ICorePivotTableInnerNextProps } from "../types/public.js";
import { AgGridRowData } from "../types/internal.js";
import { AG_GRID_PIVOT_RESULT_FIELD_SEPARATOR } from "../constants/agGrid.js";
import { createServerSideDataSource } from "../dataSource/createServerSideDataSource.js";
import { getColumnHeadersPosition, getExecutionProps, getIsPivotMode } from "../mapProps/props.js";
import { useTableMetadata } from "../context/TableMetadataContext.js";

/**
 * @alpha
 */
export const useServerSideRowModel = (
    props: ICorePivotTableInnerNextProps,
): AgGridReactProps<AgGridRowData> => {
    const { executionResult } = props;
    const isPivotMode = getIsPivotMode(props);
    const columnHeadersPosition = getColumnHeadersPosition(props);
    const { rows, measures, sortBy } = getExecutionProps(props);
    const { setCurrentDataView } = useTableMetadata();

    const dataSource = useMemo(
        () =>
            createServerSideDataSource({
                rows,
                measures,
                sortBy,
                isPivotMode,
                executionResult,
                columnHeadersPosition,
                setCurrentDataView,
            }),
        [columnHeadersPosition, executionResult, isPivotMode, measures, rows, sortBy, setCurrentDataView],
    );

    return {
        rowModelType: "serverSide",
        serverSideDatasource: dataSource,
        serverSidePivotResultFieldSeparator: AG_GRID_PIVOT_RESULT_FIELD_SEPARATOR,
    };
};
