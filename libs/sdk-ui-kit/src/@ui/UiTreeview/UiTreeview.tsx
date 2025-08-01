// (C) 2025 GoodData Corporation

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import noop from "lodash/noop.js";
import { useAutoupdateRef } from "@gooddata/sdk-ui";

import { makeMenuKeyboardNavigation } from "../@utils/keyboardNavigation.js";

import { DefaultUiTreeViewItemComponent } from "./defaults/DefaultUiTreeViewItemComponent.js";
import { b } from "./treeviewBem.js";
import {
    IUiLeveledTreeViewProps,
    IUiStaticTreeViewProps,
    IUiTreeviewContext,
    LevelTypesUnion,
    UiRefsTree,
    UiStateTreeItem,
    UiStaticTreeView,
} from "./types.js";
import {
    findPath,
    getItemOnFocusedPath,
    getRefOnFocusedPath,
    getParentPathIndex,
    getNextPathIndex,
    getPrevPathIndex,
    itemsState,
} from "./utils.js";
import { UiTreeviewRoot } from "./UiTreeviewRoot.js";
import { UITreeviewItem } from "./UITreeviewItem.js";

/**
 * An accessible treeview component with static data that can be navigated by keyboard.
 * This is component for tree where all items are same type.
 * Usable in a <Dropdown /> component.
 * Should implement https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * @internal
 */
export function UiStaticTreeview<Level>(props: IUiStaticTreeViewProps<Level>) {
    return <UiTreeview<[], Level> {...props} />;
}

/**
 * An accessible treeview component with static data that can be navigated by keyboard.
 * This is component for tree where on each level items have different types.
 * Usable in a <Dropdown /> component.
 * Should implement https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * @internal
 */
export function UiLeveledTreeview<Levels extends unknown[]>(props: IUiLeveledTreeViewProps<Levels>) {
    return <UiTreeview<Levels, unknown> {...props} />;
}

function UiTreeview<Levels extends unknown[], Level>({
    items,
    selectionMode = "groups-and-leafs",
    expandedMode = "default-expanded",

    dataTestId,
    itemDataTestId,
    width,
    maxWidth,
    maxHeight,
    onSelect,
    onClose,
    onUnhandledKeyDown = noop,

    selectedItemId,

    ItemComponent = DefaultUiTreeViewItemComponent,

    shouldKeyboardActionPreventDefault,
    shouldKeyboardActionStopPropagation,
    shouldCloseOnSelect = true,
    isDisabledFocusable = false,
    isCompact = false,

    ariaAttributes,
}: IUiStaticTreeViewProps<Level>): React.ReactNode {
    const itemsRef = useRef<UiRefsTree[]>([]);
    const getState = itemsState(useState<Record<string, UiStateTreeItem>>({}), {
        expanded: expandedMode === "default-expanded",
    });

    const isItemFocusable = useCallback(
        (item?: UiStaticTreeView<Level> | UiStaticTreeView<LevelTypesUnion<Levels>>) => {
            if (!item) {
                return false;
            }
            return isDisabledFocusable || !item.item.isDisabled;
        },
        [isDisabledFocusable],
    );

    const [focusedPath, setFocusedPath] = useState<number[]>(() =>
        findPath(items, selectedItemId, isItemFocusable),
    );

    const focusedItem = getItemOnFocusedPath(items, focusedPath);
    // Scroll focused item into view
    const focusedItemNode = getRefOnFocusedPath(itemsRef.current, focusedPath);
    useEffect(() => {
        focusedItemNode?.item.scrollIntoView({ block: "nearest" });
    }, [focusedItemNode]);

    const onSelectHandle = useCallback(
        (e: React.MouseEvent | React.KeyboardEvent, path: number[], item?: UiStaticTreeView<Level>) => {
            if (!item || item.item.isDisabled) {
                return;
            }

            function doSelect() {
                if (e.nativeEvent instanceof KeyboardEvent) {
                    onSelect?.(item.item.data, {
                        type: "keyboard",
                        newTab: e.ctrlKey || e.metaKey,
                    });
                } else {
                    onSelect?.(item.item.data, {
                        type: "mouse",
                        newTab: e.ctrlKey || e.metaKey || e.nativeEvent.button === 1,
                    });
                }
                shouldCloseOnSelect && onClose?.();
            }

            switch (selectionMode) {
                case "groups-and-leafs":
                    doSelect();
                    break;
                case "groups-only":
                    // Group has children even if there are empty
                    if (item.children) {
                        doSelect();
                    }
                    break;
                case "leafs-only": {
                    // Leaf has no children
                    if (!item.children) {
                        doSelect();
                        return;
                    }
                    // Toggle group is leaf-only selection mode
                    const [state, setState] = getState(path);
                    setState({
                        ...state,
                        expanded: !state.expanded,
                    });
                    break;
                }
            }
        },
        [getState, onClose, onSelect, selectionMode, shouldCloseOnSelect],
    );

    const contextRef = useAutoupdateRef<IUiTreeviewContext<Levels, Level>>({
        itemsRef,
        items,
        onClose,
        selectedItemId,
        onSelect: onSelectHandle,
        isItemFocusable,
        setFocusedPath,
    });

    const handleKeyDown = useMemo(
        () =>
            makeMenuKeyboardNavigation(
                {
                    onFocusPrevious: () => {
                        setFocusedPath((prevPath) => {
                            return getPrevPathIndex(items, getState, prevPath, isItemFocusable);
                        });
                    },
                    onFocusNext: () => {
                        setFocusedPath((prevPath) => {
                            return getNextPathIndex(items, getState, prevPath, isItemFocusable);
                        });
                    },
                    onFocusFirst: () => {
                        setFocusedPath(() => {
                            return getPrevPathIndex(items, getState, [], isItemFocusable);
                        });
                    },
                    onFocusLast: () => {
                        setFocusedPath(() => {
                            return getNextPathIndex(items, getState, [], isItemFocusable);
                        });
                    },
                    onEnterLevel: () => {
                        const [state, setState] = getState(focusedPath);
                        if (!focusedItem.children?.length) {
                            return;
                        }
                        if (state.expanded) {
                            setFocusedPath((prevPath) => {
                                return getNextPathIndex(items, getState, prevPath, isItemFocusable);
                            });
                        } else {
                            setState({
                                ...state,
                                expanded: true,
                            });
                        }
                    },
                    onLeaveLevel: () => {
                        const [state, setState] = getState(focusedPath);
                        if (!focusedItem.children?.length || !state.expanded) {
                            setFocusedPath((prevPath) => {
                                return getParentPathIndex(items, getState, prevPath, isItemFocusable);
                            });
                        } else {
                            setState({
                                ...state,
                                expanded: false,
                            });
                        }
                    },
                    onSelect: (e) => {
                        if (focusedItem) {
                            onSelectHandle(e, focusedPath, focusedItem);
                        }
                    },
                    onClose,
                    onUnhandledKeyDown: (event) => {
                        onUnhandledKeyDown(event, contextRef.current);
                    },
                },
                {
                    shouldPreventDefault: shouldKeyboardActionPreventDefault,
                    shouldStopPropagation: shouldKeyboardActionStopPropagation,
                },
            ),
        [
            contextRef,
            focusedItem,
            focusedPath,
            getState,
            isItemFocusable,
            items,
            onClose,
            onSelectHandle,
            onUnhandledKeyDown,
            shouldKeyboardActionPreventDefault,
            shouldKeyboardActionStopPropagation,
        ],
    );

    return (
        <div className={b()} style={{ width, maxWidth, maxHeight }} data-testid={dataTestId}>
            <UiTreeviewRoot
                handleKeyDown={handleKeyDown}
                ariaAttributes={ariaAttributes}
                focusedItem={focusedItem}
            >
                {items.map((item, index) => (
                    <UITreeviewItem
                        ItemComponent={ItemComponent}
                        onSelectHandle={onSelectHandle}
                        getState={getState}
                        focusedItem={focusedItem}
                        selectedItemId={selectedItemId}
                        itemDataTestId={itemDataTestId}
                        isCompact={isCompact}
                        item={item}
                        key={index}
                        path={[index]}
                    />
                ))}
            </UiTreeviewRoot>
        </div>
    );
}
