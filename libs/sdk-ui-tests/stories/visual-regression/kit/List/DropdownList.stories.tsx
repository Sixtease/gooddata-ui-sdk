// (C) 2021-2025 GoodData Corporation
import React from "react";

import { withIntl } from "@gooddata/sdk-ui";
import { DropdownList, SingleSelectListItem, ISingleSelectListItemProps } from "@gooddata/sdk-ui-kit";

import { wrapWithTheme } from "../../themeWrapper.js";

const items: ISingleSelectListItemProps[] = [
    {
        title: "Section 1",
        type: "header",
    },
    {
        title: "First",
    },
    {
        title: "Second",
    },
    {
        title: "Section 2",
        type: "header",
    },
    {
        title: "Third",
    },
    {
        type: "separator",
    },
    {
        title: "Fourth",
    },
];

const DropdownListExamples: React.FC = () => {
    return (
        <div className="library-component screenshot-target">
            <DropdownList
                width={200}
                items={items}
                renderItem={({ item }) => (
                    <SingleSelectListItem
                        title={item.title}
                        isSelected={item.title === "Second"}
                        type={item.type}
                    />
                )}
            />
        </div>
    );
};

const WithIntl = withIntl(DropdownListExamples, undefined, {});

export default {
    title: "12 UI Kit/DropdownList",
};

export const FullFeatured = () => <WithIntl />;
FullFeatured.parameters = { kind: "full-featured", screenshot: true };

export const Themed = () => wrapWithTheme(<WithIntl />);
Themed.parameters = { kind: "themed", screenshot: true };
