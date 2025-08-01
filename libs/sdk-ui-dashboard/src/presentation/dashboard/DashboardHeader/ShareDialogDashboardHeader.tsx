// (C) 2020-2025 GoodData Corporation
import React, { useCallback } from "react";
import { CurrentUserPermissions, useToastMessage } from "@gooddata/sdk-ui-kit";
import {
    useDashboardSelector,
    selectIsShareDialogOpen,
    useDashboardDispatch,
    uiActions,
    selectPersistedDashboard,
    selectCurrentUser,
    useDashboardCommandProcessing,
    changeSharing,
    selectCanManageWorkspace,
    selectDashboardPermissions,
    useDashboardUserInteraction,
    selectFilterContextFilters,
    selectIsShareGrantVisible,
    selectEnableDashboardShareDialogLink,
} from "../../../model/index.js";
import { ShareDialog, ISharingApplyPayload } from "../../shareDialog/index.js";
import { useBackendStrict, useWorkspaceStrict } from "@gooddata/sdk-ui";
import { messages } from "../../../locales.js";

const useShareDialogDashboardHeader = () => {
    const dispatch = useDashboardDispatch();
    const { addSuccess, addError } = useToastMessage();
    const { shareDialogInteraction } = useDashboardUserInteraction();
    const isShareDialogOpen = useDashboardSelector(selectIsShareDialogOpen);
    const persistedDashboard = useDashboardSelector(selectPersistedDashboard);
    const currentUser = useDashboardSelector(selectCurrentUser);
    const isWorkspaceManager = useDashboardSelector(selectCanManageWorkspace);
    const dashboardPermissions = useDashboardSelector(selectDashboardPermissions);
    const dashboardFilters = useDashboardSelector(selectFilterContextFilters);
    const isShareGrantHidden = !useDashboardSelector(selectIsShareGrantVisible);
    const isDashboardShareDialogLinkEnabled = useDashboardSelector(selectEnableDashboardShareDialogLink);
    const backend = useBackendStrict();
    const workspace = useWorkspaceStrict();
    const applyShareGrantOnSelect = isDashboardShareDialogLinkEnabled;
    const showDashboardShareLink = isDashboardShareDialogLinkEnabled;

    const { run: runChangeSharing, status } = useDashboardCommandProcessing({
        commandCreator: changeSharing,
        successEvent: "GDC.DASH/EVT.SHARING.CHANGED",
        errorEvent: "GDC.DASH/EVT.COMMAND.FAILED",
        onSuccess: () => {
            addSuccess(messages.messagesSharingChangedSuccess);
        },
        onError: () => {
            addError(messages.messagesSharingChangedError);
        },
    });

    const isGranteeShareLoading = status === "running";

    const closeShareDialog = useCallback(() => dispatch(uiActions.closeShareDialog()), [dispatch]);

    const onCloseShareDialog = useCallback(() => {
        closeShareDialog();
    }, [closeShareDialog]);

    const onApplyShareDialog = useCallback(
        (payload: ISharingApplyPayload, closeOnApply = true) => {
            if (closeOnApply) {
                closeShareDialog();
            }
            runChangeSharing(payload);
        },
        [closeShareDialog, runChangeSharing],
    );

    const onErrorShareDialog = useCallback(() => {
        dispatch(uiActions.closeShareDialog());
        addError(messages.messagesSharingDialogError);
    }, [dispatch, addError]);

    const onShareLinkCopy = useCallback(
        (shareLink: string) => {
            navigator.clipboard.writeText(shareLink);
            addSuccess(messages.messagesShareLinkCopied);
        },
        [addSuccess],
    );

    return {
        backend,
        workspace,
        isShareDialogOpen,
        persistedDashboard,
        currentUser,
        onCloseShareDialog,
        onApplyShareDialog,
        onErrorShareDialog,
        onInteractionShareDialog: shareDialogInteraction,
        isLockingSupported: isWorkspaceManager,
        isCurrentUserWorkspaceManager: isWorkspaceManager,
        dashboardPermissions,
        dashboardFilters,
        isShareGrantHidden,
        applyShareGrantOnSelect,
        showDashboardShareLink,
        onShareLinkCopy,
        isGranteeShareLoading,
    };
};

/**
 * @internal
 */
export const ShareDialogDashboardHeader = (): JSX.Element | null => {
    const {
        backend,
        workspace,
        isShareDialogOpen,
        persistedDashboard,
        currentUser,
        onCloseShareDialog,
        onApplyShareDialog,
        onErrorShareDialog,
        onInteractionShareDialog,
        isLockingSupported,
        isCurrentUserWorkspaceManager,
        dashboardPermissions,
        dashboardFilters,
        isShareGrantHidden,
        applyShareGrantOnSelect,
        showDashboardShareLink,
        onShareLinkCopy,
        isGranteeShareLoading,
    } = useShareDialogDashboardHeader();

    if (!isShareDialogOpen) {
        return null;
    }

    const currentUserPermissions: CurrentUserPermissions = {
        canEditAffectedObject: dashboardPermissions.canEditDashboard,
        canEditLockedAffectedObject: dashboardPermissions.canEditLockedDashboard,
        canShareAffectedObject: dashboardPermissions.canShareDashboard,
        canShareLockedAffectedObject: dashboardPermissions.canShareLockedDashboard,
        canViewAffectedObject: dashboardPermissions.canViewDashboard,
    };

    return (
        <ShareDialog
            backend={backend}
            workspace={workspace}
            isVisible={isShareDialogOpen}
            currentUser={currentUser}
            sharedObject={persistedDashboard!}
            onCancel={onCloseShareDialog}
            onApply={onApplyShareDialog}
            onError={onErrorShareDialog}
            isLockingSupported={isLockingSupported}
            isCurrentUserWorkspaceManager={isCurrentUserWorkspaceManager}
            currentUserPermissions={currentUserPermissions}
            dashboardFilters={dashboardFilters}
            onInteraction={onInteractionShareDialog}
            isShareGrantHidden={isShareGrantHidden}
            applyShareGrantOnSelect={applyShareGrantOnSelect}
            showDashboardShareLink={showDashboardShareLink}
            onShareLinkCopy={onShareLinkCopy}
            isGranteeShareLoading={isGranteeShareLoading}
        />
    );
};
