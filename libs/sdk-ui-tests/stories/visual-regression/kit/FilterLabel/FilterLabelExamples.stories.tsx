// (C) 2007-2025 GoodData Corporation
import React from "react";
import { FilterLabel } from "@gooddata/sdk-ui-kit";

import { withIntl } from "@gooddata/sdk-ui";

const FilterLabelExamples: React.FC = () => {
    return (
        <div className="library-component screenshot-target">
            <h4>Example for title/selection</h4>
            <FilterLabel title="Attribute" selection="A, B, C" />

            <h4>Example with All selected</h4>
            <FilterLabel title="Attribute" isAllSelected />

            <h4>Example with nothing selected</h4>
            <FilterLabel title="Attribute" selectionSize={0} />
        </div>
    );
};

const customMessages = {
    "gs.filterLabel.none": "None",
    "gs.filterLabel.all": "All",
};

const WithIntl = withIntl(FilterLabelExamples, undefined, customMessages);

export default {
    title: "12 UI Kit/FilterLabel",
};

export const FullFeatured = () => <WithIntl />;
FullFeatured.parameters = { kind: "full-featured", screenshot: true };
