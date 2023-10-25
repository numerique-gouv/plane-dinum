import { useRouter } from "next/router";

//hook
import useMyIssues from "hooks/my-issues/use-my-issues";
import useIssuesView from "hooks/use-issues-view";
import useProfileIssues from "hooks/use-profile-issues";
// components
import { SingleBoard } from "components/core/views/board-view/single-board";
import { IssuePeekOverview } from "components/issues";
// icons
import { StateGroupIcon } from "components/icons";
// helpers
import { addSpaceIfCamelCase } from "helpers/string.helper";
// types
import { ICurrentUserResponse, IIssue, IIssueViewProps, IState, UserAuth } from "types";

type Props = {
  addIssueToGroup: (groupTitle: string) => void;
  disableUserActions: boolean;
  disableAddIssueOption?: boolean;
  dragDisabled: boolean;
  handleIssueAction: (issue: IIssue, action: "copy" | "delete" | "edit") => void;
  handleDraftIssueAction?: (issue: IIssue, action: "edit" | "delete") => void;
  handleTrashBox: (isDragging: boolean) => void;
  openIssuesListModal?: (() => void) | null;
  removeIssue: ((bridgeId: string, issueId: string) => void) | null;
  myIssueProjectId?: string | null;
  handleMyIssueOpen?: (issue: IIssue) => void;
  states: IState[] | undefined;
  user: ICurrentUserResponse | undefined;
  userAuth: UserAuth;
  viewProps: IIssueViewProps;
};

export const AllBoards: React.FC<Props> = ({
  addIssueToGroup,
  disableUserActions,
  disableAddIssueOption = false,
  dragDisabled,
  handleIssueAction,
  handleDraftIssueAction,
  handleTrashBox,
  openIssuesListModal,
  myIssueProjectId,
  handleMyIssueOpen,
  removeIssue,
  states,
  user,
  userAuth,
  viewProps,
}) => {
  const router = useRouter();
  const { workspaceSlug, projectId, userId } = router.query;

  const isProfileIssue =
    router.pathname.includes("assigned") ||
    router.pathname.includes("created") ||
    router.pathname.includes("subscribed");

  const isMyIssue = router.pathname.includes("my-issues");

  const { mutateIssues } = useIssuesView();
  const { mutateMyIssues } = useMyIssues(workspaceSlug?.toString());
  const { mutateProfileIssues } = useProfileIssues(workspaceSlug?.toString(), userId?.toString());

  const { displayFilters, groupedIssues } = viewProps;

  return (
    <>
      <IssuePeekOverview
        handleMutation={() =>
          isMyIssue ? mutateMyIssues() : isProfileIssue ? mutateProfileIssues() : mutateIssues()
        }
        projectId={myIssueProjectId ? myIssueProjectId : projectId?.toString() ?? ""}
        workspaceSlug={workspaceSlug?.toString() ?? ""}
        readOnly={disableUserActions}
      />
      {groupedIssues ? (
        <div className="horizontal-scroll-enable flex h-full gap-x-4 p-8 bg-custom-background-90">
          {Object.keys(groupedIssues).map((singleGroup, index) => {
            const currentState =
              displayFilters?.group_by === "state"
                ? states?.find((s) => s.id === singleGroup)
                : null;

            if (!displayFilters?.show_empty_groups && groupedIssues[singleGroup].length === 0)
              return null;

            return (
              <SingleBoard
                key={index}
                addIssueToGroup={() => addIssueToGroup(singleGroup)}
                currentState={currentState}
                disableUserActions={disableUserActions}
                disableAddIssueOption={disableAddIssueOption}
                dragDisabled={dragDisabled}
                groupTitle={singleGroup}
                handleIssueAction={handleIssueAction}
                handleDraftIssueAction={handleDraftIssueAction}
                handleTrashBox={handleTrashBox}
                openIssuesListModal={openIssuesListModal ?? null}
                handleMyIssueOpen={handleMyIssueOpen}
                removeIssue={removeIssue}
                user={user}
                userAuth={userAuth}
                viewProps={viewProps}
              />
            );
          })}
          {!displayFilters?.show_empty_groups && (
            <div className="h-full w-96 flex-shrink-0 space-y-2 p-1">
              <h2 className="text-lg font-semibold">Hidden groups</h2>
              <div className="space-y-3">
                {Object.keys(groupedIssues).map((singleGroup, index) => {
                  const currentState =
                    displayFilters?.group_by === "state"
                      ? states?.find((s) => s.id === singleGroup)
                      : null;

                  if (groupedIssues[singleGroup].length === 0)
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 rounded bg-custom-background-90 p-2 shadow"
                      >
                        <div className="flex items-center gap-2">
                          {currentState && (
                            <StateGroupIcon
                              stateGroup={currentState.group}
                              color={currentState.color}
                              height="16px"
                              width="16px"
                            />
                          )}
                          <h4 className="text-sm capitalize">
                            {displayFilters?.group_by === "state"
                              ? addSpaceIfCamelCase(currentState?.name ?? "")
                              : addSpaceIfCamelCase(singleGroup)}
                          </h4>
                        </div>
                        <span className="text-xs text-custom-text-200">0</span>
                      </div>
                    );
                })}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};
