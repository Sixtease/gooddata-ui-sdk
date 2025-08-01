// (C) 2025 GoodData Corporation
import React, { useState } from "react";
import { UiTabs, UiTabsProps, UiTab, propCombinationsFor, ComponentTable } from "@gooddata/sdk-ui-kit";

import { wrapWithTheme } from "../themeWrapper.js";
import noop from "lodash/noop.js";

const tabs = [
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
    { id: "tab3", label: "Tab 3" },
    { id: "tab4", label: "Tab 4" },
] as UiTab[];

const propCombination = propCombinationsFor({
    tabs,
    selectedTabId: "tab1",
    onTabSelect: noop,
    accessibilityConfig: {
        ariaLabel: "Tabs",
        ariaRole: "tablist",
        tabRole: "tab",
    },
} as UiTabsProps);

const allSizes = propCombination("size", ["large", "medium", "small"]);

const UiTabsTest: React.FC<{ showCode?: boolean }> = ({ showCode }) => (
    <div className="screenshot-target">
        <ComponentTable
            rowsBy={[allSizes]}
            Component={UiTabs}
            codeSnippet={showCode ? "UiTabs" : undefined}
            align="flex-start"
            cellWidth={400}
        />
    </div>
);

const InteractiveUiTabsTest: React.FC = () => {
    const [selectedTabId, setSelectedTabId] = useState<string>("tab1");
    return (
        <UiTabs
            tabs={tabs}
            onTabSelect={(tab) => setSelectedTabId(tab.id)}
            selectedTabId={selectedTabId}
            size="large"
        />
    );
};

export default {
    title: "15 Ui/UiTabs",
};

export const Default = () => <UiTabsTest />;
Default.parameters = { kind: "default", screenshot: true };

export const Themed = () => wrapWithTheme(<UiTabsTest />);
Themed.parameters = { kind: "themed", screenshot: true };

export const Interface = () => <UiTabsTest showCode />;
Interface.parameters = { kind: "interface" };

export const Interactive = () => <InteractiveUiTabsTest />;
Interactive.parameters = { kind: "interactive" };
