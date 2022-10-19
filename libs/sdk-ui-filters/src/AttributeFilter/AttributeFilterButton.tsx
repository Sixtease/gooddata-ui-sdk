// (C) 2021-2022 GoodData Corporation
import React from "react";
import { AttributeFilterBase } from "./AttributeFilterBase";
import { AttributeFilterDropdownButton } from "./Components/DropdownButton/AttributeFilterDropdownButton";
import { IAttributeFilterBaseProps } from "./types";

/**
 * @public
 */
export type IAttributeFilterButtonProps = IAttributeFilterBaseProps;

/**
 * AttributeFilterButton is a component that renders a rich button and a dropdown populated with attribute values
 * for specified attribute display form.
 * @public
 */
export const AttributeFilterButton: React.FC<IAttributeFilterButtonProps> = (props) => {
    return (
        <AttributeFilterBase
            {...props}
            DropdownButtonComponent={props.DropdownButtonComponent ?? AttributeFilterDropdownButton}
            LoadingComponent={props.FilterLoading ?? props.LoadingComponent}
            ErrorComponent={props.FilterError ?? props.ErrorComponent}
        />
    );
};
