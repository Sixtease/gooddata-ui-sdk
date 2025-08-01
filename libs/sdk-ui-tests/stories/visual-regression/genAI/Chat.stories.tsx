// (C) 2020-2025 GoodData Corporation
import React from "react";
import { ChatEvent, GenAIAssistant } from "@gooddata/sdk-ui-gen-ai";
import { StorybookBackend, ReferenceWorkspaceId } from "../../_infra/backend.js";

import { wrapWithTheme } from "../themeWrapper.js";

import "@gooddata/sdk-ui-gen-ai/styles/css/main.css";
import { action } from "storybook/actions";

const backend = StorybookBackend();

const FlexAIBase: React.FC<{ width?: number }> = ({ width = 500 }) => (
    <div className="library-component screenshot-target">
        <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
            <div>
                <h4>Flex AI</h4>
                <div style={{ width, height: 600, display: "flex", border: "1px solid black" }}>
                    <GenAIAssistant
                        backend={backend}
                        workspace={ReferenceWorkspaceId}
                        eventHandlers={[
                            {
                                eval: (_event: ChatEvent): _event is ChatEvent => true,
                                handler: action("handle event"),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    </div>
);

export default {
    title: "14 GenAI/Chat",
};

export const FullFeatured = () => <FlexAIBase />;
FullFeatured.parameters = { kind: "full-featured" };

export const Themed = () => wrapWithTheme(<FlexAIBase />);
Themed.parameters = { kind: "themed" };
