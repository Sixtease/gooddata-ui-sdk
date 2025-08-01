// (C) 2022-2025 GoodData Corporation
import React, { useState } from "react";
import { action } from "storybook/actions";
import { InternalIntlWrapper } from "@gooddata/sdk-ui-ext/internal";
import { EmbedInsightDialogBase, IReactOptions, IWebComponentsOptions } from "@gooddata/sdk-ui-kit";

import { wrapWithTheme } from "../../themeWrapper.js";

import { code } from "./CodeMock.js";

function EmbedInsightDialogBaseExamples() {
    const [reactOptions, setReactOptions] = useState<IReactOptions>({
        type: "react",
        codeType: "ts",
        unit: "px",
        componentType: "reference",
        displayConfiguration: true,
        customHeight: true,
        height: "300",
    });

    const [webComponentOptions, setWebComponentOptions] = useState<IWebComponentsOptions>({
        type: "webComponents",
        displayTitle: true,
        customTitle: true,
        allowLocale: true,
        locale: "en-US",
        customHeight: true,
        height: "300",
        unit: "px",
    });
    return (
        <InternalIntlWrapper>
            <div className="screenshot-target" style={{ width: "100%", height: "100%" }}>
                <div className="library-component">
                    <h4>EmbedInsightDialogBase by React</h4>
                </div>

                <EmbedInsightDialogBase
                    code={code}
                    embedTab={"react"}
                    showWebComponentsTab={true}
                    embedTypeOptions={reactOptions}
                    propertiesLink={
                        "https://sdk.gooddata.com/gooddata-ui/docs/area_chart_component.html#properties"
                    }
                    integrationDocLink={"https://sdk.gooddata.com/gooddata-ui/docs/platform_integration.html"}
                    onClose={action("onClose")}
                    onCopyCode={action("onCopyCode")}
                    onTabChange={action("onTabChange")}
                    onOptionsChange={(opts) => {
                        setReactOptions(opts as IReactOptions);
                        action("onOptionsChange");
                    }}
                    openSaveInsightDialog={action("openSaveInsightDialog")}
                />

                <div className="library-component">
                    <h4>EmbedInsightDialogBase by React for un-saved insight</h4>
                </div>

                <EmbedInsightDialogBase
                    code={""}
                    embedTab={"react"}
                    showWebComponentsTab={true}
                    embedTypeOptions={reactOptions}
                    propertiesLink={
                        "https://sdk.gooddata.com/gooddata-ui/docs/area_chart_component.html#properties"
                    }
                    integrationDocLink={"https://sdk.gooddata.com/gooddata-ui/docs/platform_integration.html"}
                    onClose={action("onClose")}
                    onCopyCode={action("onCopyCode")}
                    onTabChange={action("onTabChange")}
                    onOptionsChange={(opts) => {
                        setReactOptions(opts as IReactOptions);
                        action("onOptionsChange");
                    }}
                    openSaveInsightDialog={action("openSaveInsightDialog")}
                />

                <div className="library-component">
                    <h4>EmbedInsightDialogBase without Web component tab</h4>
                </div>

                <EmbedInsightDialogBase
                    code={""}
                    embedTab={"react"}
                    showWebComponentsTab={false}
                    embedTypeOptions={reactOptions}
                    propertiesLink={
                        "https://sdk.gooddata.com/gooddata-ui/docs/area_chart_component.html#properties"
                    }
                    integrationDocLink={"https://sdk.gooddata.com/gooddata-ui/docs/platform_integration.html"}
                    onClose={action("onClose")}
                    onCopyCode={action("onCopyCode")}
                    onTabChange={action("onTabChange")}
                    onOptionsChange={(opts) => {
                        setReactOptions(opts as IReactOptions);
                        action("onOptionChange");
                    }}
                    openSaveInsightDialog={action("openSaveInsightDialog")}
                />

                <div className="library-component">
                    <h4>EmbedInsightDialogBase by Web component</h4>
                </div>

                <EmbedInsightDialogBase
                    code={code}
                    embedTab={"webComponents"}
                    showWebComponentsTab={true}
                    embedTypeOptions={webComponentOptions}
                    propertiesLink={
                        "https://sdk.gooddata.com/gooddata-ui/docs/area_chart_component.html#properties"
                    }
                    integrationDocLink={"https://sdk.gooddata.com/gooddata-ui/docs/platform_integration.html"}
                    onClose={action("onClose")}
                    onCopyCode={action("onCopyCode")}
                    onTabChange={action("onTabChange")}
                    onOptionsChange={(opts) => {
                        setWebComponentOptions(opts as IWebComponentsOptions);
                        action("onOptionChange");
                    }}
                    openSaveInsightDialog={action("openSaveInsightDialog")}
                />

                <div className="library-component">
                    <h4>EmbedInsightDialogBase by Web component for un-saved insight</h4>
                </div>

                <EmbedInsightDialogBase
                    code={""}
                    embedTab={"webComponents"}
                    showWebComponentsTab={true}
                    embedTypeOptions={webComponentOptions}
                    propertiesLink={
                        "https://sdk.gooddata.com/gooddata-ui/docs/area_chart_component.html#properties"
                    }
                    integrationDocLink={"https://sdk.gooddata.com/gooddata-ui/docs/platform_integration.html"}
                    onClose={action("onClose")}
                    onCopyCode={action("onCopyCode")}
                    onTabChange={action("onTabChange")}
                    onOptionsChange={(opts) => {
                        setWebComponentOptions(opts as IWebComponentsOptions);
                        action("onOptionChange");
                    }}
                    openSaveInsightDialog={action("openSaveInsightDialog")}
                />
            </div>
        </InternalIntlWrapper>
    );
}

export default {
    title: "12 UI Kit/EmbedInsightDialog/EmbedInsightDialogBase",
};

export const FullFeatured = () => <EmbedInsightDialogBaseExamples />;
FullFeatured.parameters = { kind: "full-featured", screenshot: true };

export const Themed = () => wrapWithTheme(<EmbedInsightDialogBaseExamples />);
Themed.parameters = { kind: "themed", screenshot: true };
